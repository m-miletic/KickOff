package com.kick_off.kick_off.model;

import com.kick_off.kick_off.model.authentication.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "tournaments")
@ToString
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tournament_name", unique = true)
    private String tournamentName;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "details")
    private String details;
    @Column(name = "max_teams")
    private int maxTeams;

    @OneToMany(mappedBy = "tournament"/*, cascade = CascadeType.ALL, orphanRemoval = true*/)
    private List<Team> teams;


    // @JoinTable & @JoinColumn are not required but are used, so I can name table and fields as I want
    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "stadium_tournament",
            joinColumns = @JoinColumn(name = "tournament_id"),
            inverseJoinColumns = @JoinColumn(name = "stadium_id")
    )
    private List<Stadium> stadiums;

    @OneToMany(mappedBy = "tournament")
    private List<Match> matchesList;

    @OneToOne
    private User organizer;


}
