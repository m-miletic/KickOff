package com.kick_off.kick_off.controller;

import ch.qos.logback.core.encoder.EchoEncoder;
import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.dto.tournament.sig.TournamentCreationRequestDto;
import com.kick_off.kick_off.model.Request;
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

    @GetMapping("/by-approver")
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByApproverId(@ModelAttribute GetRequestsDto request) {
        try {
            RequestListDto requests = requestService.getRequestsByApproverId(request);
            ApiResponse<RequestListDto> response = ApiResponse.<RequestListDto>builder()
                    .message("Successfully retrieved all requests by approver.")
                    .data(requests)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<RequestListDto> errorResponse = ApiResponse.<RequestListDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/by-requester")
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByRequesterId(@ModelAttribute GetRequestsDto filters) {
        try {
            RequestListDto requests = requestService.getRequestsByRequesterId(filters);
            ApiResponse<RequestListDto> response = ApiResponse.<RequestListDto>builder()
                    .message("Successfully retrieved all requests by requester.")
                    .data(requests)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<RequestListDto> errorResponse = ApiResponse.<RequestListDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/role-change")
    public ResponseEntity<ApiResponse<Void>> createRoleChangeRequest(@RequestBody CreateRoleChangeRequestDto request) {
        try {
            requestService.createRoleChangeRequest(request);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Successfully created request for changing a role.")
                    .data(null)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/enroll-team")
    public ResponseEntity<ApiResponse<Void>> createEnrollTeamRequest(@RequestBody CreateEnrollTeamRequestDto request) {
        System.out.println("request --- " + request.toString());
        try {
            requestService.createEnrollTeamRequest(request);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Successfully created request for enrolling a team in tournament.")
                    .data(null)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/team-creation")
    public ResponseEntity<ApiResponse<Void>> createTeamRegistrationRequest(@RequestBody TeamRegistrationRequestDto request) {
        try {
            requestService.createTeamRegistrationRequest(request);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Successfully created request for team creation.")
                    .data(null)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/tournament-creation")
    public ResponseEntity<ApiResponse<Void>> createTournamentCreationRequest(@RequestBody TournamentCreationRequestDto request) {
        try {
            requestService.createTournamentCreationRequest(request);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Successfully created request for creating a tournament.")
                    .data(null)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<RequestDto>> updateRequest(@RequestBody UpdateRequestStatusDto request) {
        try {
            RequestDto requestDto = requestService.updateRequest(request);
            System.out.println("RequestDto: " + requestDto);
            ApiResponse<RequestDto> response = ApiResponse.<RequestDto>builder()
                    .message("Request status updated.")
                    .data(requestDto)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<RequestDto> errorResponse = ApiResponse.<RequestDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

}
