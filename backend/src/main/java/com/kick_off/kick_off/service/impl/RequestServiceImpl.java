package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
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
    public RequestDto createRequest(CreateRequestDto request) {
        System.out.println("RequestType: " + request.getRequestType());
        Long requesterId = request.getRequesterId();
        RequestType requestType = request.getRequestType();

        Request newRequest = new Request();

        if(request.getMessage() != null && !request.getMessage().isEmpty()) {
            newRequest.setMessage(request.getMessage());
        } else {
            switch (request.getRequestType().toString()) {
                case "TOURNAMENT_ENROLLMENT" -> newRequest.setMessage("I want to participate in tournament!");
                case "ROLE_CHANGE" -> newRequest.setMessage("I would like to change my role!");
                case "TEAM_REGISTRATION" -> newRequest.setMessage("I would like to register a new team!");
            }
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + requesterId + " not found."));

        // ovisno o request type-u dodat approver-a
        // case 1 ako je request type za - promjenu role, registracija tima, kreiranje turnira onda ce approver obavezno bit admin
        // case 2 inace je onaj koji se posalje u http requestu

        User approver = new User();

        if (requestType.equals(RequestType.TOURNAMENT_ENROLLMENT)) {
            Long approverId = request.getApproverId();
            approver = userRepository.findById(approverId)
                    .orElseThrow(() -> new EntityNotFoundException("User with id: " + approverId + " not found."));
        } else {
            approver = userRepository.findByRole(Role.ADMIN)
                    .orElseThrow(() -> new EntityNotFoundException("User with role: " + Role.ADMIN + " not found."));
        }

        newRequest.setRequester(requester);
        newRequest.setApprover(approver);
        newRequest.setTimeCreated(LocalDateTime.now());
        newRequest.setStatus(Status.PENDING);
        newRequest.setRequestType(request.getRequestType());
        newRequest.setRequestFulfilled(request.getRequestFulfilled());
        requestRepository.save(newRequest);
        RequestDto requestDto = modelMapper.map(newRequest, RequestDto.class);
        return requestDto;

    }

    @Override
    public void createRoleChangeRequest(CreateRoleChangeRequestDto request) {
        Long requesterId = request.getRequesterId();
        Role desiredRole = request.getDesiredRole();

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("Requester with id: " + requesterId + " not found."));

        User approver = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("User with role " + Role.ADMIN + " not found"));

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
                throw new RuntimeException("Enrollment request was declined");
            } else if (req.get().getStatus().toString().equals("APPROVED")) {
                throw new RuntimeException("Already enrolled to tournament");
            } else {
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
    public RequestListDto getRequestsByApproverId(RequestFilterParamsDto filters) {
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
                .build();
    }

    @Override
    public RequestListDto getRequestsByRequesterId(RequestFilterParamsDto filters) {
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
    public RequestDto getRequestById(Long id) {
        Request request = requestRepository.findById(id).get();
        RequestDto response = modelMapper.map(request, RequestDto.class);
        return response;
    }


    @Override
    public Request updateRequest(UpdateRequestDto request, Long id) {
        Request requestUpdate = requestRepository.findById(id).orElseThrow();
        requestUpdate.setStatus(Status.valueOf(request.getStatus()));
        requestUpdate.setRequestFulfilled(request.getRequestFulfilled());

        return requestRepository.save(requestUpdate);
    }



}
