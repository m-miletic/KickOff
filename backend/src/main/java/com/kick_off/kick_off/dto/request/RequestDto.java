package com.kick_off.kick_off.dto.request;

import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.model.RequestType;
import com.kick_off.kick_off.model.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RequestDto {

    private Long id;
    private String message;
    private String timeCreated;
    private String status;
    private UserDto requester;
    private UserDto approver;
    private RequestType requestType;
    private Boolean requestFulfilled;
    private Role desiredRole;
}
