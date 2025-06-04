package com.kick_off.kick_off.dto.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class RefreshTokenDto {

    private long id;
    private String token;
    private Instant expiryDate;
}
