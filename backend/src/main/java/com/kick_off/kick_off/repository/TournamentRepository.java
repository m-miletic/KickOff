package com.kick_off.kick_off.repository;

import com.kick_off.kick_off.model.Tournament;
import com.kick_off.kick_off.model.authentication.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    boolean existsByOrganizer(User organizer);
    Optional<Tournament> findTournamentByOrganizer_Id(Long id);

    List<Tournament> findByTeams_Id(Long teamId);

    Page<Tournament> findAll(Pageable pageable);
}
