package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.sig.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.sig.TournamentDto;
import com.kick_off.kick_off.dto.tournament.sig.TournamentListDto;

import java.util.List;

public interface TournamentService {
    TournamentListDto getTournaments(GetTournamentsDto request);

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    RequestDto enrollTeam(EnrollTeamDto teamDto);
}
