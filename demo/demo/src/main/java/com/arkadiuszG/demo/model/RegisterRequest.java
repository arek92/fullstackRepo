package com.arkadiuszG.demo.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email nie może być pusty")
    @Email(message = "Nieprawidłowy format email")
    private String email;

    @NotBlank(message = "Hasło nie może być puste")
    private String password;

    @NotBlank(message = "Imię nie może być puste")
    private String firstName;

    @NotBlank(message = "Nazwisko nie może być puste")
    private String lastName;

    @NotBlank(message = "Login nie może być pusty")
    private String login;

    @NotBlank(message = "Pole adres nie może być puste")
    private String adres;

    @NotBlank(message = "Pole telefon nie może być puste")
    private String telefon;

    @NotBlank(message = "Pole koordynator nie może być puste")
    private String koordynator;

    @NotBlank(message = "Pole dataUrodzenia  nie może być puste")
    private LocalDate dataUrodzenia;

    private String role;





}
