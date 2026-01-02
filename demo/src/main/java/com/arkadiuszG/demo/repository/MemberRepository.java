package com.arkadiuszG.demo.repository;

import com.arkadiuszG.demo.dTo.BirthdayResponse;
import com.arkadiuszG.demo.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {



    boolean existsByEmail(String email);

    Optional<Member> findByEmail(String email);

//    @Query("SELECT new com.arkadiuszG.demo.dTo.BirthdayResponse(m.firstName, m.lastName) " +
//            "FROM Member m WHERE MONTH(m.birthDate) = :month AND DAY(m.birthDate) = :day")
//    List<BirthdayResponse> findByMonthAndDay(@Param("month") int month, @Param("day") int day);

    @Query("SELECT new com.arkadiuszG.demo.dTo.BirthdayResponse(m.firstName, m.lastName, m.email) " +
            "FROM Member m WHERE MONTH(m.birthDate) = :month AND DAY(m.birthDate) = :day")
    List<BirthdayResponse> findByMonthAndDay(@Param("month") int month, @Param("day") int day);







}
