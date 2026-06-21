package sn.autoecole.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.dto.DashboardStats;
import sn.autoecole.repository.EleveRepository;
import sn.autoecole.service.DashboardService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final EleveRepository eleveRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/eleves-par-semaine")
    public ResponseEntity<List<Map<String, Object>>> getElevesParSemaine() {
        return ResponseEntity.ok(eleveRepository.countElevesParSemaine());
    }
}
