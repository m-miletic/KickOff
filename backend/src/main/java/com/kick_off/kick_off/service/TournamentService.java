package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.GetTournamentsForTeamRepresentativeDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.requestParams.TournamentFilterParamsDto;
import com.kick_off.kick_off.model.Tournament;

import java.util.List;

public interface TournamentService {
    List<TournamentDto> getTournaments(GetTournamentsForTeamRepresentativeDto filters);

    TournamentDto createTournament(CreateTournamentDto tournamentDto);

    RequestDto enrollTeam(EnrollTeamDto teamDto);
}
