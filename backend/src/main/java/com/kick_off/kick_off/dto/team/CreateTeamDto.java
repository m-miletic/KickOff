package com.kick_off.kick_off.dto.team;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CreateTeamDto {

    private String teamName;
    private String coach;
    private Long requestId;
    private Long representativeId;
    private String photoUrl;

}
