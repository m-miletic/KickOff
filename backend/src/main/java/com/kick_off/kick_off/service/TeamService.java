package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.team.*;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    TeamListDto getTeams(TeamFilterParamsDto filters);

    TeamDto getTeamById(Long id);

    MyTeamDto getMyTeam(Long id);

    TeamDto createTeam(CreateTeamDto teamDto);

    void deleteTeam(Long id);

    List<TeamDto> findTeamByTournamentId(Long tournamentId);

    TeamDto findTeamByRepresentativeId(Long representativeId);

    String uploadTeamCrest(Long teamId, String teamCrestUrl);
}
