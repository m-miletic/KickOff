package com.kick_off.kick_off.dto.request;

import com.kick_off.kick_off.model.RequestType;
import com.kick_off.kick_off.model.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateRequestDto {

    private Long requesterId;
    private Long approverId;
    private RequestType requestType;
    private String message;
    private Boolean requestFulfilled;
    private Status status;
}
