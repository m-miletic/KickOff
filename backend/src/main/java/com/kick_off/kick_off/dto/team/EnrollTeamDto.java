package com.kick_off.kick_off.dto.team;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EnrollTeamDto {
    private Long teamRepresentativeId;
    private Long tournamentOrganizerId;
    private Long requestId;
}
