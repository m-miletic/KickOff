package com.kick_off.kick_off.dto.novo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserFilterParamsDto {

    private String role = "USER";
    private String sortDirection = "DESC";
    private String sortField = "email";
    private int pageNumber = 1;
    private int pageSize = 3;
}
