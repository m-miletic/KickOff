package com.kick_off.kick_off.dto;

import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String role;
    private Integer reqCount;
    private TeamDto team;
    private TournamentDto tournament;

    public UserDto(Long id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
}
