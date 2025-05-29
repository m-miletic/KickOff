package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.novo.UserFilterParamsDto;
import com.kick_off.kick_off.dto.novo.UserListDto;
import com.kick_off.kick_off.dto.request.RoleChangeRequestDto;

public interface UserService {

    UserListDto getUsers(UserFilterParamsDto filter);
    void deleteUser(Long id);

    void updateUsersRole(RoleChangeRequestDto request);
}
