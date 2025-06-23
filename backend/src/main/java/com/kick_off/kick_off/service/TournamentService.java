package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestListDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;

import java.util.List;


public interface TournamentService {
    TournamentListDto getTournaments(int pageNumber);

    TournamentListDto getUpcomingTournaments(int pageNumber);

    TournamentListDto getActiveTournaments(int pageNumber);

    List<TournamentDto> getActiveAndUpcomingTournaments();

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    TeamDto enrollTeam(EnrollTeamDto teamDto);

    TeamDto removeFromTournament(Long teamId);

    TournamentDto getTournamentByOrganizer(Long id);

    TournamentDto updateTournament(Long id, TournamentDto updatedTournament);
}
