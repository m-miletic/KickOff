package com.kick_off.kick_off.dto;

import com.kick_off.kick_off.model.RequestType;
import com.kick_off.kick_off.model.Status;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRequestDtoRes {

    private RequestType requestType;
    private String role;
    private String message;
    private Long requesterId;
    private LocalDateTime timeCreated;
    private Status status;
}
