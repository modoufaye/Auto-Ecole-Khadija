package sn.autoecole.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.dto.VehiculeRequest;
import sn.autoecole.entity.Vehicule;
import sn.autoecole.enums.CategoriePermis;
import sn.autoecole.enums.StatutVehicule;
import sn.autoecole.service.VehiculeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehiculeController {

    private final VehiculeService vehiculeService;

    @GetMapping
    public ResponseEntity<List<Vehicule>> listerTous() {
        return ResponseEntity.ok(vehiculeService.listerTous());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Vehicule>> listerDisponibles() {
        return ResponseEntity.ok(vehiculeService.listerDisponibles());
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Vehicule>> listerParStatut(@PathVariable StatutVehicule statut) {
        return ResponseEntity.ok(vehiculeService.listerParStatut(statut));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Vehicule>> listerParCategorie(@PathVariable CategoriePermis categorie) {
        return ResponseEntity.ok(vehiculeService.listerParCategorie(categorie));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculeService.trouverParId(id));
    }

    @PostMapping
    public ResponseEntity<Vehicule> creer(@Valid @RequestBody VehiculeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehiculeService.creer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicule> modifier(@PathVariable Long id, @Valid @RequestBody VehiculeRequest request) {
        return ResponseEntity.ok(vehiculeService.modifier(id, request));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Vehicule> changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StatutVehicule statut = StatutVehicule.valueOf(body.get("statut"));
        return ResponseEntity.ok(vehiculeService.changerStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        vehiculeService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
