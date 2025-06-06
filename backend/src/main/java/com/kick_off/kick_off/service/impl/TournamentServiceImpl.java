package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.request.RequestDto;
import com.kick_off.kick_off.dto.team.EnrollTeamDto;
import com.kick_off.kick_off.dto.tournament.CreateTournamentDto;
import com.kick_off.kick_off.dto.tournament.sig.GetTournamentsDto;
import com.kick_off.kick_off.dto.tournament.sig.TournamentDto;
import com.kick_off.kick_off.dto.tournament.sig.TournamentListDto;
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
    public TournamentListDto getTournaments(GetTournamentsDto request) {

        Page<Tournament> pageTournaments;
        PageRequest pageRequest = PageRequest.of(request.getPageNumber() - 1, request.getPageSize());
        pageTournaments = tournamentRepository.findAll(pageRequest);

        long totalTournaments = pageTournaments.getTotalElements();
        long totalPages = calculateTotalPages(totalTournaments, request.getPageSize());

        List<TournamentDto> tournamentDtos = pageTournaments
                .stream()
                .map(tournament -> {
                  TournamentDto tournamentDto = modelMapper.map(tournament, TournamentDto.class);
                  return tournamentDto;
                }).toList();

        TournamentListDto tournamentListDto = TournamentListDto.builder()
                .tournamentsList(tournamentDtos)
                .totalPages(totalPages)
                .build();

        return tournamentListDto;
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
    public RequestDto enrollTeam(EnrollTeamDto teamDto) {
        Long teamRepresentativeId = teamDto.getTeamRepresentativeId();
        Long tournamentOrganizerId = teamDto.getTournamentOrganizerId();
        Long requestId = teamDto.getRequestId();

        Tournament tournament = tournamentRepository.findTournamentByOrganizer_Id(tournamentOrganizerId)
                .orElseThrow(() -> new EntityNotFoundException("Tournament with id: " + tournamentOrganizerId + " not found."));

        Team team = teamRepository.findTeamByRepresentative_Id(teamRepresentativeId)
                .orElseThrow(() -> new EntityNotFoundException("Team with representative id: " + teamRepresentativeId + " not found."));

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id: " + requestId + " not found."));


        List<Tournament> allTournaments = tournamentRepository.findAll();

        var counter = allTournaments.stream()
                .filter(tournam -> tournam.getTeams().stream()
                        .anyMatch(t -> t.getId().equals(team.getId()))
                )
                .count();

        System.out.println("Counter: " + counter);


        boolean alreadyEnrolled = tournament.getTeams().stream()
                .anyMatch(t -> t.getId().equals(team.getId()));


        if(alreadyEnrolled) {
            throw new IllegalStateException("Team is already enrolled in the tournament.");
        } else if (counter >= 2) {
            throw new IllegalStateException("Team already enrolled in max number of tournaments.");
        } else {
            tournament.getTeams().add(team);
            team.getTournaments().add(tournament);
            tournamentRepository.save(tournament);
            request.setStatus(Status.APPROVED);
            request.setRequestFulfilled(true);
            requestRepository.save(request);
        }

        return modelMapper.map(request, RequestDto.class);

    }
}
