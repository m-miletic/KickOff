package com.kick_off.kick_off.dto.request;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamRegistrationRequestDto {

    private Long teamRepresentativeId;
    private String teamName;
    private String coach;
}
