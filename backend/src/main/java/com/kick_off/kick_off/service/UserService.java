package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.UserDto;
import com.kick_off.kick_off.dto.auth.UserListDto;
import com.kick_off.kick_off.dto.paginationFilters.UserPaginationFilter;
import com.kick_off.kick_off.dto.request.RoleChangeRequestDto;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.User;

public interface UserService {

    UserListDto getUsers(UserPaginationFilter filter);

    UserDto getUser(Long id);

    UserDto deleteUser(Long id);

    void updateUsersRole(RoleChangeRequestDto request);

    User findByRole(Role role);
}
