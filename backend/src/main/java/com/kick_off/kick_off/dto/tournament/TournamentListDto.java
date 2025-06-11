package com.kick_off.kick_off.dto.tournament;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class TournamentListDto {

    private List<TournamentDto> tournamentsList;
    private Long totalPages;

}
