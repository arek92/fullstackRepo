package com.arkadiuszG.demo.service;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.repository.MemberRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final MemberRepository memberRepository;
//
//    public CustomUserDetailsService(MemberRepository memberRepository) {
//        this.memberRepository = memberRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Member member = memberRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
//
//        return User.builder()
//                .username(member.getEmail())
//                .password(member.getPassword())
//                .disabled(!member.isEnabled())
//                .authorities(String.valueOf(member.getRole()))
//                .build();
//    }
//
//}
