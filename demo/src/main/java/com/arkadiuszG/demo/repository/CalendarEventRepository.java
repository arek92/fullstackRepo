package com.arkadiuszG.demo.repository;

import com.arkadiuszG.demo.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<Event,Long> {

    // Pobiera wydarzenia z danego zakresu dat (np. dla konkretnego miesiąca lub roku)
    List<Event> findByEventDateBetweenOrderByEventDateAsc(LocalDate start, LocalDate end);

}
