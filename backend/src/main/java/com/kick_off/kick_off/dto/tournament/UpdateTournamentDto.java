package com.kick_off.kick_off.dto.tournament;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class UpdateTournamentDto {
    private String tournamentName;
    private String details;
    private LocalDate startDate;
    private LocalDate endDate;
}
