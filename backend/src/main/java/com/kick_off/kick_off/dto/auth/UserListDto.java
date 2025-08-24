package com.kick_off.kick_off.dto.auth;

import com.kick_off.kick_off.dto.UserDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class UserListDto {

    private List<UserDto> usersList;
    private long totalPages;
}
