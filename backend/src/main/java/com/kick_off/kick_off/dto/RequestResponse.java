package com.kick_off.kick_off.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.kick_off.kick_off.model.authentication.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@ToString
public class RequestResponse {
    private int statusCode;
    private String error;
    private String message;
    private String role;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private String username;
    private String password;
    private User user;
    private UserDetails userDetails;
    private List<User> userList;


}
