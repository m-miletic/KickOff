package com.kick_off.kick_off.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RequestListDto {

    private List<RequestDto> requests;
    private long totalPages;
    private long totalRequests;
}
