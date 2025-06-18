package com.kick_off.kick_off.service;

import com.kick_off.kick_off.dto.PlayerDto;

import java.util.List;

public interface PlayerService {

    List<PlayerDto> getPlayersByTeam(Long teamId);

    PlayerDto createPlayer(PlayerDto playerDto);

    PlayerDto updatePlayer(PlayerDto playerDto, Long id);

    PlayerDto deletePlayer(Long id);
}
