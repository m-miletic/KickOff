package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.player.GetPlayersByTeamIdDto;
import com.kick_off.kick_off.dto.player.PlayerDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerDto>>> getPlayersByTeam(@ModelAttribute GetPlayersByTeamIdDto request) {
        System.out.println("Test: " + request.toString());
        try {
            List<PlayerDto> players = playerService.getPlayersByTeam(request.getTeamId());
            ApiResponse<List<PlayerDto>> response = ApiResponse.<List<PlayerDto>>builder()
                    .message("Successfully retrieved players from team.")
                    .data(players)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<List<PlayerDto>> errorResponse = ApiResponse.<List<PlayerDto>>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }
}
