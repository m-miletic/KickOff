package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.team.*;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
import org.springframework.data.repository.init.RepositoriesPopulatedEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TeamListDto>> fetchAllTeams(@ModelAttribute TeamFilterParamsDto filters) {
        try {
            TeamListDto teams = teamService.getTeams(filters);
            ApiResponse<TeamListDto> response = ApiResponse.<TeamListDto>builder()
                    .message("Successfully fetched teams.")
                    .data(teams)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<TeamListDto> errorResponse = ApiResponse.<TeamListDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

    @GetMapping("/by-tournament")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getTeamsByTournament(@RequestParam String tournamentName) {
        System.out.println("Tournament name: " + tournamentName);
        try {
            List<TeamDto> teams = teamService.findTeamByTournament(tournamentName);
            ApiResponse<List<TeamDto>> response = ApiResponse.<List<TeamDto>>builder()
                    .message("Successfully retrieved teams enrolled in tournament: " + tournamentName)
                    .data(teams)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<List<TeamDto>> errorResponse = ApiResponse.<List<TeamDto>>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@RequestBody CreateTeamDto team) {
        try {
            TeamDto createdTeam = teamService.createTeam(team);
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .message("Team created successfully.")
                    .success(true)
                    .data(createdTeam)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException e) {
            System.out.println("Poruka - " + e.getMessage());
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        try {
            teamService.deleteTeam(id);
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Team with id: " + id + " successfully deleted.")
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDto>> fetchTeamById(@PathVariable("id") Long id) {
        try {
            TeamDto team = teamService.getTeamById(id);
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .message("Successfully retrieved team.")
                    .data(team)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<TeamDto> errorResponse = ApiResponse.<TeamDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

    @GetMapping("/by-representative")
    public ResponseEntity<ApiResponse<LightTeamDto>> fetchTeamByRepresentative(@ModelAttribute GetTeamByRepresentative request) {
        try {
            LightTeamDto team = teamService.findTeamByRepresentativeId(request.getRepresentativeId());
            ApiResponse<LightTeamDto> response = ApiResponse.<LightTeamDto>builder()
                    .message("Successfully retrieved representatives team.")
                    .data(team)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            ApiResponse<LightTeamDto> errorResponse = ApiResponse.<LightTeamDto>builder()
                    .message(e.getMessage())
                    .data(null)
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PatchMapping("/upload-crest")
    public ResponseEntity<ApiResponse<Void>> updateTeamCrestImage(@RequestBody UploadTeamCrestDto request) {
        System.out.println("Am I here");
        try {
            teamService.uploadTeamCrest(request.getTeamId(), request.getTeamCrest());
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("Team crest image uploaded.")
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
