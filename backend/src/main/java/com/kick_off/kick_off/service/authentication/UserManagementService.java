package com.kick_off.kick_off.service.authentication;

import com.kick_off.kick_off.configuration.JwtUtil;
import com.kick_off.kick_off.dto.RequestResponse;
import com.kick_off.kick_off.dto.auth.*;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.RefreshToken;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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

    public RequestResponse register(RequestResponse registrationRequest) {
        RequestResponse response = new RequestResponse();
        try {
            if (userRepository.existsByUsername(registrationRequest.getUsername())) {
                response.setStatusCode(HttpStatus.CONFLICT.value());
                response.setMessage("Username already taken..");

                return response;
            } else {
                User newUser = new User();
                newUser.setUsername(registrationRequest.getUsername());
                newUser.setRole(Role.valueOf("USER"));
                newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

                User savedUser = userRepository.save(newUser);
                if (savedUser.getId() != null) {
                    response.setUser(savedUser);  // mapirat u DTO - ne vracat bas sve od User-a
                    response.setMessage("User saved successfully");
                    response.setStatusCode(200);
                }
            }
        } catch (Exception e) {
            System.out.println("Error while registering user: " + e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setError(e.getMessage());
        }

        return response;
    }

    public LoginResponseDto login(LoginRequestDto loginRequest) {
        LoginResponseDto response = new LoginResponseDto();

        try {
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


            response.setAccessToken(jwt);
            response.setRefreshToken(refreshTokenDto);
            response.setMessage("Successfully logged in");
            response.setStatusCode(HttpStatus.OK.value());

            // nece bacit EntityNotFoundException iako ga ne nade nego ce bacit BadCredentialsException - vidit kod za jwt !
        } catch (BadCredentialsException e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            response.setMessage("Invalid email or password.");
        } catch (EntityNotFoundException e) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("User not found.");
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("Unexpected error occurred.");
        }

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
