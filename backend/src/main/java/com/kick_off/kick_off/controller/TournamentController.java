package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.request.RequestListDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.TeamService;
import com.kick_off.kick_off.service.TournamentService;
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
    public ResponseEntity<ApiResponse<TournamentListDto>> fetchAllTournaments(@RequestParam(defaultValue = "1") int pageNumber) {

        System.out.println("Page number: " + pageNumber);

        TournamentListDto tournaments = tournamentService.getTournaments(pageNumber);
        ApiResponse<TournamentListDto> response = ApiResponse.<TournamentListDto>builder()
                .message("Successfully retrieved tournaments.")
                .data(tournaments)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<TournamentListDto>> fetchAllUpcomingTournaments(@RequestParam(defaultValue = "1") int pageNumber) {

        TournamentListDto tournaments = tournamentService.getUpcomingTournaments(pageNumber);
        ApiResponse<TournamentListDto> response = ApiResponse.<TournamentListDto>builder()
                .message("Successfully retrieved tournaments.")
                .data(tournaments)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<TournamentListDto>> fetchAllActiveTournaments(@RequestParam(defaultValue = "1") int pageNumber) {

        TournamentListDto tournaments = tournamentService.getActiveTournaments(pageNumber);
        ApiResponse<TournamentListDto> response = ApiResponse.<TournamentListDto>builder()
                .message("Successfully retrieved tournaments.")
                .data(tournaments)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<TournamentDto>>> fetchActiveAndUpcomingTournaments() {
        List<TournamentDto> tournaments = tournamentService.getActiveAndUpcomingTournaments();
        ApiResponse<List<TournamentDto>> response = ApiResponse.<List<TournamentDto>>builder()
                .message("Successfully retrieved all active and upcoming tournaments.")
                .data(tournaments)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TournamentDto>> createTournament(@RequestBody CreateTournamentDto tournamentDto) {
        TournamentDto createdTournamentDto = tournamentService.createTournament(tournamentDto);
        ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                .message("Successfully created a tournament")
                .success(true)
                .data(createdTournamentDto)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/enroll-team") // "/teams/enroll"
    public ResponseEntity<ApiResponse<TeamDto>> enrollTeamToTournament(@RequestBody EnrollTeamDto request) {

        TeamDto enrolledTeam = tournamentService.enrollTeam(request);
        ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                .message("Team successfully enrolled to tournament")
                .success(true)
                .data(enrolledTeam)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/teams/{teamId}/remove")
    public ResponseEntity<ApiResponse<TeamDto>> kickTeamFromTournament(@PathVariable Long teamId) {
        System.out.println("In removed");
        TeamDto team = tournamentService.removeFromTournament(teamId);
        ApiResponse<TeamDto> response = ApiResponse.<TeamDto>builder()
                .message("Team removed from tournament")
                .data(team)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<TournamentDto>> getTournamentByOrganizer(@PathVariable Long userId) {

        System.out.println("Test - orgId: " + userId);

        TournamentDto tournament = tournamentService.getTournamentByOrganizer(userId);
        ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                .message("Successfully retrieved organizers tournament.")
                .data(tournament)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentDto>> editTournament(@PathVariable(name = "id") Long id, @RequestBody TournamentDto updatedTournament) {

        TournamentDto tournament = tournamentService.updateTournament(id, updatedTournament);
        ApiResponse<TournamentDto> response = ApiResponse.<TournamentDto>builder()
                .message("Successfully updated tournament.")
                .data(tournament)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
