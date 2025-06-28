package com.kick_off.kick_off.dto.paginationFilters;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserPaginationFilter {

    private String role;
    private String sortDirection;
    private String sortField;
    private int pageNumber;
    private int pageSize = 4;
}
