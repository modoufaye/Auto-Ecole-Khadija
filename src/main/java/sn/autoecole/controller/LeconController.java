package sn.autoecole.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.dto.LeconRequest;
import sn.autoecole.entity.Lecon;
import sn.autoecole.enums.StatutLecon;
import sn.autoecole.service.LeconService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lecons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeconController {

    private final LeconService leconService;

    @GetMapping
    public ResponseEntity<List<Lecon>> listerTous() {
        return ResponseEntity.ok(leconService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lecon> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(leconService.trouverParId(id));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Lecon>> listerParDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(leconService.listerParDate(date));
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Lecon>> listerParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(leconService.listerParPeriode(debut, fin));
    }

    @PostMapping
    public ResponseEntity<Lecon> planifier(@Valid @RequestBody LeconRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leconService.planifier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lecon> modifier(@PathVariable Long id, @Valid @RequestBody LeconRequest request) {
        return ResponseEntity.ok(leconService.modifier(id, request));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Lecon> changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StatutLecon statut = StatutLecon.valueOf(body.get("statut"));
        return ResponseEntity.ok(leconService.changerStatut(id, statut));
    }

    @PatchMapping("/{id}/terminer")
    public ResponseEntity<Lecon> terminer(@PathVariable Long id) {
        return ResponseEntity.ok(leconService.changerStatut(id, StatutLecon.TERMINEE));
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<Lecon> annuler(@PathVariable Long id) {
        return ResponseEntity.ok(leconService.changerStatut(id, StatutLecon.ANNULEE));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        leconService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
