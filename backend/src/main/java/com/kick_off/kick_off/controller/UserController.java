package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.dto.novo.UserFilterParamsDto;
import com.kick_off.kick_off.dto.novo.UserListDto;
import com.kick_off.kick_off.dto.request.RoleChangeRequestDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    ResponseEntity<UserListDto> getUsers(@ModelAttribute UserFilterParamsDto filters) {
        System.out.println("Filters: " + filters.toString());
        return new ResponseEntity<>(userService.getUsers(filters),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<UserListDto>> deleteUserById(@ModelAttribute UserFilterParamsDto filters, @PathVariable Long id) {
        try {
            userService.deleteUser(id);
            UserListDto users = userService.getUsers(filters);
            return ResponseEntity.ok(ApiResponse.<UserListDto>builder()
                    .message("User deleted successfully.")
                    .success(true)
                    .data(users)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserListDto>builder() // vidit oce proc s bad request
                    .message(e.getMessage())
                    .success(false)
                    .data(userService.getUsers(filters))
                    .build());
        }
    }

    @PatchMapping("/role-change")
    /*ResponseEntity<ApiResponse<UserDto>> */void updateUsersRole(@RequestBody RoleChangeRequestDto request) {
        System.out.println("updateUsersRole: " + request.toString());
        userService.updateUsersRole(request);
    }
}
