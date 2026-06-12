package sn.autoecole.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import sn.autoecole.entity.User;
import sn.autoecole.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/compte")
@RequiredArgsConstructor
public class CompteController {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profil")
    public Map<String, Object> getProfil(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return Map.of("id", user.getId(), "nom", user.getNom(), "email", user.getEmail(), "role", user.getRole());
    }

    @PutMapping("/profil")
    public Map<String, Object> updateProfil(Authentication auth, @RequestBody Map<String, String> body) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.containsKey("nom") && body.get("nom") != null && !body.get("nom").isBlank())
            user.setNom(body.get("nom").trim());
        userRepository.save(user);
        return Map.of("id", user.getId(), "nom", user.getNom(), "email", user.getEmail(), "role", user.getRole());
    }

    @PutMapping("/changer-mot-de-passe")
    public ResponseEntity<?> changerMotDePasse(Authentication auth, @RequestBody Map<String, String> body) {
        String ancien  = body.get("ancienMotDePasse");
        String nouveau = body.get("nouveauMotDePasse");

        if (ancien == null || nouveau == null || nouveau.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("erreur", "Données invalides (minimum 6 caractères)"));

        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(ancien, user.getMotDePasse()))
            return ResponseEntity.badRequest().body(Map.of("erreur", "Ancien mot de passe incorrect"));

        user.setMotDePasse(passwordEncoder.encode(nouveau));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
    }
}
