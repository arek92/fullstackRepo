package com.arkadiuszG.demo.configuration;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.Role;
import com.arkadiuszG.demo.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String email = "arkadiuszgalus85@gmail.com";

            if (memberRepository.findByEmail(email).isEmpty()) {
                Member admin = new Member();
                admin.setEmail("arkadiuszgalus85@gmail.com");
                admin.setLogin("koiAdmin");
                admin.setFirstName("Admin");
                admin.setLastName("Systemowy");
                admin.setPassword(passwordEncoder.encode("koiAdmin"));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);

                memberRepository.save(admin);

                memberRepository.save(admin);
                System.out.println("✔ Domyślny admin utworzony");
            }
        };
    }
}
