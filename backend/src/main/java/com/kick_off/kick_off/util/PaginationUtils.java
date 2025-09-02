package com.kick_off.kick_off.util;

import com.kick_off.kick_off.request.PaginationRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class PaginationUtils {

    public static Pageable getPageable(PaginationRequest request) {
        System.out.println("request from utils: " + request.toString());
        return PageRequest.of(request.getPage()-1, request.getSize(), request.getDirection(), request.getSortField());
    }
}
