package com.kick_off.kick_off.dto.paginationFilters;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaginationFilters {

    private String status = "PENDING";
    private String timeCreated = "Last 7 days";
    private String sortField = "timeCreated";
    private String sortDirection = "DESC";
    private int pageNumber = 1;
    private int pageSize = 5;
}
