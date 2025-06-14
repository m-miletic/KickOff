package com.kick_off.kick_off.dto.match;

import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import lombok.*;


import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class MatchDto {
    
    private Long id;
    private String name;
    private LocalDateTime matchDate;

    private TeamDto homeTeam;
    private TeamDto awayTeam;
    private StadiumDto stadium;


}
