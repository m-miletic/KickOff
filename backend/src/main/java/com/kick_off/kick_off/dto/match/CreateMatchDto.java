package com.kick_off.kick_off.dto.match;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class CreateMatchDto {
    private Long homeTeam;
    private Long awayTeam;
    private String matchDate; // vidit kako fullcalendar definira datum - pretp. kao string
    private Long tournamentId;
    private Long stadium;
}
