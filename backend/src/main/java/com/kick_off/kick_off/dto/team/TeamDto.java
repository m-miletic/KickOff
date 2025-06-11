package com.kick_off.kick_off.dto.team;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {

    private Long id;
    private String teamName;
    private String coach;
    private Integer matchesPlayed;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsScored;
    private Integer goalsAgainst;
    private String teamCrest;
}
