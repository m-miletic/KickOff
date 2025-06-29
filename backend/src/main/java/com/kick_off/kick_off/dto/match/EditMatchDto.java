package com.kick_off.kick_off.dto.match;

import com.kick_off.kick_off.dto.team.TeamDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class EditMatchDto {

    private LocalDateTime matchDate;
    private Integer homeTeamGoals;
    private Integer awayTeamGoals;
    private TeamDto homeTeam;
    private TeamDto awayTeam;
}
