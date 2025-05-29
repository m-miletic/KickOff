package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.request.RequestListDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.GetTournamentsForTeamRepresentativeDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.requestParams.TournamentFilterParamsDto;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
import com.kick_off.kick_off.service.TournamentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;
    private final TeamService teamService;

    public TournamentController(TournamentService tournamentService, TeamService teamService) {
        this.tournamentService = tournamentService;
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TournamentDto>>> fetchAllTournaments(@ModelAttribute GetTournamentsForTeamRepresentativeDto filterParams) {
        System.out.println("filterParams: " + filterParams);
        try {
            List<TournamentDto> tournaments = tournamentService.getTournaments(filterParams);
            return ResponseEntity.ok(ApiResponse.<List<TournamentDto>>builder()
                    .message("Successfully retrieved tournaments")
                    .success(true)
                    .data(tournaments)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<List<TournamentDto>>builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build());
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TournamentDto>> createTournament(@RequestBody CreateTournamentDto tournamentDto) {
        System.out.println("Created Tournament: " + tournamentDto.toString());
        try {
            TournamentDto createdTournamentDto = tournamentService.createTournament(tournamentDto);
            ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                    .message("Successfully created a tournament")
                    .success(true)
                    .data(createdTournamentDto)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            ApiResponse<TournamentDto> errorResponse = ApiResponse.<TournamentDto>builder()
                    .message("Failed to create a tournament: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @PostMapping("/enroll-team")
    public ResponseEntity<ApiResponse<RequestDto>> updateTournament(@RequestBody EnrollTeamDto teamDto) {
        try {
            RequestDto updatedRequest = tournamentService.enrollTeam(teamDto);
            ApiResponse<RequestDto> response = ApiResponse.<RequestDto>builder()
                    .message("Team successfully enrolled to tournament")
                    .success(true)
                    .data(updatedRequest)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<RequestDto> errorResponse = ApiResponse.<RequestDto>builder()
                    .message("Failed to enroll. " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build();

            System.out.println("IllegalStateException e: " + e.getMessage());

            System.out.println("Error response: " + errorResponse.toString());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
