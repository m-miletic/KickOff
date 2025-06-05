package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.team.CreateTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.dto.team.TeamListDto;
import com.kick_off.kick_off.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    TeamListDto getTeams(TeamFilterParamsDto filters);
    Optional<Team> getTeamById(Long id);

    TeamDto createTeam(CreateTeamDto teamDto);

    void deleteTeam(Long id);

    List<TeamDto> findTeamByTournament(String tournamentName);

    TeamDto findTeamByRepresentative(Long representativeId);
}
