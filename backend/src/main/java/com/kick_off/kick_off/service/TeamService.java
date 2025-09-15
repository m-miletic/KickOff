package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.team.*;
import com.kick_off.kick_off.request.PaginationRequest;
import com.kick_off.kick_off.response.PaginatedResponse;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    PaginatedResponse<TeamDto> getTeams(PaginationRequest request);

    TeamDto getTeamById(Long id);

    MyTeamDto getMyTeam(Long id);

    TeamDto createTeam(CreateTeamDto teamDto);

    void deleteTeam(Long id);

    List<TeamDto> findTeamByTournamentId(Long tournamentId);

    TeamDto findTeamByRepresentativeId(Long representativeId);

    String uploadTeamCrest(Long teamId, String teamCrestUrl);
}
