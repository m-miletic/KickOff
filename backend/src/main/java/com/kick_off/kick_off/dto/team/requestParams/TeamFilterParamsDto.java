package com.kick_off.kick_off.dto.team.requestParams;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamFilterParamsDto {
    private String sortField = "teamName";
    private String sortDirection = "ASC";
    private int pageNumber = 1;
    private int pageSize = 3;
}
