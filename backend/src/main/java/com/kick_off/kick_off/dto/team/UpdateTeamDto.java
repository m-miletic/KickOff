package com.kick_off.kick_off.dto.team;

import com.kick_off.kick_off.model.Match;
import com.kick_off.kick_off.model.Player;
import com.kick_off.kick_off.model.Tournament;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

public class UpdateTeamDto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "team_name")
    private String teamName;
    @Column(name = "coach")
    private String coach;
    @Column(name = "matches_played")
    private Integer matchesPlayed;
    @Column(name = "wins")
    private Integer wins;
    @Column(name = "draws")
    private Integer draws;
    @Column(name = "losses")
    private Integer losses;
    @Column(name = "goals_scored")
    private Integer goalsScored;
    @Column(name = "goals_against")
    private Integer goalsAgainst;
    @Column(name = "established")
    private Date established;
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
}
