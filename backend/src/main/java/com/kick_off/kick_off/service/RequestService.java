package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.dto.tournament.TournamentCreationRequestDto;

import java.util.List;

public interface RequestService {
/*    RequestDto createRequest(CreateRequestDto request);*/

    void createRoleChangeRequest(CreateRoleChangeRequestDto request);

    void createEnrollTeamRequest(CreateEnrollTeamRequestDto request);

    void createTeamRegistrationRequest(TeamRegistrationRequestDto request);

    void createTournamentCreationRequest(TournamentCreationRequestDto request);

    RequestListDto getRequestsByApproverId(GetRequestsDto getRequestsDto);

    RequestListDto getRequestsByRequesterId(GetRequestsDto getRequestsDto);

    List<RequestDto> getRequestsByApproverId(Long approverId);


    RequestDto getRequestById(Long id);

    RequestDto updateRequest(UpdateRequestStatusDto request);


}
