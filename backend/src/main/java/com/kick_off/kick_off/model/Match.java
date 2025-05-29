package com.kick_off.kick_off.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

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
    private LocalDate matchDate;

    @ManyToMany(mappedBy = "matches")
    private List<Team> matchTeams;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

}
