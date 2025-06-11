package com.kick_off.kick_off.repository.authentication;

import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.authentication.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    Optional<User> findByRole(Role role);

    Page<User> findByRoleAndRoleNot(Role role, Role excluded, Pageable pageable);
    Page<User> findByRoleNot(Role excluded, Pageable pageable);




}
