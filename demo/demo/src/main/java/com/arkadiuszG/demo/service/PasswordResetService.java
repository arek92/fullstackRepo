package com.arkadiuszG.demo.service;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.token.PasswordResetToken;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.arkadiuszG.demo.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final MemberRepository memberRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public void requestReset(String email) {
        memberRepository.findByEmail(email).ifPresent(member -> {
            // usuń poprzednie tokeny resetu dla usera (żeby był tylko jeden aktywny)
            tokenRepository.deleteByMemberId(member.getId());

            String tokenValue = UUID.randomUUID().toString().replace("-", "");
            PasswordResetToken token = new PasswordResetToken();
            token.setToken(tokenValue);
            token.setMember(member);
            token.setExpiryDate(LocalDateTime.now().plusMinutes(30));
            tokenRepository.save(token);

            // link do frontendu (strona ustawienia nowego hasła)
            String link = "http://localhost:5173/reset-hasla?token=" + tokenValue;

            emailService.send(
                    member.getEmail(),
                    "Reset hasła",
                    "Kliknij link aby ustawić nowe hasło: " + link
            );
        });

        // celowo: brak info czy email istnieje
    }

    public void resetPassword(String tokenValue, String newPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new IllegalStateException("Nieprawidłowy token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new IllegalStateException("Token wygasł");
        }

        Member member = token.getMember();
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);

        tokenRepository.delete(token);
    }
}
