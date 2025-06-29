package com.kick_off.kick_off.dto.tournament;

import com.kick_off.kick_off.dto.auth.UserDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank
    @Size(min = 5, max = 50, message = "Tournament name must be between 5 and 50 characters")
    private String tournamentName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
    private UserDto organizer;
    @Min(value = 3, message = "Must be at lest 3 teams to create a tournament")
    private int maxTeams;

    private List<TeamDto> teams;
    private List<MatchDto> matchesList;

}

