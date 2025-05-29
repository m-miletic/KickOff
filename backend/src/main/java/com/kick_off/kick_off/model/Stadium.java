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
    @Column(name = "capacity")
    private String capacity;
    @Column(name = "city")
    private String city;
    @Column(name = "street")
    private String street;

    // @JoinTable & @JoinColumn are not required but are used so that I can name table and fields as I want
    @ManyToMany(mappedBy = "stadiums")
    private List<Tournament> tournaments;
}
