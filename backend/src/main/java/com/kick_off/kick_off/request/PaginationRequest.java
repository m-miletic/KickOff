package com.kick_off.kick_off.request;

import lombok.*;
import org.springframework.data.domain.Sort;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaginationRequest {
    private Integer page = 1;
    private boolean fetchAll = false;
    private Integer size = 10;
    private String sortField = "id";
    private Sort.Direction direction = Sort.Direction.DESC;
}
