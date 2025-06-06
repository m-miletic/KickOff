package com.kick_off.kick_off.repository;

import com.kick_off.kick_off.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findAllByTeam_Id(Long teamId);
}
