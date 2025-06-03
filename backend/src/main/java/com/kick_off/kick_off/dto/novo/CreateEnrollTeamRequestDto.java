package com.kick_off.kick_off.dto.novo;

import com.kick_off.kick_off.model.RequestType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CreateEnrollTeamRequestDto {
    private Long teamRepresentativeId;
    private Long tournamentId;
}
