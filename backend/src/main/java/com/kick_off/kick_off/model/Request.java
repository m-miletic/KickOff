package com.kick_off.kick_off.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kick_off.kick_off.model.authentication.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "requests")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "message")
    private String message;
    @Column(name = "time_created")
    private LocalDateTime timeCreated;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private RequestType requestType;
    @Column(name = "desired_role")
    @Enumerated(EnumType.STRING)
    private Role desiredRole;

    @Column(name = "request_fulfilled")
    private Boolean requestFulfilled = false;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "approver_id")
    private User approver;

}
