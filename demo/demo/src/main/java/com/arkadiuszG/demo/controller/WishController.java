package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.Wish;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.arkadiuszG.demo.repository.WishRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class WishController {

    private final WishRepository wishRepository;
    private final MemberRepository memberRepository;

    // Rekordy pomocnicze (DTO)
    public record WishRequest(String recipientEmail, String content) {}
    public record WishResponse(Long id, String content, String senderName) {}

    // Endpoint do wysyłania życzeń - teraz pobiera nadawcę z Authentication
    @PostMapping("/api/sendWishes")
    public ResponseEntity<?> sendWish(@RequestBody WishRequest request, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        String senderEmail = authentication.getName(); // Email osoby aktualnie zalogowanej

        Member recipient = memberRepository.findByEmail(request.recipientEmail())
                .orElseThrow(() -> new RuntimeException("Odbiorca nie istnieje"));

        Member sender = memberRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Nadawca nie istnieje"));

        Wish wish = new Wish();
        wish.setContent(request.content());
        wish.setRecipient(recipient);
        wish.setSender(sender); // Ustawiamy nadawcę w encji

        wishRepository.save(wish);
        return ResponseEntity.ok().build();
    }

    // Endpoint do pobierania życzeń - teraz zwraca listę obiektów (treść + nadawca)
    @GetMapping("/api/myWishes")
    public List<WishResponse> getMyWishes(Authentication authentication) {
        if (authentication == null) return List.of();

        String myEmail = authentication.getName();
        List<Wish> wishes = wishRepository.findByRecipientEmailAndSeenFalse(myEmail);

        // Mapujemy encje na ładne odpowiedzi z imieniem i nazwiskiem nadawcy
        return wishes.stream()
                .map(w -> new WishResponse(
                        w.getId(),
                        w.getContent(),
                        w.getSender().getFirstName() + " " + w.getSender().getLastName()
                ))
                .toList();
    }
    @DeleteMapping("/api/wishes/{id}")
    public ResponseEntity<?> deleteWish(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        return wishRepository.findById(id).map(wish -> {
            // Sprawdzenie bezpieczeństwa: czy zalogowany użytkownik jest odbiorcą tego życzenia?
            if (wish.getRecipient().getEmail().equals(authentication.getName())) {
                wishRepository.delete(wish);
                return ResponseEntity.ok().build();
            }
            // Jeśli ktoś próbuje usunąć nie swoje życzenie
            return ResponseEntity.status(403).build();
        }).orElse(ResponseEntity.notFound().build());
    }



}
