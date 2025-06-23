package com.kick_off.kick_off.controller;

import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.model.Stadium;
import com.kick_off.kick_off.response.ApiResponse;
import com.kick_off.kick_off.service.StadiumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stadiums")
public class StadiumController {

    private final StadiumService stadiumService;

    public StadiumController(StadiumService stadiumService) {
        this.stadiumService = stadiumService;
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<StadiumDto>>> fetchAllStadiums() {
        List<StadiumDto> stadiums = stadiumService.fetchAllStadiums();
        ApiResponse<List<StadiumDto>> response = ApiResponse.<List<StadiumDto>>builder()
                .message("Successfully retrieved all stadiums.")
                .data(stadiums)
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
