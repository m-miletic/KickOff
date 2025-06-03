package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.novo.CreateEnrollTeamRequestDto;
import com.kick_off.kick_off.dto.novo.CreateRoleChangeRequestDto;
import com.kick_off.kick_off.dto.request.*;
import com.kick_off.kick_off.model.Request;

import java.util.List;

public interface RequestService {
/*    RequestDto createRequest(CreateRequestDto request);*/

    void createRoleChangeRequest(CreateRoleChangeRequestDto request);

    void createEnrollTeamRequest(CreateEnrollTeamRequestDto request);

    Request createTeamRegistrationRequest(TeamRegistrationRequestDto request);

    RequestListDto getRequestsByApproverId(RequestFilterParamsDto requestFilterParamsDto);
    RequestListDto getRequestsByRequesterId(RequestFilterParamsDto requestFilterParamsDto);

    List<RequestDto> getRequestsByApproverId(Long approverId);


    RequestDto getRequestById(Long id);

    Request updateRequest(UpdateRequestDto request, Long id);


}
