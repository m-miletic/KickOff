package com.kick_off.kick_off.exception;

public class ForbiddenActionException extends RuntimeException{
    public ForbiddenActionException(String message) {
        super(message);
    }
}
