package com.kick_off.kick_off.dto.request;

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
