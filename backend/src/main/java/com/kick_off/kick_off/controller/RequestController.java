package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
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
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByApproverId(@ModelAttribute RequestFilterParamsDto filters) {
        try {
            RequestListDto requests = requestService.getRequestsByApproverId(filters);
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
    public ResponseEntity<ApiResponse<RequestListDto>> fetchRequestsByRequesterId(@ModelAttribute RequestFilterParamsDto filters) {
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
    public ResponseEntity<ApiResponse<Request>> createTeamRegistrationRequest(@RequestBody TeamRegistrationRequestDto request) {
        try {
            Request r = requestService.createTeamRegistrationRequest(request);
            ApiResponse<Request> response = ApiResponse.<Request>builder()
                    .message("Successfully created request for team creation.")
                    .data(r)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Request> errorResponse = ApiResponse.<Request>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateRequest(@RequestBody UpdateRequestDto request, @PathVariable Long requestId) {
        System.out.println("UpdateRequestDto: " + request.toString());
        return new ResponseEntity<>(requestService.updateRequest(request, requestId), HttpStatus.OK);
    }


}
