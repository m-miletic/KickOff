package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.match.*;
import com.kick_off.kick_off.request.PaginationRequest;
import com.kick_off.kick_off.response.PaginatedResponse;

public interface MatchService {

    MatchDto createMatch(CreateMatchDto matchDto);

/*    MatchListDto findPaginatedMatchesByTournament(Long tournamentId, int pageNumber);*/

    PaginatedResponse<MatchDto> findMatchesByTournament(PaginationRequest request, Long tournamentId);

    MatchDto updateMatch(Long matchId, EditMatchDto editMatchDto);

    void deleteMatch(Long id);
}
