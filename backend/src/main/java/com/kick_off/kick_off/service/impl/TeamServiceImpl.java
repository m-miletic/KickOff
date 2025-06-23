package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.PlayerDto;
import com.kick_off.kick_off.dto.match.LightMatchDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.team.*;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.dto.tournament.MyTeamTournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.model.*;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.*;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import com.kick_off.kick_off.service.TeamService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final ModelMapper modelMapper;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;

    public TeamServiceImpl(TeamRepository teamRepository, ModelMapper modelMapper, RequestRepository requestRepository, UserRepository userRepository, MatchRepository matchRepository, PlayerRepository playerRepository, TournamentRepository tournamentRepository) {
        this.teamRepository = teamRepository;
        this.modelMapper = modelMapper;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.tournamentRepository = tournamentRepository;
    }

    private long calculateTotalPages(long totalTeams, int pageSize) {
        long totalPages = 0;
        long reminder = 0;
        totalPages = totalTeams / pageSize;
        reminder = totalTeams % pageSize;
        if(reminder > 0) {
            totalPages += 1;
        }
        return totalPages;
    }

    @Override
    public TeamListDto getTeams(TeamFilterParamsDto filters) {

        Sort.Direction direction = filters.getSortDirection().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(filters.getPageNumber() - 1, filters.getPageSize(), Sort.by(direction, filters.getSortField()));

        Page<Team> pageTeams = teamRepository.findAll(pageRequest);
        long totalTeams = pageTeams.getTotalElements();
        long totalPages = calculateTotalPages(totalTeams, filters.getPageSize());

        List<TeamDto> teams = new ArrayList<>();
        teams = pageTeams
                .stream()
                .map(t ->
                        modelMapper.map(t, TeamDto.class)).toList();

        // nadodat samo za slucaj kada dohvacam meceve timova ...
/*        for (TeamDto teamDto : teams) {
            List<MatchDto> teamsHomeMatches = teamDto.getHomeMatches();
            List<MatchDto> teamsAwayMatches = teamDto.getAwayMatches();
            List<MatchDto> allMatches = new ArrayList<>();
            allMatches.addAll(teamsHomeMatches);
            allMatches.addAll(teamsAwayMatches);
            teamDto.setAllMatches(allMatches);

        }*/

        return TeamListDto.builder()
                .teamsList(teams)
                .totalPages(totalPages)
                .build();

    }

    @Override
    public TeamDto getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + id + " not found."));

        TeamDto teamDto = modelMapper.map(team, TeamDto.class);
        return teamDto;
    }

    @Override
    public MyTeamDto getMyTeam(Long id) {
        MyTeamDto myTeamDto = new MyTeamDto();

        Team team = teamRepository.findTeamByRepresentative_Id(id)
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + id + " not found."));


        Tournament tournament = team.getTournament();
        MyTeamTournamentDto myTeamTournamentDto = new MyTeamTournamentDto();
        if (tournament != null) {
            myTeamTournamentDto = modelMapper.map(tournament, MyTeamTournamentDto.class);
        }

        List<Player> players = team.getPlayers();
        List<PlayerDto> playerDtos = new ArrayList<PlayerDto>();
        if (players != null) {
            playerDtos = players.stream().map(player ->
                        modelMapper.map(player, PlayerDto.class)
                    ).toList();
        }

        List<LightMatchDto> allMatchesDto = new ArrayList<LightMatchDto>();

        List<Match> homeMatches = team.getHomeMatches();
        List<LightMatchDto> homeMatchesDto = new ArrayList<LightMatchDto>();
        if (homeMatches != null) {
            homeMatchesDto = homeMatches.stream().map(match ->
                        modelMapper.map(match, LightMatchDto.class)
                    ).toList();

            allMatchesDto.addAll(homeMatchesDto);
        }

        List<Match> awayMatches = team.getAwayMatches();
        List<LightMatchDto> awayMatchesDto = new ArrayList<LightMatchDto>();
        if (awayMatches != null) {
            awayMatchesDto = awayMatches.stream().map(match ->
                        modelMapper.map(match, LightMatchDto.class)
                    ).toList();

            allMatchesDto.addAll(awayMatchesDto);
        }

        myTeamDto = modelMapper.map(team, MyTeamDto.class);
        myTeamDto.setTournament(myTeamTournamentDto);
        myTeamDto.setPlayers(playerDtos);
        myTeamDto.setHomeMatches(homeMatchesDto);
        myTeamDto.setAwayMatches(awayMatchesDto);
        myTeamDto.setAllMatches(allMatchesDto);

        return myTeamDto;
    }


    @Override
    public TeamDto createTeam(CreateTeamDto teamDto) {
        Long requestId = teamDto.getRequestId();
        Request updatedRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id: " + requestId + " not found."));

        if(Boolean.TRUE.equals(updatedRequest.getRequestFulfilled())) {
            throw new IllegalStateException("User already took action.");
        }

        updatedRequest.setRequestFulfilled(true);
        requestRepository.save(updatedRequest);

        Long representativeId = teamDto.getRepresentativeId();
        User representative = userRepository.findById(representativeId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + representativeId + " not found."));


        Team team = new Team();
        team.setTeamName(teamDto.getTeamName());
        team.setCoach(teamDto.getCoach());
        team.setPhotoUrl(teamDto.getPhotoUrl());
        team.setRepresentative(representative);

        Team savedTeam = teamRepository.save(team);
        return modelMapper.map(savedTeam, TeamDto.class);
    }


    @Override
    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Team with id: " + " not found."));

        // dohvatit sve igrace koji su u tom team-u - NE brisat ih nego im samo setirat team na null
        List<Player> players = playerRepository.findAllByTeam_Id(id);
        for (Player player : players) {
            player.setTeam(null);
            playerRepository.save(player);
        }
        // team tournament je many na many pa je potrebno rucno uklonit team iz liste timova u turnir entitetu
        List<Tournament> tournaments = tournamentRepository.findByTeams_Id(team.getId());
        for (Tournament tournament : tournaments) {
            tournament.getTeams().remove(team);
            tournamentRepository.save(tournament);
        }

        teamRepository.delete(team);
    }

    @Override
    public List<TeamDto> findTeamByTournamentId(Long tournamentId) {
        List<Team> teams = teamRepository.findTeamByTournamentId(tournamentId);

        List<TeamDto> teamsDto = teams
                .stream()
                .map(team -> {
                    List<LightMatchDto> homeMatches = team.getHomeMatches().stream()
                            .map(match -> {
                                LightMatchDto matchDto = modelMapper.map(match, LightMatchDto.class);
                                matchDto.setIsHomeMatch(true);
                                return matchDto;
                            })
                            .toList();

                    List<LightMatchDto> awayMatches = team.getAwayMatches().stream()
                            .map(match -> {
                                LightMatchDto matchDto = modelMapper.map(match, LightMatchDto.class);
                                matchDto.setIsHomeMatch(false); // Set isHomeMatch flag for away matches
                                return matchDto;
                            })
                            .toList();

                    List<LightMatchDto> allMatches = new ArrayList<>();
                    allMatches.addAll(homeMatches);
                    allMatches.addAll(awayMatches);


                    TeamDto teamDto = modelMapper.map(team, TeamDto.class);

                    teamDto.setHomeMatches(homeMatches);
                    teamDto.setAwayMatches(awayMatches);
                    teamDto.setAllMatches(allMatches);


                    return teamDto;
                })
                .toList();

        return teamsDto;
    }

    @Override
    public TeamDto findTeamByRepresentativeId(Long representativeId) {
        System.out.println("In findTeamByRepresentativeId service method");
        Team team = teamRepository.findTeamByRepresentative_Id(representativeId)
                .orElseThrow(() -> new EntityNotFoundException("Doesn't represent a team yet"));

        TeamDto teamDto = modelMapper.map(team, TeamDto.class);
        return teamDto;
    }

    @Override
    public String uploadTeamCrest(Long teamId, String photoUrl) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + teamId + " not found."));

        team.setPhotoUrl(photoUrl);
        teamRepository.save(team);
        return team.getPhotoUrl();
    }

}
