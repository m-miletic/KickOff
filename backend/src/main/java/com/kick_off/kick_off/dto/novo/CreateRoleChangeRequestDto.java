package com.kick_off.kick_off.dto.novo;

import com.kick_off.kick_off.model.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CreateRoleChangeRequestDto {
    private Role desiredRole;
    private Long requesterId;
}
