package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.match.CreateMatchDto;
import com.kick_off.kick_off.dto.match.EditMatchDto;
import com.kick_off.kick_off.dto.match.MatchDto;
import com.kick_off.kick_off.dto.match.MatchListDto;
import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.dto.team.MyTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.exception.ForbiddenActionException;
import com.kick_off.kick_off.model.*;
import com.kick_off.kick_off.repository.MatchRepository;
import com.kick_off.kick_off.repository.StadiumRepository;
import com.kick_off.kick_off.repository.TeamRepository;
import com.kick_off.kick_off.repository.TournamentRepository;
import com.kick_off.kick_off.service.MatchService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private long calculateTotalPages(long totalElements, int pageSize) {
        long totalPages = 0;
        long reminder = 0;
        totalPages = totalElements / pageSize;
        reminder = totalElements % pageSize;
        if(reminder > 0) {
            totalPages += 1;
        }
        return totalPages;
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
    public MatchListDto findMatchesByTournamentPagination(Long tournamentId, int pageNumber) {

        int pageSize = 3;

        Page<Match> pageMatches;
        PageRequest pageRequest = PageRequest.of(pageNumber - 1, pageSize);
        pageMatches = matchRepository.findByTournamentId(tournamentId, pageRequest);

        long totalMatches = pageMatches.getTotalElements();
        long totalPages = calculateTotalPages(totalMatches, pageSize);

        List<MatchDto> matchDtos = pageMatches
                .stream()
                .map(match -> modelMapper.map(match, MatchDto.class)).toList();


        Page<Match> beforeToday = matchRepository.findByTournamentIdAndMatchDateBeforeOrderByMatchDateDesc(tournamentId, LocalDate.now().atStartOfDay(), pageRequest);


        MatchListDto matchListDto = MatchListDto.builder()
                .matchesList(matchDtos)
                .totalPages(totalPages)
                .pagesBeforeToday(beforeToday.getTotalPages())
                .build();

        return matchListDto;
    }

    @Override
    public List<MatchDto> findMatchesByTournament(Long tournamentId) {

        List<Match> allMatches = matchRepository.findAll();

        List<MatchDto> matchDtos = allMatches.stream().map(match -> modelMapper.map(match, MatchDto.class)).toList();
        return matchDtos;
    }


    @Override
    public MatchDto updateMatch(Long matchId, EditMatchDto editMatchDto) {

        TeamDto homeTeam = editMatchDto.getHomeTeam();
        TeamDto awayTeam = editMatchDto.getAwayTeam();

        Team updateHomeTeam = teamRepository.findById(homeTeam.getId())
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + homeTeam.getId() + " not found."));

        Team updateAwayTeam = teamRepository.findById(awayTeam.getId())
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + awayTeam.getId() + " not found."));


        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match with id: " + matchId + " doesn't exist."));

        System.out.println("Match: " + match.getName());


        int homeTeamGoals = editMatchDto.getHomeTeamGoals();
        int awayTeamGoals = editMatchDto.getAwayTeamGoals();

        if (homeTeamGoals > awayTeamGoals) {
            /*provjerit null jer san u dummy data inserta null-ove*/
            if (match.getMatchOutcome() != null) {
                if (match.getMatchOutcome().equals(MatchOutcome.DRAW)) {
                    updateHomeTeam.setDraws(updateHomeTeam.getDraws() - 1);
                    updateAwayTeam.setDraws(updateAwayTeam.getDraws() - 1);

                    updateHomeTeam.setWins(updateHomeTeam.getWins() + 1);
                    updateAwayTeam.setLosses(updateAwayTeam.getLosses() + 1);

                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() - 1);
                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() - 1);

                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 3);


                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.WIN);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);

                } else if (match.getMatchOutcome().equals(MatchOutcome.WIN)) {

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);


                } else if (match.getMatchOutcome().equals(MatchOutcome.LOSE)) {
                    updateHomeTeam.setLosses(updateHomeTeam.getLosses() - 1);
                    updateAwayTeam.setWins(updateAwayTeam.getWins() - 1);

                    updateHomeTeam.setWins(updateHomeTeam.getWins() + 1);
                    updateAwayTeam.setLosses(updateAwayTeam.getLosses() + 1);

                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() - 3);
                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 3);

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.WIN);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);

                }
            } else {

                updateHomeTeam.setWins(updateHomeTeam.getWins() + 1);
                updateAwayTeam.setLosses(updateAwayTeam.getLosses() + 1);

                updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 3);

                int oldHomeGoals = match.getHomeTeamGoals();
                int oldAwayGoals = match.getAwayTeamGoals();

                updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                match.setMatchOutcome(MatchOutcome.WIN);
                match.setHomeTeamGoals(homeTeamGoals);
                match.setAwayTeamGoals(awayTeamGoals);
            }


        } else if (homeTeamGoals == awayTeamGoals)  {
            if (match.getMatchOutcome() != null) {
                if (match.getMatchOutcome().equals(MatchOutcome.DRAW)) {

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);

                } else if (match.getMatchOutcome().equals(MatchOutcome.WIN)) {

                    updateHomeTeam.setWins(updateHomeTeam.getWins() - 1);
                    updateAwayTeam.setLosses(updateAwayTeam.getLosses() - 1);

                    updateHomeTeam.setDraws(updateHomeTeam.getDraws() + 1);
                    updateAwayTeam.setDraws(updateAwayTeam.getDraws() + 1);

                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() - 3);
                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 1);
                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 1);

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.DRAW);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);


                } else if (match.getMatchOutcome().equals(MatchOutcome.LOSE)) {

                    updateHomeTeam.setLosses(updateHomeTeam.getLosses() - 1);
                    updateAwayTeam.setWins(updateAwayTeam.getWins() - 1);

                    updateHomeTeam.setDraws(updateHomeTeam.getDraws() + 1);
                    updateAwayTeam.setDraws(updateAwayTeam.getDraws() + 1);

                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() - 3);
                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 1);
                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 1);

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.DRAW);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);

                }
            } else {

                updateHomeTeam.setDraws(updateHomeTeam.getDraws() + 1);
                updateAwayTeam.setDraws(updateAwayTeam.getDraws() + 1);

                updateHomeTeam.setPoints(updateHomeTeam.getPoints() + 1);
                updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 1);

                int oldHomeGoals = match.getHomeTeamGoals();
                int oldAwayGoals = match.getAwayTeamGoals();

                updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                match.setMatchOutcome(MatchOutcome.DRAW);
                match.setHomeTeamGoals(homeTeamGoals);
                match.setAwayTeamGoals(awayTeamGoals);
            }

        } else if (homeTeamGoals < awayTeamGoals) {
            if (match.getMatchOutcome() != null) {
                if (match.getMatchOutcome().equals(MatchOutcome.DRAW)) {

                    updateHomeTeam.setDraws(updateHomeTeam.getDraws() - 1);
                    updateAwayTeam.setDraws(updateAwayTeam.getDraws() - 1);

                    updateHomeTeam.setLosses(updateHomeTeam.getLosses() + 1);
                    updateAwayTeam.setWins(updateAwayTeam.getWins() + 1);

                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() - 1);
                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() - 1);

                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 3);

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.LOSE);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);


                } else if (match.getMatchOutcome().equals(MatchOutcome.WIN)) {

                    updateHomeTeam.setWins(updateHomeTeam.getWins() - 1);
                    updateAwayTeam.setLosses(updateAwayTeam.getLosses() - 1);

                    updateHomeTeam.setLosses(updateHomeTeam.getLosses() + 1);
                    updateAwayTeam.setWins(updateAwayTeam.getWins() + 1);

                    updateHomeTeam.setPoints(updateHomeTeam.getPoints() - 3);
                    updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 3);

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setMatchOutcome(MatchOutcome.LOSE);
                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);


                } else if (match.getMatchOutcome().equals(MatchOutcome.LOSE)) {

                    int oldHomeGoals = match.getHomeTeamGoals();
                    int oldAwayGoals = match.getAwayTeamGoals();

                    updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                    updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                    updateHomeTeam.setGoalsAgainst(updateHomeTeam.getGoalsAgainst() - oldAwayGoals + awayTeamGoals);
                    updateAwayTeam.setGoalsAgainst(updateAwayTeam.getGoalsAgainst() - oldHomeGoals + homeTeamGoals);

                    match.setHomeTeamGoals(homeTeamGoals);
                    match.setAwayTeamGoals(awayTeamGoals);

                }
            } else {

                int oldHomeGoals = match.getHomeTeamGoals();
                int oldAwayGoals = match.getAwayTeamGoals();

                updateHomeTeam.setGoalsScored(updateHomeTeam.getGoalsScored() - oldHomeGoals + homeTeamGoals);
                updateAwayTeam.setGoalsScored(updateAwayTeam.getGoalsScored() - oldAwayGoals + awayTeamGoals);

                updateHomeTeam.setLosses(updateHomeTeam.getLosses() + 1);
                updateAwayTeam.setWins(updateAwayTeam.getWins() + 1);

                updateAwayTeam.setPoints(updateAwayTeam.getPoints() + 3);

                match.setMatchOutcome(MatchOutcome.LOSE);
                match.setHomeTeamGoals(homeTeamGoals);
                match.setAwayTeamGoals(awayTeamGoals);
            }

        }

        updateHomeTeam.setGoalsScored(homeTeam.getGoalsScored() + homeTeamGoals);
        updateHomeTeam.setGoalsAgainst(homeTeam.getGoalsAgainst() + awayTeamGoals);

        updateAwayTeam.setGoalsScored(awayTeam.getGoalsScored() + awayTeamGoals);
        updateAwayTeam.setGoalsAgainst(awayTeam.getGoalsAgainst() + homeTeamGoals);


        teamRepository.save(updateHomeTeam);
        teamRepository.save(updateAwayTeam);



        LocalDateTime newDate = editMatchDto.getMatchDate();
        LocalDateTime now = LocalDateTime.now();
        if (newDate != null && !newDate.equals(match.getMatchDate())) {
            if (newDate.isBefore(now.plusHours(24))) {
                throw new ForbiddenActionException("Match date must at least 24 hrs before scheduled start.");
            }
            match.setMatchDate(newDate);
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













