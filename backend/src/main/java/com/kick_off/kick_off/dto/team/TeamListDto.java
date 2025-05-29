package com.kick_off.kick_off.dto.team;


import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamListDto {

    private List<TeamDto> teamsList;
    private long totalPages;

}
