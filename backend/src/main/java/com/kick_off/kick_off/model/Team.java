package com.kick_off.kick_off.model;

import com.kick_off.kick_off.model.authentication.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

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
/*    @Column(name = "matches_played")
    private Integer matchesPlayed = 0;*/
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
    @Column(name = "points")
    private int points;

    // brisanjem tema brisu se svi njegovi igraci pomocu cascade = {CascadeType.REMOVE} - vidit jos ocu jel to zelin
    @OneToMany(mappedBy = "team", cascade = {CascadeType.REMOVE}, orphanRemoval = true) // orphan mi omogucava da iz team-a izbrisem player-a
    private List<Player> players;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;


    // ako ne bi koristia orphanRemoval i probam preko Team-a izbrisat match samo ce ga detach-at nece ga izbrisat iz db
    @OneToMany(mappedBy = "homeTeam", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Match> homeMatches;

    @OneToMany(mappedBy = "awayTeam", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Match> awayMatches;

    @OneToOne
    private User representative;

}

