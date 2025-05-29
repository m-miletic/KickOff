package com.kick_off.kick_off.model;

import com.kick_off.kick_off.model.authentication.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

// using Integer because of testing phase I'm not population all of the fields with data.sql so I get an error
@Entity
@Getter
@Setter
@ToString
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "team_name")
    private String teamName;
    @Column(name = "coach")
    private String coach;
    @Column(name = "matches_played")
    private Integer matchesPlayed = 0;
    @Column(name = "wins")
    private Integer wins = 0;
    @Column(name = "draws")
    private Integer draws = 0;
    @Column(name = "losses")
    private Integer losses = 0;
    @Column(name = "goals_scored")
    private Integer goalsScored = 0;
    @Column(name = "goals_against")
    private Integer goalsAgainst = 0;
    @Column(name = "photo_url")
    private String photoUrl;

    @OneToMany(mappedBy = "team")
    private List<Player> players;

    @ManyToMany(mappedBy = "teams")
    private List<Tournament> tournaments;

    @ManyToMany
    @JoinTable(
            name = "team_match",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "match_id")
    )
    private List<Match> matches;

    @OneToOne
    private User representative;

}

