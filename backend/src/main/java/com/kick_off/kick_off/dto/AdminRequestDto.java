package com.kick_off.kick_off.dto;

import com.kick_off.kick_off.model.Status;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminRequestDto {

    private Status status;
    private String changeRoleTo;
    private boolean approved;

}
