package com.kick_off.kick_off.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdateRequestStatusDto {

    private Long requestId;
    private String status;
}
