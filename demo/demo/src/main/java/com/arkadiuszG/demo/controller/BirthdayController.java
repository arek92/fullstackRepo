package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.dTo.BirthdayResponse;
import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.repository.MemberRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;


@RestController
@AllArgsConstructor
public class BirthdayController {

    private final MemberRepository memberRepository;


    @GetMapping("/api/birthday")
    public List<BirthdayResponse> getBirthdayFromCurrentDay(){
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int day = today.getDayOfMonth();
        List<BirthdayResponse>bornInCurrentDayUsersList = memberRepository.findByMonthAndDay(month,day);
        return bornInCurrentDayUsersList;
    }


}
