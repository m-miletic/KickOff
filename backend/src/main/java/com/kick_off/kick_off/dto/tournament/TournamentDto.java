package com.kick_off.kick_off.dto.tournament;

import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class TournamentDto {
    private Long id;
    private String tournamentName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
    private Long organizerId;

    // ovo bi tribalo bit ok
    private List<TeamDto> teams;
    private List<MatchDto> matchesList;
}
