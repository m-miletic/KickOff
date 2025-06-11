package com.kick_off.kick_off.dto.player;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PlayerDto {

    private Long id;
    private String firstName;
    private String lastName;
    private Integer age;
    private Integer height;
    private String foot;
    private String position;
    private Integer goals;
    private Integer assists;
    private String photoUrl;
}
