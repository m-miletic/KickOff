package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.team.*;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
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
    public ResponseEntity<ApiResponse<TeamListDto>> getAllTeams(
            @RequestParam(required = false, defaultValue = "teamName") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") String sortDirection,
            @RequestParam(required = false, defaultValue = "1") int pageNumber
    ) {
            TeamFilterParamsDto filters = new TeamFilterParamsDto();
            filters.setSortField(sortField);
            filters.setSortDirection(sortDirection);
            filters.setPageNumber(pageNumber);

            TeamListDto teams = teamService.getTeams(filters);
            ApiResponse<TeamListDto> response = ApiResponse.<TeamListDto>builder()
                    .message("Successfully fetched teams.")
                    .data(teams)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getTeamsByTournament(
            @PathVariable Long tournamentId,
            @RequestParam(required = false) Integer page
    ) {
        List<TeamDto> teams = teamService.findTeamByTournamentId(tournamentId);
        ApiResponse<List<TeamDto>> response = ApiResponse.<List<TeamDto>>builder()
                .message("Successfully retrieved teams enrolled in tournament")
                .data(teams)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@RequestBody CreateTeamDto team) {
        TeamDto createdTeam = teamService.createTeam(team);
        ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                .message("Team created successfully.")
                .success(true)
                .data(createdTeam)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

    // triba mi jedan endpoint s drugacijim returnom od TeamDto jer on u sebi ima dosta toga
    @GetMapping("/myTeam/{representativeId}")
    public ResponseEntity<ApiResponse<MyTeamDto>> fetchMyTeam(@PathVariable Long representativeId) {
        System.out.println("KOJI id stigne = " + representativeId);
        MyTeamDto team = teamService.getMyTeam(representativeId);
        ApiResponse<MyTeamDto> response = ApiResponse.<MyTeamDto>builder()
                .message("Successfully retrieved team owner data.")
                .data(team)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDto>> fetchTeamById(@PathVariable Long id) {
        TeamDto team = teamService.getTeamById(id);
        ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                .message("Successfully retrieved team.")
                .data(team)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamByTeamRepresentative(@PathVariable Long userId) {
        System.out.println("In getTeamByTeamRepresentative - userId:" + userId);

        TeamDto team = teamService.findTeamByRepresentativeId(userId);
        ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                .message("Successfully retrieved representatives team.")
                .data(team)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateTeamImage(@PathVariable Long id, @RequestBody TeamImageUpdateDto request) {
        String updatedPhotoUrl = teamService.uploadTeamCrest(id, request.getPhotoUrl());
        ApiResponse<String> response = ApiResponse.<String>builder()
                .message("Team crest image uploaded.")
                .data(updatedPhotoUrl)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


}
