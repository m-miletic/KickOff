package com.kick_off.kick_off.dto.request;

import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.Status;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoleChangeRequestDto {
    private Long requesterId;
    private Long requestId;
    private Status status;
    private Role newRole;
}
