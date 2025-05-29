package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.request.RoleChangeRequestDto;
import com.kick_off.kick_off.dto.team.TeamDto;
import com.kick_off.kick_off.dto.novo.UserDto;
import com.kick_off.kick_off.dto.novo.UserFilterParamsDto;
import com.kick_off.kick_off.dto.novo.UserListDto;
import com.kick_off.kick_off.dto.tournament.TournamentDto;
import com.kick_off.kick_off.model.Request;
import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.Status;
import com.kick_off.kick_off.model.Tournament;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.RequestRepository;
import com.kick_off.kick_off.repository.TeamRepository;
import com.kick_off.kick_off.repository.TournamentRepository;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import com.kick_off.kick_off.service.UserService;
import com.kick_off.kick_off.service.authentication.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RequestRepository requestRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper, RequestRepository requestRepository, TeamRepository teamRepository, TournamentRepository tournamentRepository) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.requestRepository = requestRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
    }

    private long calculateTotalPages(long totalUsers, int pageSize) {
        long totalPages = 0;
        long reminder = 0;
        totalPages = totalUsers / pageSize;
        reminder = totalUsers % pageSize;
        if(reminder > 0) {
            totalPages += 1;
        }
        return totalPages;
    }

    @Override
    public UserListDto getUsers(UserFilterParamsDto filter) {
        Page<User> pageUsers;

        Sort.Direction sortDirection = filter.getSortDirection().equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(filter.getPageNumber() - 1, filter.getPageSize(), Sort.by(sortDirection, filter.getSortField()));

        if(!filter.getRole().equalsIgnoreCase("ALL")) {
            Role role = Role.valueOf(filter.getRole());
            pageUsers = userRepository.findByRoleAndRoleNot(role, Role.ADMIN, pageRequest);
        } else {
            pageUsers = userRepository.findByRoleNot(Role.ADMIN, pageRequest);
        }

        long totalUsers = pageUsers.getTotalElements();
        long totalPages = calculateTotalPages(totalUsers, filter.getPageSize());

        List<UserDto> usersDto = pageUsers
                .stream()
                .map(user -> {
                    UserDto userDto = modelMapper.map(user, UserDto.class);

                    // Attach team info if user is a representative
                    teamRepository.findTeamByRepresentative_Id(user.getId())
                            .ifPresent(team -> userDto.setTeam(modelMapper.map(team, TeamDto.class)));
                    // Attach tournament info if user is an tournament organizer
                    tournamentRepository.findTournamentByOrganizer_Id(user.getId())
                            .ifPresent(tournament -> userDto.setTournament(modelMapper.map(tournament, TournamentDto.class)));

                    return userDto;
                }).toList();

        return UserListDto.builder()
                .usersList(usersDto)
                .totalPages(totalPages)
                .build();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (teamRepository.existsByRepresentative(userRepository.findById(id).orElseThrow())) {
            throw new IllegalStateException("User is a team representative.Please provide with a new team representative or deactivate the team first.");
        } else if (tournamentRepository.existsByOrganizer(userRepository.findById(id).orElseThrow())) {
            throw new IllegalStateException("User is a tournament organizer.Please provide with a new tournament host or deactivate the tournament first.");
        } else {
            requestRepository.deleteByRequester_Id(id); // s brisanjem user-a brisa odma i sve njegive requestove - da/ne ?
            userRepository.deleteById(id);
        }

    }

    @Override
    public void updateUsersRole(RoleChangeRequestDto request) {
        Long requesterId = request.getRequesterId();
        Long requestId = request.getRequestId();
        Role updatedRole = request.getNewRole();
        Status updatedStatus = request.getStatus();



        User user = userRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + requesterId + " not found."));

        user.setRole(updatedRole);
        userRepository.save(user);

        Request req = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request with id " + requestId + " not found"));

        req.setRequestFulfilled(true);
        req.setStatus(updatedStatus);
        requestRepository.save(req);
    }
}
