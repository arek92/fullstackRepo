package com.arkadiuszG.demo.repository;

import com.arkadiuszG.demo.model.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishRepository extends JpaRepository<Wish, Long> {

    // Pobiera nieprzeczytane życzenia dla konkretnego użytkownika (po jego emailu)
    List<Wish> findByRecipientEmailAndSeenFalse(String email);



}
