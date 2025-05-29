package com.kick_off.kick_off.dto.tournament.requestParams;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TournamentFilterParamsDto {

    private int pageSize;
    private Long teamRepresentativeId;
    private Long tournamentId;
}
