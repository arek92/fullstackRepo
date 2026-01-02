package com.arkadiuszG.demo.controller;

import com.arkadiuszG.demo.model.Member;
import com.arkadiuszG.demo.model.Photo;
import com.arkadiuszG.demo.repository.MemberRepository;
import com.arkadiuszG.demo.repository.PhotoRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gallery")
@AllArgsConstructor
public class GalleryController {

    private final PhotoRepository photoRepository;
    private final String UPLOAD_DIR = "uploads/";
    private final MemberRepository memberRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file,
                                         @RequestParam("category") String category, Authentication authentication) throws IOException {

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Photo photo = new Photo();
        photo.setFileName(fileName);
        photo.setCategory(category);
        photo.setContentType(file.getContentType());
        photoRepository.save(photo);

        // 🔗 POWIĄZANIE Z UŻYTKOWNIKIEM
        if ("avatar".equals(category) && authentication != null) {
            String email = authentication.getName();
            Member m = memberRepository.findByEmail(email).orElseThrow();
            m.setAvatarFileName(fileName);
            memberRepository.save(m);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/photos")
    public List<Photo> getPhotos(@RequestParam String category) {
        return photoRepository.findByCategory(category);
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<UrlResource> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename);
            UrlResource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Możesz to ulepszyć sprawdzając typ pliku
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        //1. Pobranie zdjęcia z bazy
        Photo photo = photoRepository.findById(id).orElseThrow(() -> new IllegalStateException("Zdjęcie nie istnieje: " + id));
        // 2. Usunięcie pliku fizycznego
        Path filePath = Paths.get(UPLOAD_DIR).resolve(photo.getFileName());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Nie udało się usunąć pliku");
        }

        // 3. Usunięcie rekordu z bazy
        photoRepository.delete(photo);
        return ResponseEntity.ok().build();
    }
}


