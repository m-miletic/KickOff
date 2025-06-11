package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.player.PlayerDto;
import com.kick_off.kick_off.model.Player;

import java.util.List;

public interface PlayerService {

    List<PlayerDto> getPlayersByTeam(Long teamId);
}
