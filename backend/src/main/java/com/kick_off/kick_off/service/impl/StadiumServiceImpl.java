package com.kick_off.kick_off.service.impl;

import com.kick_off.kick_off.dto.stadium.StadiumDto;
import com.kick_off.kick_off.model.Stadium;
import com.kick_off.kick_off.repository.StadiumRepository;
import com.kick_off.kick_off.service.StadiumService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StadiumServiceImpl implements StadiumService {

    private final StadiumRepository stadiumRepository;
    private final ModelMapper modelMapper;

    public StadiumServiceImpl(StadiumRepository stadiumRepository, ModelMapper modelMapper) {
        this.stadiumRepository = stadiumRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<StadiumDto> fetchAllStadiums() {
        List<Stadium> stadiums = stadiumRepository.findAll();

        List<StadiumDto> stadiumDtos = stadiums.stream()
                .map(stadium -> modelMapper.map(stadium, StadiumDto.class)).toList();

        return stadiumDtos;
    }

    @Override
    public StadiumDto createStadium(StadiumDto stadiumDto) {

        Stadium stadium = modelMapper.map(stadiumDto, Stadium.class);
        Stadium savedStadium = stadiumRepository.save(stadium);
        return modelMapper.map(savedStadium, StadiumDto.class);
    }
}
