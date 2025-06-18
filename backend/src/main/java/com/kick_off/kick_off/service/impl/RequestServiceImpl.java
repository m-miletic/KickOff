package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.dto.tournament.TournamentCreationRequestDto;
import com.kick_off.kick_off.model.*;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.model.Request;
import com.kick_off.kick_off.repository.RequestRepository;
import com.kick_off.kick_off.repository.TeamRepository;
import com.kick_off.kick_off.repository.TournamentRepository;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import com.kick_off.kick_off.service.RequestService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public RequestServiceImpl(RequestRepository requestRepository, ModelMapper modelMapper, UserRepository userRepository, TeamRepository teamRepository, TournamentRepository tournamentRepository) {
        this.requestRepository = requestRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    public void createRoleChangeRequest(CreateRoleChangeRequestDto request) {
        // requester == team_representative
        Long requesterId = request.getRequesterId();
        Role desiredRole = request.getDesiredRole();

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("Requester with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role " + Role.ADMIN + " not found"));

        boolean representsTeam = teamRepository.existsByRepresentative(requester);
        if (representsTeam) {
            throw new RuntimeException("Can't change a role while still representing a team.");
        }

        boolean hostsTournament = tournamentRepository.existsByOrganizer(requester);
        if (hostsTournament) {
            throw new RuntimeException("Can't change a role while hosting a tournament");
        }

        boolean alreadyHasPendingReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatus(requesterId, RequestType.ROLE_CHANGE, Status.PENDING);
        if (alreadyHasPendingReq) {
            throw new RuntimeException("Role change request already pending");
        }

        Request newRequest = new Request();
        newRequest.setDesiredRole(desiredRole);
        newRequest.setRequestType(RequestType.ROLE_CHANGE);
        newRequest.setRequester(requester);
        newRequest.setApprover(approver);
        newRequest.setMessage("I would like to change my role.");
        newRequest.setRequestFulfilled(false);
        newRequest.setTimeCreated(LocalDateTime.now());
        newRequest.setStatus(Status.PENDING);

        requestRepository.save(newRequest);
    }

    @Override
    public void createEnrollTeamRequest(CreateEnrollTeamRequestDto request) {
        Long requesterId = request.getTeamRepresentativeId();
        Long tournamentId = request.getTournamentId();

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + tournamentId + " not found."));

        Long approverId = tournament.getOrganizer().getId();

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + requesterId + " not found."));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + approverId + " not found."));

        List<Request> requests = requestRepository.findAllByRequester_IdAndRequestTypeAndStatusNot(requesterId, RequestType.TOURNAMENT_ENROLLMENT, Status.DECLINED);

        int count = requests.size();

        // ako vec postoji zahtjev gdje npr. requesterId=2 zeli sudjelovat u turniru(approverId=5) nacit poruku da je vec posla zahtjev za pristupit turniru
        Optional<Request> req = requestRepository.findByRequester_IdAndApprover_Id(requesterId, approverId);

        if (req.isPresent()) {
            if(req.get().getStatus().toString().equals("DECLINED")) {
                System.out.println("In declined");
                throw new RuntimeException("Enrollment request was declined");
            } else if (req.get().getStatus().toString().equals("APPROVED")) {
                System.out.println("In approved");
                throw new RuntimeException("Already enrolled to tournament");
            } else {
                System.out.println("In already sent");
                throw new IllegalStateException("Enrollment request already sent.");
            }

        } else if (count >= 2) {
            throw new IllegalStateException("max number of tournament participation per team is 2");
        } else {
            Request newRequest = new Request();
            newRequest.setRequester(requester);
            newRequest.setApprover(approver);
            newRequest.setTimeCreated(LocalDateTime.now());
            newRequest.setStatus(Status.PENDING);
            newRequest.setRequestType(RequestType.TOURNAMENT_ENROLLMENT);
            newRequest.setMessage("I want to enroll my team to your tournament");
            requestRepository.save(newRequest);
        }
    }

    @Override
    public void createTeamRegistrationRequest(TeamRegistrationRequestDto request) {
        Long requesterId = request.getTeamRepresentativeId();
        /*String desiredTeamName = request.getTeamName();*/

        User representative = userRepository.findById(requesterId)
                        .orElseThrow(() -> new EntityNotFoundException("User(requester) with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role: " + Role.ADMIN + " not found."));

        boolean alreadyRepresentsTeam = teamRepository.existsByRepresentative(representative);

        /*boolean teamNameExists = teamRepository.existsByTeamName(desiredTeamName);*/

        boolean alreadyHasPendingReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatus(requesterId, RequestType.TEAM_REGISTRATION, Status.PENDING);

        if(alreadyRepresentsTeam) {
            throw new RuntimeException("You already represent a team.");
        } else if (alreadyHasPendingReq) {
            throw new RuntimeException("Team registration request already pending.");
        }
        /*else if (teamNameExists) {
            throw new RuntimeException("Team with this name already exists");
        }*/ else {
            Request newRequest = new Request();
            newRequest.setRequester(representative);
            newRequest.setApprover(approver);
            newRequest.setTimeCreated(LocalDateTime.now());
            newRequest.setStatus(Status.PENDING);
            newRequest.setRequestType(RequestType.TEAM_REGISTRATION);
            newRequest.setMessage("I would like to register a team");

            requestRepository.save(newRequest);
        }
    }

    @Override
    public void createTournamentCreationRequest(TournamentCreationRequestDto request) {
        Long requesterId = request.getTournamentOrganizerId();

        User tournamentOrganizer = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User(organizer) with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role: " + Role.ADMIN + " not found."));

        boolean alreadyHostsATournament = tournamentRepository.existsByOrganizer(tournamentOrganizer);

        boolean alreadyHasPendingReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatus(requesterId, RequestType.TOURNAMENT_CREATION, Status.PENDING);

        if(alreadyHostsATournament) {
            throw new RuntimeException("You already host a tournament.");

        } else if (alreadyHasPendingReq) {
            throw new RuntimeException("Tournament creation request already pending.");
        } else {
            Request newRequest = new Request();
            newRequest.setRequester(tournamentOrganizer);
            newRequest.setApprover(approver);
            newRequest.setTimeCreated(LocalDateTime.now());
            newRequest.setStatus(Status.PENDING);
            newRequest.setRequestType(RequestType.TOURNAMENT_CREATION);
            newRequest.setMessage("I would like to host a tournament.");

            requestRepository.save(newRequest);
        }
    }


    private long calculateTotalPages(long totalReq, int pageSize) {
        long totalPages = 0;
        long reminder = 0;
        totalPages = totalReq / pageSize;
        reminder = totalReq % pageSize;
        if(reminder > 0) {
            totalPages += 1;
        }
        return totalPages;
    }

    @Override
    public RequestListDto getRequestsByApproverId(GetRequestsDto filters) {
        Page<Request> pageRequests;

        Sort.Direction direction = filters.getSortDirection().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Status enumStatus = (!filters.getStatus().equals("ALL")) ? Status.valueOf(filters.getStatus()) : null;
        PageRequest pageRequest = PageRequest.of(filters.getPageNumber() - 1, filters.getPageSize(), Sort.by(direction, filters.getSortField()));

        LocalDateTime startDate = switch (filters.getTimeCreated()) {
            case "Today" -> LocalDateTime.now().minusDays(1);
            case "Last 7 days" -> LocalDateTime.now().minusDays(7);
            case "Last month" -> LocalDateTime.now().minusMonths(1);
            case "Last year" -> LocalDateTime.now().minusYears(1);
            default -> null;
        };
        Long approverId = filters.getUserId();

        if(startDate != null) {
            pageRequests = (enumStatus != null) ?
                    requestRepository.findByTimeCreatedBetweenAndStatusAndApprover_Id(startDate, LocalDateTime.now(), enumStatus, approverId, pageRequest)
                    :
                    requestRepository.findByTimeCreatedBetweenAndApprover_Id(startDate, LocalDateTime.now(), approverId, pageRequest);
        } else {
            pageRequests = (enumStatus != null) ?
                    requestRepository.findAllByStatusAndApprover_Id(enumStatus, approverId, pageRequest)
                    :
                    requestRepository.findAllByApprover_Id(approverId, pageRequest);
        }

        long totalRequests = pageRequests.getTotalElements();
        long totalPages = calculateTotalPages(totalRequests, filters.getPageSize());



        List<RequestDto> requestsDto = new ArrayList<>();
        requestsDto = pageRequests
                .stream()
                .map(r ->
                        modelMapper.map(r, RequestDto.class)).toList();

        return RequestListDto.builder()
                .requests(requestsDto)
                .totalPages(totalPages)
                .totalRequests(totalRequests)
                .build();
    }

    @Override
    public RequestListDto getRequestsByRequesterId(GetRequestsDto filters) {
        Page<Request> pageRequests;

        Sort.Direction direction = filters.getSortDirection().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Status enumStatus = (!filters.getStatus().equals("ALL")) ? Status.valueOf(filters.getStatus()) : null;
        PageRequest pageRequest = PageRequest.of(filters.getPageNumber() - 1, filters.getPageSize(), Sort.by(direction, filters.getSortField()));

        LocalDateTime startDate = switch (filters.getTimeCreated()) {
            case "Today" -> LocalDateTime.now().minusDays(1);
            case "Last 7 days" -> LocalDateTime.now().minusDays(7);
            case "Last month" -> LocalDateTime.now().minusMonths(1);
            case "Last year" -> LocalDateTime.now().minusYears(1);
            default -> null;
        };
        Long requesterId = filters.getUserId();

        if(startDate != null) {
            pageRequests = (enumStatus != null) ?
                    requestRepository.findByTimeCreatedBetweenAndStatusAndRequester_Id(startDate, LocalDateTime.now(), enumStatus, requesterId, pageRequest)
                    :
                    requestRepository.findByTimeCreatedBetweenAndRequester_Id(startDate, LocalDateTime.now(), requesterId, pageRequest);
        } else {
            pageRequests = (enumStatus != null) ?
                    requestRepository.findAllByStatusAndRequester_Id(enumStatus, requesterId, pageRequest)
                    :
                    requestRepository.findAllByRequester_Id(requesterId, pageRequest);
        }

        long totalRequests = pageRequests.getTotalElements();
        long totalPages = calculateTotalPages(totalRequests, filters.getPageSize());

        List<RequestDto> requestsDto = new ArrayList<>();
        requestsDto = pageRequests
                .stream()
                .map(r ->
                        modelMapper.map(r, RequestDto.class)).toList();

        return RequestListDto.builder()
                .requests(requestsDto)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public List<RequestDto> getRequestsByApproverId(Long approverId) {
        List<Request> requests = requestRepository.findAllByApprover_Id(approverId);
        List<RequestDto> requestDtos = requests
                .stream()
                .map(r ->
                        modelMapper.map(r, RequestDto.class)).toList();

        return requestDtos;
    }


    @Override
    public RequestDto getRequestById(Long id) {
        Request request = requestRepository.findById(id).get();
        RequestDto response = modelMapper.map(request, RequestDto.class);
        return response;
    }


    @Override
    public RequestDto updateRequest(UpdateRequestStatusDto request) {
        Long requestId = request.getRequestId();
        Status status = Status.valueOf(request.getStatus());

        Request r = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id: " + requestId + " not found."));

        r.setStatus(status);
        if (status.equals(Status.DECLINED)) {
            r.setRequestFulfilled(true);
        }

        requestRepository.save(r);

        RequestDto requestDto = modelMapper.map(r, RequestDto.class);
        return requestDto;
    }



}
