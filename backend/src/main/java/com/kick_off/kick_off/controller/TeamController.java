package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.team.CreateTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.dto.team.TeamListDto;
import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<TeamListDto> fetchAllTeams(@ModelAttribute TeamFilterParamsDto filters) {
        System.out.println("filters: " + filters);
        return new ResponseEntity<>(teamService.getTeams(filters), HttpStatus.OK);
    }

    @GetMapping("/by-tournament")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getTeamsByTournament(@RequestParam String tournamentName) {
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

            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> fetchTeamById(@PathVariable("id") Long id) {
        Optional<Team> team = teamService.getTeamById(id);
        return team
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@RequestBody CreateTeamDto team) {
        System.out.println("CreateTeamDto: "+  team.toString());
        try {
            TeamDto createdTeam = teamService.createTeam(team);
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .message("Team created successfully.")
                    .success(true)
                    .data(createdTeam)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException e) {
            ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                    .message("Failed to create a team: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<TeamListDto> deleteTeam(@ModelAttribute TeamFilterParamsDto filter, @PathVariable Long id) {
        System.out.println("deleteTeam: " + filter.toString());
        teamService.deleteTeam(id);
        return new ResponseEntity<>(teamService.getTeams(filter), HttpStatus.OK);
    }



}
