package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.auth.UserDto;
import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.request.RequestListDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.dto.tournament.TournamentListDto;
import com.kick_off.kick_off.exception.ForbiddenActionException;
import com.kick_off.kick_off.model.Request;
import com.kick_off.kick_off.model.Status;
import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.model.Tournament;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.RequestRepository;
import com.kick_off.kick_off.repository.TeamRepository;
import com.kick_off.kick_off.repository.TournamentRepository;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import com.kick_off.kick_off.service.TournamentService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private final ModelMapper modelMapper;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public TournamentServiceImpl(TournamentRepository tournamentRepository, ModelMapper modelMapper, RequestRepository requestRepository, UserRepository userRepository, TeamRepository teamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.modelMapper = modelMapper;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
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
    public TournamentListDto getTournaments(int pageNumber) {
        
        int pageSize = 5;

        Page<Tournament> pageTournaments;
        PageRequest pageRequest = PageRequest.of(pageNumber- 1, pageSize);
        pageTournaments = tournamentRepository.findAll(pageRequest);

        long totalTournaments = pageTournaments.getTotalElements();
        long totalPages = calculateTotalPages(totalTournaments, pageSize);

        List<TournamentDto> tournamentDtos = pageTournaments
                .stream()
                .map(tournament -> {
                    TournamentDto tournamentDto = modelMapper.map(tournament, TournamentDto.class);

                    // Ensure nested User is mapped manually if ModelMapper doesn't handle it by default
                    if (tournament.getOrganizer() != null) {
                        UserDto userDto = modelMapper.map(tournament.getOrganizer(), UserDto.class);
                        tournamentDto.setOrganizer(userDto);
                    }

                    return tournamentDto;
                }).toList();


        for (TournamentDto dto : tournamentDtos) {
            System.out.println(dto);
        }


        TournamentListDto tournamentListDto = TournamentListDto.builder()
                .tournamentsList(tournamentDtos)
                .totalPages(totalPages)
                .build();

        return tournamentListDto;
    }

    @Override
    public TournamentListDto getUpcomingTournaments(int pageNumber) {

        int pageSize = 6;

        Page<Tournament> pageTournaments;
        PageRequest pageRequest = PageRequest.of(pageNumber- 1, pageSize);
        pageTournaments = tournamentRepository.findByStartDateAfter(LocalDate.now().plusDays(1), pageRequest);

        long totalTournaments = pageTournaments.getTotalElements();
        long totalPages = calculateTotalPages(totalTournaments, pageSize);

        List<TournamentDto> tournamentDtos = pageTournaments
                .stream()
                .map(tournament -> {
                    TournamentDto tournamentDto = modelMapper.map(tournament, TournamentDto.class);

                    // Ensure nested User is mapped manually if ModelMapper doesn't handle it by default
                    if (tournament.getOrganizer() != null) {
                        UserDto userDto = modelMapper.map(tournament.getOrganizer(), UserDto.class);
                        tournamentDto.setOrganizer(userDto);
                    }

                    return tournamentDto;
                }).toList();


        for (TournamentDto dto : tournamentDtos) {
            System.out.println(dto);
        }


        TournamentListDto tournamentListDto = TournamentListDto.builder()
                .tournamentsList(tournamentDtos)
                .totalPages(totalPages)
                .build();

        return tournamentListDto;
    }

    @Override
    public TournamentListDto getActiveTournaments(int pageNumber) {

        int pageSize = 5;

        Page<Tournament> pageTournaments;
        PageRequest pageRequest = PageRequest.of(pageNumber- 1, pageSize);
        pageTournaments = tournamentRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate.now(), LocalDate.now(), pageRequest);

        long totalTournaments = pageTournaments.getTotalElements();
        long totalPages = calculateTotalPages(totalTournaments, pageSize);

        List<TournamentDto> tournamentDtos = pageTournaments
                .stream()
                .map(tournament -> {
                    TournamentDto tournamentDto = modelMapper.map(tournament, TournamentDto.class);

                    // Ensure nested User is mapped manually if ModelMapper doesn't handle it by default
                    if (tournament.getOrganizer() != null) {
                        UserDto userDto = modelMapper.map(tournament.getOrganizer(), UserDto.class);
                        tournamentDto.setOrganizer(userDto);
                    }

                    return tournamentDto;
                }).toList();


        for (TournamentDto dto : tournamentDtos) {
            System.out.println(dto);
        }


        TournamentListDto tournamentListDto = TournamentListDto.builder()
                .tournamentsList(tournamentDtos)
                .totalPages(totalPages)
                .build();

        return tournamentListDto;
    }

    @Override
    public List<TournamentDto> getActiveAndUpcomingTournaments() {

        List<Tournament> activeTournaments = tournamentRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate.now(), LocalDate.now());
        List<Tournament> upcomingTournaments = tournamentRepository.findByStartDateAfter(LocalDate.now());

        List<Tournament> activeAndUpcomingTournaments = new ArrayList<>();
        activeAndUpcomingTournaments.addAll(activeTournaments);
        activeAndUpcomingTournaments.addAll(upcomingTournaments);

        List<TournamentDto> tournamentDtos = activeAndUpcomingTournaments.stream()
                .map(tournament -> modelMapper.map(tournament, TournamentDto.class)).toList();

        return tournamentDtos;
    }


    @Override
    public TournamentDto createTournament(CreateTournamentDto tournamentDto) {
        Long requestId = tournamentDto.getRequestId();
        Long organizerId = tournamentDto.getOrganizerId();
        
        Request updateRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id: " + requestId + " not found."));

        if(Boolean.TRUE.equals(updateRequest.getRequestFulfilled())) {
            throw new IllegalStateException("User already took action.");
        }

        updateRequest.setRequestFulfilled(true);
        requestRepository.save(updateRequest);

        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + organizerId + " not found."));

        Tournament tournament = new Tournament();
        tournament.setTournamentName(tournamentDto.getTournamentName());
        tournament.setStartDate(tournamentDto.getStartDate());
        tournament.setEndDate(tournamentDto.getEndDate());
        tournament.setDetails(tournamentDto.getDetails());
        tournament.setOrganizer(organizer);
        Tournament savedTournament = tournamentRepository.save(tournament);

        return modelMapper.map(savedTournament, TournamentDto.class);
    }

    @Override
    public TeamDto enrollTeam(EnrollTeamDto teamDto) {
        Long teamRepresentativeId = teamDto.getTeamRepresentativeId();
        Long tournamentOrganizerId = teamDto.getTournamentOrganizerId();
        Long requestId = teamDto.getRequestId();
        Status status = Status.valueOf(teamDto.getStatus().toString());

        Tournament tournament = tournamentRepository.findTournamentByOrganizer_Id(tournamentOrganizerId)
                .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + tournamentOrganizerId + " not found."));

        Team team = teamRepository.findTeamByRepresentative_Id(teamRepresentativeId)
                .orElseThrow(() -> new EntityNotFoundException("Team with representative id: " + teamRepresentativeId + " not found."));

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id: " + requestId + " not found."));

        if (status.equals(Status.DECLINED)) {
            request.setStatus(Status.DECLINED);
            request.setRequestFulfilled(true);
            requestRepository.save(request);


        } else if (status.equals(Status.APPROVED)) {
            request.setStatus(Status.APPROVED);
            request.setRequestFulfilled(true);
            requestRepository.save(request);

            team.setTournament(tournament);
            teamRepository.save(team);

        }

        return modelMapper.map(team, TeamDto.class);

    }

    @Override
    public TeamDto removeFromTournament(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team with id: " + teamId + " not found."));

        team.setTournament(null);
        Team removedTeam = teamRepository.save(team);

        return modelMapper.map(removedTeam, TeamDto.class);
    }


    @Override
    public TournamentDto getTournamentByOrganizer(Long id) {

        Tournament tournament = tournamentRepository.findTournamentByOrganizer_Id(id)
                .orElseThrow(() -> new EntityNotFoundException("Doesn't host a tournament yet."));

        TournamentDto tournamentDto = modelMapper.map(tournament, TournamentDto.class);
        return tournamentDto;
    }

    @Override
    public TournamentDto updateTournament(Long id, TournamentDto updatedTournament) {

        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + id + " not found."));

        LocalDate now = LocalDate.now();
        LocalDate editStartDate = updatedTournament.getStartDate();
        LocalDate editEndDate = updatedTournament.getEndDate();

        if(editEndDate.isBefore(editStartDate)) {
            throw new ForbiddenActionException("End date can't be before start date");
        }

        if(editStartDate.isBefore(now) || editEndDate.isBefore(now)) {
            throw new ForbiddenActionException("Can't set dates in past");
        }

        if(editEndDate.isAfter(editStartDate.plusMonths(1))) {
            throw new ForbiddenActionException("Tournament can't last longer than a month");
        }

        tournament.setTournamentName(updatedTournament.getTournamentName());
        tournament.setDetails(updatedTournament.getDetails());
        tournament.setStartDate(updatedTournament.getStartDate());
        tournament.setEndDate(updatedTournament.getEndDate());

        Tournament saveUpdatedTournament = tournamentRepository.save(tournament);

        TournamentDto tournamentDto = modelMapper.map(saveUpdatedTournament, TournamentDto.class);
        return tournamentDto;
    }
}
