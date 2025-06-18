package com.kick_off.kick_off.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PlayerDto {

    private Long id;
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 15, message = "First name length must be between 2 and 15 characters")
    private String firstName;
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 25, message = "Last name length must be between 2 and 25 characters")
    private String lastName;
    @NotNull(message = "Age is required")
    @Min(value = 16, message = "min age is 16")
    @Max(value = 50, message = "max age is 50")
    private Integer age;
    @Min(value = 140, message = "min height is 140")
    @Max(value = 250, message = "max height is 250")
    private Integer height;
    @Min(value = 0, message = "Negative numbers not allowed")
    private Integer goals;
    @Min(value = 0, message = "Negative numbers not allowed")
    private Integer assists;
    @Pattern(regexp = "^(http|https)://.*$", message = "Must be a valid URL")
    private String photoUrl;
    @NotNull(message = "Must provide with team id")
    private String teamId;
}
