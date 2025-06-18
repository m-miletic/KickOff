package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.PlayerDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    // vidit di se koristi
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<PlayerDto>>> getPlayersByTeam(@PathVariable Long teamId) {

        List<PlayerDto> players = playerService.getPlayersByTeam(teamId);
        ApiResponse<List<PlayerDto>> response = ApiResponse.<List<PlayerDto>>builder()
                .message("Successfully retrieved players from team.")
                .data(players)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // MyTeam.jsx
    @PostMapping
    public ResponseEntity<ApiResponse<PlayerDto>> createPlayer(@Validated @RequestBody PlayerDto request) {
        PlayerDto player = playerService.createPlayer(request);
        ApiResponse<PlayerDto> response = ApiResponse.<PlayerDto>builder()
                .message("Successfully created player.")
                .data(player)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    //Myteam.jsx
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDto>> updatePlayer(@PathVariable Long id, @Validated @RequestBody PlayerDto requestBody) {

        PlayerDto player = playerService.updatePlayer(requestBody, id);
        ApiResponse<PlayerDto> response = ApiResponse.<PlayerDto>builder()
                .message("Successfully updated player.")
                .data(player)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // MyTeam
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDto>> deletePlayer(@PathVariable Long id) {

        PlayerDto deletedPlayer = playerService.deletePlayer(id);
        ApiResponse<PlayerDto> response = ApiResponse.<PlayerDto>builder()
                .message("Successfully deleted player.")
                .data(deletedPlayer)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
