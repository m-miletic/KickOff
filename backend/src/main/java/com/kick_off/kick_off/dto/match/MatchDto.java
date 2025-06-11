package com.kick_off.kick_off.dto.match;

import com.kick_off.kick_off.dto.team.LightTeamDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class MatchDto {
    
    private Long id;
    private String name;
    private LocalDate matchDate;

    private LightTeamDto homeTeam;
    private LightTeamDto awayTeam;
}
