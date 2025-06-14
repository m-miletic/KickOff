package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.match.CreateMatchDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.MatchService;
import lombok.Getter;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDto>> createMatch(@RequestBody CreateMatchDto match) {
        System.out.println("CreateMatchDto : " + match.toString());
        try {
            MatchDto matchDto = matchService.createMatch(match);
            ApiResponse<MatchDto> response = ApiResponse.<MatchDto>builder()
                    .message("Successfully created a match.")
                    .data(matchDto)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<MatchDto> errorResponse = ApiResponse.<MatchDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getMatchesByTournamentId(@PathVariable Long tournamentId) {
        try {
            List<MatchDto> matches = matchService.findMatchesByTournament(tournamentId);
            ApiResponse<List<MatchDto>> response = ApiResponse.<List<MatchDto>>builder()
                    .message("Matches fetched successfully.")
                    .data(matches)
                    .success(true)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<MatchDto>> errorResponse = ApiResponse.<List<MatchDto>>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }



}
