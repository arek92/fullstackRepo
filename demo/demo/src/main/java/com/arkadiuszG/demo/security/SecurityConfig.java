package com.arkadiuszG.demo.security;


import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.repository.MemberRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;  // Dodaj ten import
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final MemberRepository memberRepository;

    public SecurityConfig(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Member member = memberRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            System.out.println("username found " + username);
            return (org.springframework.security.core.userdetails.UserDetails) member;

        };
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JsonUsernamePasswordAuthenticationFilter jsonFilter) throws Exception {  // Dodaj parametr: wstrzyknij bean filtra
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/error").permitAll()
                                .requestMatchers("/login", "/logout").permitAll()
                        .requestMatchers("/api/password/**").permitAll()
                        .requestMatchers("/api/gallery/**").authenticated()
                        .requestMatchers("/api/gallery/files/**").permitAll()
                        .requestMatchers("/api/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setExposedHeaders(List.of("Authorization", "Content-Type"));  // Dodaj exposed headers dla lepszej obsługi
                    config.setAllowCredentials(true);
                    return config;
                }))
                .addFilterBefore(jsonFilter, UsernamePasswordAuthenticationFilter.class)  // Użyj wstrzykniętego filtra (bez null)
                .logout(logout -> logout
                        .permitAll()
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                );

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


        @Bean
    public JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter(AuthenticationConfiguration config) throws Exception {
        JsonUsernamePasswordAuthenticationFilter filter = new JsonUsernamePasswordAuthenticationFilter();
        filter.setFilterProcessesUrl("/login");
        filter.setAuthenticationManager(authenticationManager(config));  // To jest poprawne
        filter.setAuthenticationSuccessHandler((req, res, auth) -> res.setStatus(200));
        filter.setAuthenticationFailureHandler((req, res, exc) -> res.setStatus(401));
        return filter;
    }



    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
