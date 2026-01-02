package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.MemberDtO;
import com.arkadiuszG.demo.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class MeController {

    private final MemberRepository memberRepository;

    public record MeResponse(
            Long id,
            String email,
            String login,
            String firstName,
            String lastName,
            String role,
            LocalDate birthDate,
            long expiresAt,
            String telefon,
            String adres,
            String koordynator,
            String avatarUrl
    ) {}

    @GetMapping("/api/me")
    public ResponseEntity<MeResponse> me(Authentication authentication, HttpSession session) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        Member m = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Zalogowany użytkownik nie istnieje w bazie: " + email));

        long expiresAt = session.getLastAccessedTime() + (session.getMaxInactiveInterval() * 1000L);

        // 🔥 GENEROWANIE PEŁNEGO URL DO AVATARA
        String avatarUrl = null;
        if (m.getAvatarFileName() != null) {
            avatarUrl = "/api/gallery/files/" + m.getAvatarFileName();
        }

        return ResponseEntity.ok(new MeResponse(
                m.getId(),
                m.getEmail(),
                m.getLogin(),
                m.getFirstName(),
                m.getLastName(),
                m.getRole() != null ? m.getRole().name() : null,
                m.getBirthDate(),
                expiresAt,
                m.getTelefon(),
                m.getAdres(),
                m.getKoordynator(),
                avatarUrl
        ));
    }

    @PutMapping("/api/meInfo")
    public ResponseEntity<?> updateMe(@RequestBody MemberDtO.MemberDto dto, Authentication authentication) {

        String email = authentication.getName();

        Member m = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Zalogowany użytkownik nie istnieje w bazie: " + email));

        m.setFirstName(dto.firstName());
        m.setLastName(dto.lastName());
        m.setTelefon(dto.telefon());
        m.setAdres(dto.adres());
        m.setKoordynator(dto.koordynator());
        m.setBirthDate(dto.birthDate());

        memberRepository.save(m);

        return ResponseEntity.ok().build();
    }
}
