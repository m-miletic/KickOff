package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.request.RequestListDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.GetTournamentByOrganizer;
import com.kick_off.kick_off.dto.tournament.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;

import java.util.List;

public interface TournamentService {
    TournamentListDto getTournaments(GetTournamentsDto request);

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    RequestListDto enrollTeam(EnrollTeamDto teamDto);

    TournamentDto getTournamentByOrganizer(GetTournamentByOrganizer request);

    TournamentDto updateTournament(Long id, TournamentDto updatedTournament);
}
