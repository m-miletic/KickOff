package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
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

    @GetMapping("/by-approver")
    public ResponseEntity<RequestListDto> fetchRequestsByApproverId(@ModelAttribute RequestFilterParamsDto filters) {
        System.out.println("byApproverId: " + filters.toString());
        return new ResponseEntity<>(requestService.getRequestsByApproverId(filters), HttpStatus.OK);
    }

    @GetMapping("/by-requester")
    public ResponseEntity<RequestListDto> fetchRequestsByRequesterId(@ModelAttribute RequestFilterParamsDto filters) {
        System.out.println("byRequesterId: " + filters.toString());
        return new ResponseEntity<>(requestService.getRequestsByRequesterId(filters), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RequestDto>> createRequest(@RequestBody CreateRequestDto request) {
        try {
            RequestDto createdRequest = requestService.createRequest(request);
            ApiResponse<RequestDto> response = ApiResponse.<RequestDto>builder()
                    .message("Successfully created a request")
                    .data(createdRequest)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<RequestDto> errorResponse = ApiResponse.<RequestDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            System.out.println("Failed to create a request object -> Exception: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/enroll-team")
    public void createEnrollTeamRequest(@RequestBody CreateEnrollTeamRequestDto request) {
        System.out.println("CreateEnrollTeamRequestDto: " + request.toString());
        requestService.createEnrollTeamRequest(request);
    }

    @PostMapping("/role-change")
    public void createRoleChangeRequest(@RequestBody CreateRoleChangeRequestDto request) {
        System.out.println("CreateRoleChangeRequestDto: " + request.toString());
        requestService.createRoleChangeRequest(request);
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateRequest(@RequestBody UpdateRequestDto request, @PathVariable Long requestId) {
        System.out.println("UpdateRequestDto: " + request.toString());
        return new ResponseEntity<>(requestService.updateRequest(request, requestId), HttpStatus.OK);
    }


}
