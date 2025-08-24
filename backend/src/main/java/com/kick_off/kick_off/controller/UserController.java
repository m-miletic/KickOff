package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.UserDto;
import com.kick_off.kick_off.dto.auth.UserListDto;
import com.kick_off.kick_off.dto.paginationFilters.UserPaginationFilter;
import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.request.RoleChangeRequestDto;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.RequestService;
import com.kick_off.kick_off.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RequestService requestService;

    public UserController(UserService userService, RequestService requestService) {
        this.userService = userService;
        this.requestService = requestService;
    }

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable Long id) {
        UserDto user = userService.getUser(id);
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .message("Successfully retrieved user")
                .data(user)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    ResponseEntity<ApiResponse<UserListDto>> getUsers(@ModelAttribute UserPaginationFilter filters) {
        try {
            UserListDto users = userService.getUsers(filters);
            return ResponseEntity.ok(ApiResponse.<UserListDto>builder()
                    .message("Users retrieved successfully!")
                    .success(true)
                    .data(users)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserListDto>builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<UserDto>> deleteUserById(@PathVariable Long id) {
        UserDto deletedUser = userService.deleteUser(id);
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .message("User deleted successfully.")
                .data(deletedUser)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/role-change")
    ResponseEntity<ApiResponse<List<RequestDto>>> updateUsersRole(@RequestBody RoleChangeRequestDto request) {
        try {
            userService.updateUsersRole(request);
            User approver = userService.findByRole(Role.ADMIN);
            List<RequestDto> requests = requestService.getRequestsByApproverId(approver.getId());

            ApiResponse<List<RequestDto>> response = ApiResponse.<List<RequestDto>>builder()
                    .message("Successfully updated users role")
                    .data(requests)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<List<RequestDto>> errorResponse = ApiResponse.<List<RequestDto>>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

}
