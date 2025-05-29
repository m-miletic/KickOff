package com.kick_off.kick_off.service.authentication;

import com.kick_off.kick_off.dto.RequestResponse;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;

@Component
public class UserManagementService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public RequestResponse register(RequestResponse registrationRequest) {
        RequestResponse response = new RequestResponse();
        try {
            if (userRepository.existsByEmail(registrationRequest.getEmail())) {
                response.setStatusCode(409);
                response.setMessage("User with this email already exists.");
            } else {
                User newUser = new User();
                newUser.setEmail(registrationRequest.getEmail());
                newUser.setRole(Role.valueOf("USER"));
                newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
                // savedUser za razliku od newUser bi triba imat ID
                // koristi se u if-u za provjeru da li je user spremljen u bazu
                User savedUser = userRepository.save(newUser);
                if (savedUser.getId() > 0) {
                    response.setUser(savedUser);
                    response.setMessage("User saved successfully");
                    response.setStatusCode(200);
                }
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
/*            response.setEmail(user.getEmail());*/
            response.setRefreshToken(refreshToken);
/*            response.setRole(user.getRole()); // OK ?*/
            response.setExpirationTime("24Hrs"); // probat s kracim vremenom
            response.setMessage("Successfully logged in");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Transactional
    public Boolean logout(HttpServletRequest request, HttpServletResponse response) {
        /*Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication: " + authentication);
        if(authentication != null && authentication.isAuthenticated()) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
            String token = request.getHeader("Authorization");
            if(token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            } else {
                throw new RuntimeException("Refresh token does not exist");
            }
        }*/

        return true;

    }

    public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
        RequestResponse response = new RequestResponse();
        try {
            String email = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User user = userRepository.findByEmail(email).orElseThrow();

            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(),user)) {
                String newJwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(newJwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfully refreshed the token");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
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
            existingUser.setEmail(updatedUser.getUsername());
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

    public RequestResponse getCurrentlyLoggedUser(String email) {
        RequestResponse response = new RequestResponse();
        try {
            UserDetails user = userRepository.findByEmail(email).orElseThrow();
            response.setUserDetails(user);
            response.setStatusCode(200);
            response.setMessage("User information retrieved successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }



}
