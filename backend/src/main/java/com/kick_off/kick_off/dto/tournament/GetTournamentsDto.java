package com.kick_off.kick_off.dto.tournament;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GetTournamentsDto {

    private Long teamRepresentativeId;
    private int pageNumber = 1;
    private int pageSize = 3;
}
