package com.kick_off.kick_off.dto.auth;

import com.kick_off.kick_off.model.authentication.RefreshToken;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginResponseDto {

    private String accessToken;
    private RefreshTokenDto refreshToken;
}
