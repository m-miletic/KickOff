package com.kick_off.kick_off.dto.stadium;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StadiumDto {

    private Long id;
    private String stadiumName;
    private String location;
    private String photoUrl;
}
