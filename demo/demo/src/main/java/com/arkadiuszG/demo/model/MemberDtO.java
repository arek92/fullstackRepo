package com.arkadiuszG.demo.model;

import java.time.LocalDate;

public record MemberDtO() {

    public record MemberDto(
            Long id,
            String firstName,
            String lastName,
            String email,
            String login,
            String telefon,
            String adres,
            String koordynator,
            LocalDate birthDate
    ) {}
}
