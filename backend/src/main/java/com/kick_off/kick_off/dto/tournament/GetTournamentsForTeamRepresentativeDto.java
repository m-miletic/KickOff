package com.kick_off.kick_off.dto.tournament;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GetTournamentsForTeamRepresentativeDto {
    private Long teamRepresentativeId;
    private int pageSize;
}
