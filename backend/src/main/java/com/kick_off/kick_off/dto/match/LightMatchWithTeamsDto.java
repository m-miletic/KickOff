package com.kick_off.kick_off.dto.match;

import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.dto.team.LightTeamDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
public class LightMatchWithTeamsDto {

    private Long id;
    private String name;
    private LocalDateTime matchDate;

    private LightTeamDto homeTeam;
    private LightTeamDto awayTeam;

    private StadiumDto stadium;

    private Integer homeTeamGoals;
    private Integer awayTeamGoals;

    private Boolean isHomeMatch;
}
