package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.service.PasswordResetService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public record ResetRequest(
            @Email @NotBlank String email
    ) {}

    public record ResetConfirmRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8) String newPassword
    ) {}

    @PostMapping("/reset-request")
    public ResponseEntity<Void> resetRequest(@RequestBody ResetRequest req) {
        passwordResetService.requestReset(req.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> reset(@RequestBody ResetConfirmRequest req) {
        passwordResetService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.ok().build();
    }
}
