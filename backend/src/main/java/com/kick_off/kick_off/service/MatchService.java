package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.match.CreateMatchDto;
import com.kick_off.kick_off.dto.match.EditMatchDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.match.MatchListDto;

import java.util.List;

public interface MatchService {

    MatchDto createMatch(CreateMatchDto matchDto);

    MatchListDto findMatchesByTournamentPagination(Long tournamentId, int pageNumber);
    List<MatchDto> findMatchesByTournament(Long tournamentId);

    MatchDto updateMatch(Long matchId, EditMatchDto editMatchDto);

    void deleteMatch(Long id);
}
