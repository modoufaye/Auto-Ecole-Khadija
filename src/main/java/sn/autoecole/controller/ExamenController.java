package sn.autoecole.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.dto.ExamenRequest;
import sn.autoecole.entity.Examen;
import sn.autoecole.enums.ResultatExamen;
import sn.autoecole.service.ExamenService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/examens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamenController {

    private final ExamenService examenService;

    @GetMapping
    public ResponseEntity<List<Examen>> listerTous() {
        return ResponseEntity.ok(examenService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Examen> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(examenService.trouverParId(id));
    }

    @GetMapping("/resultat/{resultat}")
    public ResponseEntity<List<Examen>> listerParResultat(@PathVariable ResultatExamen resultat) {
        return ResponseEntity.ok(examenService.listerParResultat(resultat));
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Examen>> listerParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(examenService.listerParPeriode(debut, fin));
    }

    @PostMapping
    public ResponseEntity<Examen> creer(@Valid @RequestBody ExamenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examenService.creer(request));
    }

    @PatchMapping("/{id}/resultat")
    public ResponseEntity<Examen> mettreAJourResultat(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        ResultatExamen resultat = ResultatExamen.valueOf((String) body.get("resultat"));
        Integer score = body.get("score") != null ? ((Number) body.get("score")).intValue() : null;
        String observations = (String) body.get("observations");
        return ResponseEntity.ok(examenService.mettreAJourResultat(id, resultat, score, observations));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        examenService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
