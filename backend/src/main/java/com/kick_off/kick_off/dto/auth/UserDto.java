package com.kick_off.kick_off.dto.auth;

import com.kick_off.kick_off.model.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@ToString
public class UserDto {

    private Long id;
    private String username;
    private Role role;
}
