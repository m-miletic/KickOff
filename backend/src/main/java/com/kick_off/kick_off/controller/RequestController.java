package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.request.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.paginationFilters.PaginationFilters;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.RequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/approver/{userId}")
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByApproverId(@PathVariable Long userId, @ModelAttribute PaginationFilters filters) {

        System.out.println("Pagination Filters: " + filters.toString());

        RequestListDto requests = requestService.getRequestsByApproverId(userId, filters);
        ApiResponse<RequestListDto> response = ApiResponse.<RequestListDto>builder()
                .message("Successfully retrieved all requests by approver.")
                .data(requests)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/requester/{userId}")
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByRequesterId(@PathVariable Long userId, @ModelAttribute PaginationFilters filters) {
        System.out.println("UserId: " + userId);
        RequestListDto requests = requestService.getRequestsByRequesterId(userId, filters);
        for(RequestDto r : requests.getRequests()) {
            System.out.println("RequestDto: " + r.toString());
        }
        ApiResponse<RequestListDto> response = ApiResponse.<RequestListDto>builder()
                .message("Successfully retrieved all requests by requester.")
                .data(requests)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PostMapping("/enroll-team")
    public ResponseEntity<ApiResponse<RequestDto>> createEnrollTeamRequest(@RequestBody CreateEnrollTeamRequestDto request) {
        RequestDto requestDto = requestService.createEnrollTeamRequest(request);
        ApiResponse<RequestDto> response = ApiResponse.<RequestDto>builder()
                .message("Successfully created request for enrolling a team in tournament.")
                .data(requestDto)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/team/{requesterId}")
    public ResponseEntity<ApiResponse<Void>> createTeamRegistrationRequest(@PathVariable Long requesterId) {
        requestService.createTeamRegistrationRequest(requesterId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Successfully created request for team creation.")
                .data(null)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/tournament/{requesterId}")
    public ResponseEntity<ApiResponse<Void>> createTournamentCreationRequest(@PathVariable Long requesterId) {
        requestService.createTournamentCreationRequest(requesterId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Successfully created request for creating a tournament.")
                .data(null)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<RequestDto>> updateRequest(@RequestBody UpdateRequestStatusDto request) {
        RequestDto requestDto = requestService.updateRequest(request);
        System.out.println("RequestDto: " + requestDto);
        ApiResponse<RequestDto> response = ApiResponse.<RequestDto>builder()
                .message("Request status updated.")
                .data(requestDto)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
