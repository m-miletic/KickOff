package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.match.CreateMatchDto;
import com.kick_off.kick_off.dto.match.EditMatchDto;
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
        System.out.println("In create match controller");
        MatchDto matchDto = matchService.createMatch(match);
        ApiResponse<MatchDto> response = ApiResponse.<MatchDto>builder()
                .message("Successfully created a match.")
                .data(matchDto)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getMatchesByTournamentId(@PathVariable Long tournamentId) {
        List<MatchDto> matches = matchService.findMatchesByTournament(tournamentId);
        ApiResponse<List<MatchDto>> response = ApiResponse.<List<MatchDto>>builder()
                .message("Matches fetched successfully.")
                .data(matches)
                .success(true)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchDto>> editMatch(@PathVariable(name = "id") Long matchId, @RequestBody EditMatchDto updateMatchData) {
        try {
            MatchDto matchDto = matchService.updateMatch(matchId, updateMatchData);
            ApiResponse<MatchDto> response = ApiResponse.<MatchDto>builder()
                    .message("Match successfully updated")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(@PathVariable Long id) {
        try {
            matchService.deleteMatch(id);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Match successfully deleted")
                    .data(null)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        }
    }



}
