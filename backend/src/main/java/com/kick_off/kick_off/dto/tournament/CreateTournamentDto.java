package com.kick_off.kick_off.dto.tournament;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class CreateTournamentDto {

    @NotBlank
    @Size(min = 5, max = 50, message = "Tournament name must be between 5 and 50 characters")
    private String tournamentName;
    private LocalDate startDate;
    private LocalDate endDate;
    @Min(value = 3, message = "Must be at lest 3 teams to create a tournament")
    private int maxTeams;
    private String details;
    private Long organizerId;
    private Long requestId;
}
