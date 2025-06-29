package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.paginationFilters.PaginationFilters;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.model.RequestType;

import java.util.List;

public interface RequestService {
/*    RequestDto createRequest(CreateRequestDto request);*/

    RequestDto createEnrollTeamRequest(CreateEnrollTeamRequestDto request);

    void createTeamRegistrationRequest(Long requesterId);

    void createTournamentCreationRequest(Long requesterId);

    RequestListDto getRequestsByApproverId(Long id, PaginationFilters filters);

    RequestListDto getRequestsByRequesterId(Long id, PaginationFilters filters);

    List<RequestDto> getRequestsByApproverId(Long approverId);


    RequestDto getRequestById(Long id);

    RequestDto updateRequest(UpdateRequestStatusDto request);


}
