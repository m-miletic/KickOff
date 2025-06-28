package com.kick_off.kick_off.configuration;

import com.kick_off.kick_off.model.Role;
import com.kick_off.kick_off.model.Stadium;
import com.kick_off.kick_off.model.authentication.User;
import com.kick_off.kick_off.repository.StadiumRepository;
import com.kick_off.kick_off.repository.authentication.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StadiumRepository stadiumRepository;


    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, StadiumRepository stadiumRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.stadiumRepository = stadiumRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            Stadium stadium1 = new Stadium();
            Stadium stadium2 = new Stadium();

            stadium1.setStadiumName("Poljud");
            stadium1.setLocation("8 Mediteranskih Igara 2, Split");
            stadiumRepository.save(stadium1);

            stadium2 = new Stadium();
            stadium2.setStadiumName("Park Mladeži");
            stadium2.setLocation("Ul. Hrvatske Mornarice 10, Split");
            stadiumRepository.save(stadium2);
        }
    }
}

