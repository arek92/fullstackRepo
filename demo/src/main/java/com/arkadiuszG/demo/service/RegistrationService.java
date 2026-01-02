package com.arkadiuszG.demo.service;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.RegisterRequest;
import com.arkadiuszG.demo.model.Role;
import com.arkadiuszG.demo.model.VerificationToken;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.arkadiuszG.demo.repository.VerificationTokenRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
@Getter
@Setter
public class RegistrationService {

    private final MemberRepository memberRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public void register(RegisterRequest request) {

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already in use");
        }

        Member member = new Member();
        member.setEmail(request.getEmail());
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setLogin(request.getLogin());
        member.setRole(Role.valueOf(request.getRole()));
        member.setAdres(request.getAdres());
        member.setTelefon(request.getTelefon());
        member.setKoordynator(request.getKoordynator());
        member.setBirthDate(request.getDataUrodzenia());
// MEMBER lub COORDINATOR
        member.setEnabled(false);


        memberRepository.save(member);

        String tokenString = UUID.randomUUID().toString();

        VerificationToken token = new VerificationToken();
        token.setToken(tokenString);
        token.setMember(member);
        token.setExpiryDate(LocalDateTime.now().plusHours(24));

        tokenRepository.save(token);

        String link = "http://localhost:8099/api/auth/confirm?token=" + tokenString;

        emailService.send(
                member.getEmail(),
                "Aktywacja konta",
                "Kliknij aby aktywować konto: " + link
        );
    }
}
