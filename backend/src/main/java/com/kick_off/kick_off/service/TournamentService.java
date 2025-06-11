package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.GetTournamentByOrganizer;
import com.kick_off.kick_off.dto.tournament.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;

public interface TournamentService {
    TournamentListDto getTournaments(GetTournamentsDto request);

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    RequestDto enrollTeam(EnrollTeamDto teamDto);

    TournamentDto getTournamentByOrganizer(GetTournamentByOrganizer request);

    TournamentDto updateTournament(Long id, TournamentDto updatedTournament);
}
