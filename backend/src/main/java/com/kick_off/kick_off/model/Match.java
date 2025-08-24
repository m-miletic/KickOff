package com.kick_off.kick_off.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    @Column(name = "home_team_goals", columnDefinition = "integer default 0")
    private Integer homeTeamGoals ;

    @Column(name = "away_team_goals", columnDefinition = "integer default 0")
    private Integer awayTeamGoals;

    @Enumerated(EnumType.STRING)
    private MatchOutcome matchOutcome;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "stadium_id")
    private Stadium stadium;
}
