package com.kick_off.kick_off.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Getter
@Setter
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "age")
    private int age;
    @Column(name = "height")
    private int height;
    @Column(name = "foot")
    private String foot;
    @Column(name = "player_position")
    private String position;
    @Column(name = "jersey_number")
    private int jerseyNumber;
    @Column(name = "goals")
    private int goals;
    @Column(name = "assists")
    private int assists;
    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", age=" + age +
                ", height=" + height +
                ", foot='" + foot + '\'' +
                ", position='" + position + '\'' +
                ", jerseyNumber=" + jerseyNumber +
                ", goals=" + goals +
                ", assists=" + assists +
                ", photoUrl='" + photoUrl + '\'' +
                ", team=" + team +
                '}';
    }
}
