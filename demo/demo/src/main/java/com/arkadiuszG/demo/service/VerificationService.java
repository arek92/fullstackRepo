package com.arkadiuszG.demo.service;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.VerificationToken;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.arkadiuszG.demo.repository.VerificationTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class VerificationService {

    private final VerificationTokenRepository tokenRepository;
    private final MemberRepository memberRepository;

    public void verifyToken(String tokenValue) {
        VerificationToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new IllegalStateException("Token not found"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new IllegalStateException("Token expired");
        }

        Member member = token.getMember();
        member.setEnabled(true);

        memberRepository.save(member);
        tokenRepository.delete(token);
    }
}
