package com.kick_off.kick_off.service.authentication;

import com.kick_off.kick_off.configuration.JwtUtil;
import com.kick_off.kick_off.dto.RequestResponse;
import com.kick_off.kick_off.dto.auth.*;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.exception.FieldValidationException;
import com.kick_off.kick_off.exception.ForbiddenActionException;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.RefreshToken;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class UserManagementService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenServiceImpl refreshTokenService;
    private final ModelMapper modelMapper;

    public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, RefreshTokenServiceImpl refreshTokenService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.modelMapper = modelMapper;
    }

    public void register(RegisterRequestDto registerRequestDto) {
        String username = registerRequestDto.getUsername();
        String password = registerRequestDto.getPassword();
        String repeatedPassword = registerRequestDto.getRepeatPassword();
        Role role = Role.valueOf(registerRequestDto.getRole());

        if (userRepository.existsByUsername(username)) {
            throw new FieldValidationException("username", "Username already exists.");
        }
        if (!password.equals(repeatedPassword)) {
            throw new FieldValidationException("repeatPassword", "Passwords don't match");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);

        User savedUser = userRepository.save(newUser);

        /* Ima li razloga za vratit registriranog user-a ? */
        /*UserDto userDto = modelMapper.map(savedUser, UserDto.class);
        return userDto;*/
    }


    public LoginResponseDto login(LoginRequestDto loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User with username: " + loginRequest.getUsername() + " not found."));

        String jwt = jwtUtil.generateToken(user);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        RefreshTokenDto refreshTokenDto = modelMapper.map(refreshToken, RefreshTokenDto.class);

        LoginResponseDto response = new LoginResponseDto();
        response.setAccessToken(jwt);
        response.setRefreshToken(refreshTokenDto);

        System.out.println("Response from Login backend: " + response.toString());

        return response;
    }


    public RequestResponse getAllUsers() {
        RequestResponse response = new RequestResponse();
        try {
            List<User> userList = userRepository.findAll();
            if (!userList.isEmpty()) {
                response.setUserList(userList);
                response.setStatusCode(200);
                response.setMessage("Users retrieved successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("No users found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
        }
        return response;
    }

    public UserDto getUserById(Long id) {
        UserDto response = new UserDto();

            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            response.setRole(user.getRole().toString());
            response.setReqCount(user.getRequests().size());

        return response;
    }

    public RequestResponse deleteUser(Long id) {
        RequestResponse response = new RequestResponse();
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("User deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
        }
        return response;
    }

    public RequestResponse updateUser(Long id, User updatedUser) {
        RequestResponse response = new RequestResponse();
        try {
            User existingUser = userRepository.findById(id).orElseThrow();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setRole(updatedUser.getRole());
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            User savedUser = userRepository.save(existingUser);
            response.setUser(savedUser);
            response.setStatusCode(200);
            response.setMessage("User updated successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }



}
