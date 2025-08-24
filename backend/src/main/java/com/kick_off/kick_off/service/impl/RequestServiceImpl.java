package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.request.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.paginationFilters.PaginationFilters;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.exception.ForbiddenActionException;
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
    public RequestDto createEnrollTeamRequest(CreateEnrollTeamRequestDto request) {
        Long requesterId = request.getTeamRepresentativeId();
        Long tournamentId = request.getTournamentId();

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + tournamentId + " not found."));

        Long approverId = tournament.getOrganizer().getId();

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + requesterId + " not found."));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + approverId + " not found."));

        Team team = teamRepository.findTeamByRepresentative_Id(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("Team with representative id: " + requesterId + " not found."));

        Optional<Request> requestExists = requestRepository.findByRequester_IdAndRequestTypeAndTournament_Id(requesterId, RequestType.TOURNAMENT_ENROLLMENT, tournamentId);

        int teamsEnrolledNum = tournament.getTeams().size();
        int maxAllowedToEnroll = tournament.getMaxTeams();

        if (teamsEnrolledNum >= maxAllowedToEnroll) {
            throw new ForbiddenActionException("Can't enroll. Tournament full.");
        }

        if (requestExists.isPresent()) {
            if ( ((requestExists.get().getStatus().equals(Status.APPROVED)) && (requestExists.get().getRequestFulfilled() == true) && (team.getTournament() == null) )  ) {
                throw new ForbiddenActionException("Team disqualified.Can't enroll again.");
            } else if ((requestExists.get().getStatus().equals(Status.APPROVED)) && (requestExists.get().getRequestFulfilled() == true) && (requestExists.get().getTournament() != null)) {
                throw new ForbiddenActionException("You already participate in tournament.");
            } else if (requestExists.get().getStatus().equals(Status.PENDING) && (requestExists.get().getRequestFulfilled() == false)) {
                throw new ForbiddenActionException("Request pending.");
            } else if (requestExists.get().getStatus().equals(Status.DECLINED) && (requestExists.get().getRequestFulfilled() == true)) {
                throw new ForbiddenActionException("Your request was declined.");
            }
        }



        Request newRequest = new Request();
        newRequest.setRequester(requester);
        newRequest.setApprover(approver);
        newRequest.setMessage("I want to enroll my team to your tournament");
        newRequest.setRequestType(RequestType.TOURNAMENT_ENROLLMENT);
        newRequest.setTimeCreated(LocalDateTime.now());
        newRequest.setStatus(Status.PENDING);
        newRequest.setTournament(tournament);

        requestRepository.save(newRequest);

        return modelMapper.map(newRequest, RequestDto.class);
    }

    @Override
    public void createTeamRegistrationRequest(Long requesterId) {
        /*String desiredTeamName = request.getTeamName();*/

        User representative = userRepository.findById(requesterId)
                        .orElseThrow(() -> new EntityNotFoundException("User(requester) with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role: " + Role.ADMIN + " not found."));

        boolean alreadyRepresentsTeam = teamRepository.existsByRepresentative(representative);

        /*boolean teamNameExists = teamRepository.existsByTeamName(desiredTeamName);*/

        boolean alreadyHasPendingReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatus(requesterId, RequestType.TEAM_REGISTRATION, Status.PENDING);

        boolean alreadyHasApprovedReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatusAndRequestFulfilledFalse(requesterId, RequestType.TEAM_REGISTRATION, Status.APPROVED);

        if(alreadyRepresentsTeam) {
            throw new ForbiddenActionException("You already represent a team.");
        } else if (alreadyHasPendingReq) {
            throw new ForbiddenActionException("Team registration request already pending.");
        } else if (alreadyHasApprovedReq) {
            throw new ForbiddenActionException("Already has an approved request. Proceed to create team");
        }  else {
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
    public void createTournamentCreationRequest(Long requesterId) {

        User tournamentOrganizer = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User(organizer) with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role: " + Role.ADMIN + " not found."));

        boolean alreadyHostsATournament = tournamentRepository.existsByOrganizer(tournamentOrganizer);

        boolean alreadyHasPendingReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatus(requesterId, RequestType.TOURNAMENT_CREATION, Status.PENDING);

        boolean alreadyHasApprovedReq = requestRepository.existsByRequester_IdAndRequestTypeAndStatusAndRequestFulfilledFalse(requesterId, RequestType.TOURNAMENT_CREATION, Status.APPROVED);

        if(alreadyHostsATournament) {
            throw new ForbiddenActionException("You already host a tournament.");

        } else if (alreadyHasPendingReq) {
            throw new ForbiddenActionException("Tournament creation request already pending.");
        } else if (alreadyHasApprovedReq) {
            throw new ForbiddenActionException("Already has an approved request. Proceed to create tournament");
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
    public RequestListDto getRequestsByApproverId(Long id, PaginationFilters filters) {
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
        Long approverId = id;

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
    public RequestListDto getRequestsByRequesterId(Long id, PaginationFilters filters) {
        Page<Request> pageRequests;

        User requester = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Requester with id: " + id + " not found."));

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
        Long requesterId = id;

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
