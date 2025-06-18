package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.match.CreateMatchDto;
import com.kick_off.kick_off.dto.match.EditMatchDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.exception.ForbiddenActionException;
import com.kick_off.kick_off.model.Match;
import com.kick_off.kick_off.model.Stadium;
import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.model.Tournament;
import com.kick_off.kick_off.repository.MatchRepository;
import com.kick_off.kick_off.repository.StadiumRepository;
import com.kick_off.kick_off.repository.TeamRepository;
import com.kick_off.kick_off.repository.TournamentRepository;
import com.kick_off.kick_off.service.MatchService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final ModelMapper modelMapper;
    private final TournamentRepository tournamentRepository;
    private final StadiumRepository stadiumRepository;

    public MatchServiceImpl(MatchRepository matchRepository, TeamRepository teamRepository, ModelMapper modelMapper, TournamentRepository tournamentRepository, StadiumRepository stadiumRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.modelMapper = modelMapper;
        this.tournamentRepository = tournamentRepository;
        this.stadiumRepository = stadiumRepository;
    }


    @Override
    public MatchDto createMatch(CreateMatchDto matchDto) {
        Match match = new Match();
        Long homeTeamId = matchDto.getHomeTeam();
        Long awayTeamId = matchDto.getAwayTeam();
        Long tournamentId = matchDto.getTournamentId();
        Long stadiumId = matchDto.getStadium();

        Team homeTeam = teamRepository.findById(homeTeamId)
                .orElseThrow(() ->  new EntityNotFoundException("Team with id: " + homeTeamId + " not found."));
        Team awayTeam = teamRepository.findById(awayTeamId)
                        .orElseThrow(() -> new EntityNotFoundException("Team with id: " + awayTeamId + " not found."));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                        .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + tournamentId + " not found."));

        Stadium stadium = stadiumRepository.findById(stadiumId)
                .orElseThrow(() -> new EntityNotFoundException("Stadium with id: " + stadiumId + " doesn't exist."));


        boolean matchExists = matchRepository.existsByHomeTeamIdAndAwayTeamId(homeTeamId, awayTeamId);
        if (matchExists) {
            throw new EntityExistsException("Match already exists.");
        }

        // s obzirom da san na frontendu pretvoria u string i maka vremensku zonu ode ga moram vratit u Date objekt tj. LocalDateTime
        String matchDate = matchDto.getMatchDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime parsedDate = LocalDateTime.parse(matchDate, formatter);

        LocalDate matchDay = parsedDate.toLocalDate(); // ne triba mi vrime pa ga micem
        LocalDateTime startOfDay = matchDay.atStartOfDay();
        LocalDateTime endOfDay = matchDay.atTime(23, 59, 59);

        boolean homeTeamBusy = matchRepository.existsByTeamIdAndMatchDateBetween(homeTeamId, startOfDay, endOfDay);
        boolean awayTeamBusy = matchRepository.existsByTeamIdAndMatchDateBetween(awayTeamId, startOfDay, endOfDay);

        if(homeTeamBusy) {
            throw new EntityExistsException("Home team already has a match that day.");
        }
        if(awayTeamBusy) {
            throw new EntityExistsException("Away team already has a match that day");
        }

        LocalDateTime now = LocalDateTime.now();
        if (parsedDate.isBefore(now.plusHours(24))) {
            throw new ForbiddenActionException("Match date must at least 24 hrs before scheduled start.");
        }

        LocalDateTime matchDateTime = LocalDateTime.parse(matchDto.getMatchDate(), formatter);

        LocalDateTime startWindow = matchDateTime.minusHours(2);
        LocalDateTime endWindow = matchDateTime.plusHours(2);

        boolean stadiumBusy = matchRepository.existsByStadiumAndMatchDateInWindow(stadiumId, startWindow, endWindow);
        if(stadiumBusy) {
            throw new EntityExistsException("Stadium busy at that time.Must be a 2 hour gap between matches.");
        }




        match.setMatchDate(parsedDate);
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setName(homeTeam.getTeamName() + " VS " + awayTeam.getTeamName());
        match.setTournament(tournament);
        match.setStadium(stadium);
        Match savedMatch = matchRepository.save(match);

        TeamDto hometeamDto = modelMapper.map(homeTeam, TeamDto.class);
        TeamDto awayteamDto = modelMapper.map(awayTeam, TeamDto.class);

        MatchDto matchDto1 = new MatchDto();
        matchDto1.setId(savedMatch.getId());
        matchDto1.setMatchDate(savedMatch.getMatchDate());
        matchDto1.setHomeTeam(hometeamDto);
        matchDto1.setAwayTeam(awayteamDto);
        matchDto1.setName(savedMatch.getName());
        matchDto1.setStadium(modelMapper.map(stadium, StadiumDto.class));

        return matchDto1;
    }

    @Override
    public List<MatchDto> findMatchesByTournament(Long tournamentId) {
        List<Match> matches = matchRepository.findByTournamentId(tournamentId);

        List<MatchDto> matchDtos = matches.stream()
                .map(match -> modelMapper.map(match, MatchDto.class)).toList();

        return matchDtos;
    }

    @Override
    public MatchDto updateMatch(Long matchId, EditMatchDto editMatchDto) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match with id: " + matchId + " doesn't exist."));

        LocalDateTime newDate = editMatchDto.getMatchDate();
        LocalDateTime now = LocalDateTime.now();
        if (newDate != null && !newDate.equals(match.getMatchDate())) {
            if (newDate.isBefore(now.plusHours(24))) {
                throw new ForbiddenActionException("Match date must at least 24 hrs before scheduled start.");
            }
            match.setMatchDate(newDate);
        }

        if (editMatchDto.getHomeTeamGoals() != null) {
            match.setHomeTeamGoals(editMatchDto.getHomeTeamGoals());
        }

        if (editMatchDto.getAwayTeamGoals() != null) {
            match.setAwayTeamGoals(editMatchDto.getAwayTeamGoals());
        }

        Match updatedMatch = matchRepository.save(match);

        MatchDto matchDto = modelMapper.map(updatedMatch, MatchDto.class);
        return matchDto;
    }

    @Override
    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }
}













