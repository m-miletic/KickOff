package com.kick_off.kick_off.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldValidationException extends RuntimeException {
    private final String field;
    private final String message;

    public FieldValidationException(String field, String message) {
        super(message);
        this.field = field;
        this.message = message;
    }

}
