package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.RequestResponse;
import com.kick_off.kick_off.dto.auth.LoginRequestDto;
import com.kick_off.kick_off.dto.auth.LoginResponseDto;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.service.authentication.UserManagementService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse registerData) {
        return ResponseEntity.ok(userManagementService.register(registerData));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginData) {
        return ResponseEntity.ok(userManagementService.login(loginData));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<RequestResponse> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userManagementService.getUserById(userId));
    }

    @PostMapping("/admin/update/{userId}")
    public ResponseEntity<RequestResponse> updateUser(@PathVariable Long userId, @RequestBody User userUpdate) {
        return ResponseEntity.ok(userManagementService.updateUser(userId, userUpdate));
    }

    /*    @GetMapping("/adminuser/get-profile")
        public ResponseEntity<RequestResponse> getMyProfile() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            RequestResponse response = userManagementService.getCurrentlyLoggedUser(email);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }*/
    @DeleteMapping("/admin/delete-user/{userId}")
    public ResponseEntity<RequestResponse> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userManagementService.deleteUser(userId));
    }
}
