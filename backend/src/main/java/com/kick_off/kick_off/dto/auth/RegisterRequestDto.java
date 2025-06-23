package com.kick_off.kick_off.dto.auth;

import com.kick_off.kick_off.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RegisterRequestDto {

    @NotNull
    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 15, message = "Username must be between 5 and 15 characters long")
    private String username;
    @NotNull
    @NotBlank(message = "Password is required")
    @Size(min = 5, max = 15, message = "Password must be between 5 and 15 characters long")
    private String password;
    @NotNull
    @NotBlank(message = "Repeat password")
    private String repeatPassword;
    @NotBlank(message = "Please select a signup purpose")
    private String role;
}
