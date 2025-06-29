package com.kick_off.kick_off.dto.match;

import com.kick_off.kick_off.dto.tournament.TournamentDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class MatchListDto {

    private List<MatchDto> matchesList;
    private long totalPages;
    private int pagesBeforeToday;
}
