package com.kick_off.kick_off.repository.authentication;

import com.kick_off.kick_off.model.authentication.RefreshToken;
import com.kick_off.kick_off.model.authentication.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying(clearAutomatically = true)
    @Transactional
    void deleteByUser(User user);

    void deleteByToken(String token);
}
