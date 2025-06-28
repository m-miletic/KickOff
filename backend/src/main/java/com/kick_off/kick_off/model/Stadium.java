package com.kick_off.kick_off.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "stadiums")
public class Stadium {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "stadium_name")
    private String stadiumName;
    @Column(name = "location")
    private String location;
    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToMany(mappedBy = "stadiums")
    private List<Tournament> tournaments;

}
