package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.model.Stadium;

import java.util.List;

public interface StadiumService {

    List<StadiumDto> fetchAllStadiums();

    StadiumDto createStadium(StadiumDto stadiumDto);
}
