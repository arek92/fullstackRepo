package com.arkadiuszG.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Wish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean seen = false;

    // Odbiorca życzeń
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Member recipient;


     @ManyToOne
     @JoinColumn(name = "sender_id")
     private Member sender;
}

