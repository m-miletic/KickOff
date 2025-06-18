package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.PlayerDto;
import com.kick_off.kick_off.model.Player;
import com.kick_off.kick_off.repository.PlayerRepository;
import com.kick_off.kick_off.service.PlayerService;
import jakarta.persistence.EntityNotFoundException;
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

    @Override
    public PlayerDto createPlayer(PlayerDto playerDto) {
        Player player = modelMapper.map(playerDto, Player.class);
        Player savedPlayer = playerRepository.save(player);

        return modelMapper.map(savedPlayer, PlayerDto.class);
    }

    @Override
    public PlayerDto updatePlayer(PlayerDto playerDto, Long id) {
        Player existingPlayer = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player with id: " + playerDto.getId() + " not found."));

        // Map the DTO fields onto the existing player entity
        modelMapper.map(playerDto, existingPlayer);

        // Save the updated player entity
        Player savedPlayer = playerRepository.save(existingPlayer);
        System.out.println("Saved Player: " + savedPlayer.toString());
        // Optionally map the saved entity back to DTO (if savedPlayer differs)
        return modelMapper.map(savedPlayer, PlayerDto.class);
    }

    @Override
    public PlayerDto deletePlayer(Long id) {
        Player playerToDelete = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player with id: " + id + " not found."));

        playerRepository.delete(playerToDelete);
        return modelMapper.map(playerToDelete, PlayerDto.class);
    }

}





















