package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.configuration.JwtUtil;
import com.kick_off.kick_off.dto.RequestResponse;
import com.kick_off.kick_off.dto.auth.LoginRequestDto;
import com.kick_off.kick_off.dto.auth.LoginResponseDto;
import com.kick_off.kick_off.dto.auth.TokenRefreshRequestDto;
import com.kick_off.kick_off.dto.auth.TokenRefreshResponseDto;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.model.authentication.RefreshToken;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import com.kick_off.kick_off.service.authentication.RefreshTokenServiceImpl;
import com.kick_off.kick_off.service.authentication.UserDetailsServiceImpl;
import com.kick_off.kick_off.service.authentication.UserManagementService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {

    private final UserManagementService userManagementService;
    private final RefreshTokenServiceImpl refreshTokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public UserManagementController(UserManagementService userManagementService, RefreshTokenServiceImpl refreshTokenService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.userManagementService = userManagementService;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse registerData) {
        return ResponseEntity.ok(userManagementService.register(registerData));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginData) {
        return ResponseEntity.ok(userManagementService.login(loginData));
    }

    @DeleteMapping("/auth/logout")
    public ResponseEntity<String> logout(@RequestBody TokenRefreshRequestDto request) {
        System.out.println("I'm in controller!");
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body("Logout successful. Refresh token deleted.");
    }

    @PostMapping("/auth/refresh-token")
    public ResponseEntity<TokenRefreshResponseDto> refreshToken(@RequestBody TokenRefreshRequestDto request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtil.generateToken(user);
                    return ResponseEntity.status(HttpStatus.OK).body(new TokenRefreshResponseDto(token, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException(requestRefreshToken + " - Refresh token is not in database"));
    }

    @GetMapping("/users/me/{id}")
    public ResponseEntity<UserDto> getLoggedInUser(@PathVariable(name = "id") Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + id + " not found."));

        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getRole().toString()
        );

        return ResponseEntity.status(HttpStatus.OK).body(userDto);
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
