package com.kick_off.kick_off.dto.match;


import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.dto.team.LightTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class LightMatchDto {

    private Long id;
    private String name;
    private LocalDateTime matchDate;

    // ovo stvara problem mogu li razlikovat all matches da znan koji je bia home a koji away? u impl ubacit nesto
/*
    private LightTeamDto homeTeam;
    private LightTeamDto awayTeam;*/

    private StadiumDto stadium;

    private Integer homeTeamGoals;
    private Integer awayTeamGoals;

    private Boolean isHomeMatch;
}
