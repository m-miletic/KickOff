package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.team.CreateTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.team.requestParams.TeamFilterParamsDto;
import com.kick_off.kick_off.dto.team.TeamListDto;
import com.kick_off.kick_off.model.Match;
import com.kick_off.kick_off.model.Request;
import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.MatchRepository;
import com.kick_off.kick_off.repository.RequestRepository;
import com.kick_off.kick_off.repository.TeamRepository;
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
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final ModelMapper modelMapper;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public TeamServiceImpl(TeamRepository teamRepository, ModelMapper modelMapper, RequestRepository requestRepository, UserRepository userRepository, MatchRepository matchRepository) {
        this.teamRepository = teamRepository;
        this.modelMapper = modelMapper;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
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

        return TeamListDto.builder()
                .teamsList(teams)
                .totalPages(totalPages)
                .build();

    }

    @Override
    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }



    @Override
    public TeamDto createTeam(CreateTeamDto teamDto) {
        System.out.println("CreateTeamDto: " + teamDto);
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
        team.setRepresentative(representative);

        Team savedTeam = teamRepository.save(team);
        return modelMapper.map(savedTeam, TeamDto.class);
    }



    @Override
    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Team with id: " + " not found."));

        // triba bi rucno uklonit tim iz svakog turnira prije nego ga izbrisem
        team.getTournaments().forEach(tournament -> tournament.getTeams().remove(team));
        // valjalo bi izbrisat i match-eve ako izbrisem tim ... onda i protivnickom timu izbrisat meceve u kojem se nalazia taj klub kojeg brisem
        List<Match> teamsMatches = team.getMatches();
        teamsMatches.forEach(match -> matchRepository.delete(match));
        teamRepository.deleteById(id);
    }

    @Override
    public List<TeamDto> findTeamByTournament(String tournamentName) {
        List<Team> teams = teamRepository.findTeamByTournamentName(tournamentName);
        List<TeamDto> teamsDto = teams
                .stream()
                .map(team ->
                        modelMapper.map(team, TeamDto.class)).toList();

        return teamsDto;
    }

    @Override
    public TeamDto findTeamByRepresentative(Long representativeId) {
        Team team = teamRepository.findTeamByRepresentative_Id(representativeId)
                .orElseThrow(() -> new EntityNotFoundException("Representative with id: " + representativeId + " not found."));

        TeamDto teamDto = modelMapper.map(team, TeamDto.class);
        return teamDto;
    }

}
