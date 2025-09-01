package com.kick_off.kick_off.response;

import lombok.*;

import java.util.Collection;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PaginatedResponse<T> {

    private Integer totalPages;
    private long totalElements;
    private Integer size;
    private Integer page;
    private boolean empty;
    private Collection<T> content;
}
