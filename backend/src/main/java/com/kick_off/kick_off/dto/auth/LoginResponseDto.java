package com.kick_off.kick_off.dto.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginResponseDto {

    private String message;
    private String token;
    private int statusCode;
}
