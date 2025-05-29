package com.kick_off.kick_off.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdateRequestDto {

    private String status;
    private Boolean requestFulfilled;
}
