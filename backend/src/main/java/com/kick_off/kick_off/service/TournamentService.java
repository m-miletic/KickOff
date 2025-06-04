package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.sig.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.sig.TournamentDto;

import java.util.List;

public interface TournamentService {
    List<TournamentDto> getTournaments(GetTournamentsDto filters);

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    RequestDto enrollTeam(EnrollTeamDto teamDto);
}
