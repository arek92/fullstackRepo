package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.model.Event;
import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.repository.CalendarEventRepository;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.sun.jdi.request.EventRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
public class CalendarController {

    private final CalendarEventRepository calendarEventRepository;
    private final MemberRepository memberRepository;

    // Dodajemy authorName do odpowiedzi
    public record EventResponse(Long id, String title, LocalDate eventDate, String authorName) {}
    public record EventRequest(String title, LocalDate eventDate) {}



    @PostMapping("/api/calendar/add")
    public ResponseEntity<?> addEvent(@RequestBody EventRequest request, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        Member currentUser = memberRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));

        Event event = new Event();
        event.setTitle(request.title());
        event.setEventDate(request.eventDate());
        event.setAuthor(currentUser); // Ustawiamy autora

        calendarEventRepository.save(event);
        return ResponseEntity.ok().build();
    }

    @GetMapping("api/calendar/year/{year}")
    public List<EventResponse> getEventsForYear(@PathVariable int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);

        return calendarEventRepository.findByEventDateBetweenOrderByEventDateAsc(start, end)
                .stream()
                .map(e -> new EventResponse(
                        e.getId(),
                        e.getTitle(),
                        e.getEventDate(),
                        e.getAuthor() != null ? e.getAuthor().getFirstName() + " " + e.getAuthor().getLastName() : "Anonim"
                ))
                .toList();
    }


    //usuwanie wydarzenia
    @DeleteMapping("/api/calendar/event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        return calendarEventRepository.findById(id).map(event -> {
            // Sprawdzamy czy autor to ta sama osoba co zalogowany użytkownik
            if (event.getAuthor() != null && event.getAuthor().getEmail().equals(authentication.getName())) {
                calendarEventRepository.delete(event);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.status(403).build(); // Forbidden - nie twoje wydarzenie
        }).orElse(ResponseEntity.notFound().build());
    }





}
