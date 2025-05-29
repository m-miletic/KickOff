package com.kick_off.kick_off.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ApiResponse<T> {
    private String message;
    private T data;
    private boolean success;
}
