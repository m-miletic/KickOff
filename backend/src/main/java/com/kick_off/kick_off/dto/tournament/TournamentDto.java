package com.kick_off.kick_off.dto.tournament;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

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
}
