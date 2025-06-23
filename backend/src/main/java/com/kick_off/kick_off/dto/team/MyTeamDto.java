package com.kick_off.kick_off.dto.team;

import com.kick_off.kick_off.dto.PlayerDto;
import com.kick_off.kick_off.dto.match.LightMatchDto;
import com.kick_off.kick_off.dto.tournament.MyTeamTournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MyTeamDto {

    private Long id;
    private String teamName;
    private Integer matchesPlayed;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsScored;
    private Integer goalsAgainst;
    private List<PlayerDto> players;
    private String photoUrl;
    private MyTeamTournamentDto tournament; // za razliku od TeamDto TournamentDto se ne referencira na TeamDto pa mi mece stvarat loop

    // nadodat u posebni dto za posbne slucjajeve
    private List<LightMatchDto> homeMatches;
    private List<LightMatchDto> awayMatches;
    private List<LightMatchDto> allMatches;
}
