package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.model.RegisterRequest;
import com.arkadiuszG.demo.service.RegistrationService;
import com.arkadiuszG.demo.service.VerificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrationService registrationService;
    private final VerificationService verificationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        registrationService.register(request);
        return ResponseEntity.ok("Na email wysłano link aktywacyjny.");
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam String token) {
        verificationService.verifyToken(token);
        return ResponseEntity.ok("Konto aktywowane! Możesz się zalogować.");
    }
}
