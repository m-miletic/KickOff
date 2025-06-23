package com.kick_off.kick_off.dto.tournament;


import com.kick_off.kick_off.dto.auth.UserDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class MyTeamTournamentDto {

    // tribat cu ukljucit jos stvari - vidit sta mi sve triba u MyTeam.jsx

    private Long id;
    private String tournamentName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
}
