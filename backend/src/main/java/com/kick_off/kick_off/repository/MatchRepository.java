package com.kick_off.kick_off.repository;

import com.kick_off.kick_off.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    boolean existsByHomeTeamIdAndAwayTeamId(Long homeTeamId, Long awayTeamId);

    @Query("""
        SELECT m FROM Match m
        WHERE (
          m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId
        )
        AND FUNCTION('DATE', m.matchDate) = FUNCTION('DATE', :matchDate)
    """)
    Optional<Match> findMatchByTeamAndDate(@Param("teamId") Long teamId, @Param("matchDate") LocalDateTime matchDate);

    @Query("""
        SELECT COUNT(m) > 0 FROM Match m
        WHERE (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId)
        AND m.matchDate BETWEEN :start AND :end
    """)
    boolean existsByTeamIdAndMatchDateBetween(@Param("teamId") Long teamId,
                                              @Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);


    List<Match> findByTournamentId(Long tournamentId);

    @Query("""
        SELECT COUNT(m) > 0 FROM Match m
        WHERE m.stadium.id = :stadiumId
        AND m.matchDate BETWEEN :startWindow AND :endWindow
    """)
    boolean existsByStadiumAndMatchDateInWindow(@Param("stadiumId") Long stadiumId,
                                                @Param("startWindow") LocalDateTime startWindow,
                                                @Param("endWindow") LocalDateTime endWindow);








}
