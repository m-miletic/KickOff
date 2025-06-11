package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.player.PlayerDto;
import com.kick_off.kick_off.model.Player;
import com.kick_off.kick_off.repository.PlayerRepository;
import com.kick_off.kick_off.service.PlayerService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final ModelMapper modelMapper;

    public PlayerServiceImpl(PlayerRepository playerRepository, ModelMapper modelMapper) {
        this.playerRepository = playerRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<PlayerDto> getPlayersByTeam(Long teamId) {
        List<Player> players = playerRepository.findAllByTeam_Id(teamId);

        List<PlayerDto> playerDtos = players.stream()
                .map(player -> modelMapper.map(player, PlayerDto.class))
                .toList();

        return playerDtos;
    }
}
