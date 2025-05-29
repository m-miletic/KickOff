package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.model.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

// ima li smisla radit controller klasu za enum tip

@RestController
@RequestMapping("/api/enums/roles")
public class RoleController {

    @GetMapping
    public ResponseEntity<List<Role>> fetchAllRoles() {
        List<Role> filteredRoles = Arrays.stream(Role.values()).filter(role -> !role.toString().equals("ADMIN") && !role.toString().equals("USER")).toList();
        return new ResponseEntity<>(filteredRoles, HttpStatus.OK);
    }
}
