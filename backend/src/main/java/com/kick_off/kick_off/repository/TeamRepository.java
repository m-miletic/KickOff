package com.kick_off.kick_off.repository;

import com.kick_off.kick_off.model.Team;
import com.kick_off.kick_off.model.authentication.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    boolean existsByRepresentative(User representative);

    boolean existsByTeamName(String teamName);

    Optional<Team> findTeamByRepresentative_Id(Long id);

    List<Team> findTeamByTournamentId(Long tournamentId);

}
