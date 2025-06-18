package com.kick_off.kick_off.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Table(name = "players")
public class Player {

    // dok jos testiram nek bude Integer nedamise popunjavat sva polja a int je primitiv tip i nemoze bit null
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "first_name")
    private String firstName = "";
    @Column(name = "last_name")
    private String lastName = "";
    @Column(name = "age")
    private int age ;
    @Column(name = "height")
    private Integer height;
    @Column(name = "foot")
    private String foot;
    @Column(name = "goals")
    private Integer goals;
    @Column(name = "assists")
    private Integer assists;
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
                ", goals=" + goals +
                ", assists=" + assists +
                ", photoUrl='" + photoUrl + '\'' +
                '}';
    }
}
