package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.GetTournamentByOrganizer;
import com.kick_off.kick_off.dto.tournament.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
import com.kick_off.kick_off.service.TournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;
    private final TeamService teamService;

    public TournamentController(TournamentService tournamentService, TeamService teamService) {
        this.tournamentService = tournamentService;
        this.teamService = teamService;
    }

    // isti endpoint se poziva ako gost s /home dohvaca turnire i ako team_representative dohvaca turnire ... ok?
    @GetMapping
    public ResponseEntity<ApiResponse<TournamentListDto>> fetchAllTournaments(@ModelAttribute GetTournamentsDto request) {
        try {
            TournamentListDto tournaments = tournamentService.getTournaments(request);
            ApiResponse<TournamentListDto> response = ApiResponse.<TournamentListDto>builder()
                    .message("Successfully retrieved tournaments.")
                    .data(tournaments)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (IllegalStateException e) {
            ApiResponse<TournamentListDto> errorResponse = ApiResponse.<TournamentListDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TournamentDto>> createTournament(@RequestBody CreateTournamentDto tournamentDto) {
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

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/by-organizer")
    public ResponseEntity<ApiResponse<TournamentDto>> getTournamentByOrganizer(@ModelAttribute GetTournamentByOrganizer request) {
        try {
            TournamentDto tournament = tournamentService.getTournamentByOrganizer(request);
            ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                    .message("Successfully retrieved organizers tournament.")
                    .data(tournament)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<TournamentDto> errorResponse = ApiResponse.<TournamentDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentDto>> editTournament(@PathVariable(name = "id") Long id, @RequestBody TournamentDto updatedTournament) {
        try {
            TournamentDto tournament = tournamentService.updateTournament(id, updatedTournament);
            ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                    .message("Successfully updated tournament.")
                    .data(tournament)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            System.out.println("poruka - " + e.getMessage());
            ApiResponse<TournamentDto> errorResponse = ApiResponse.<TournamentDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }
}
