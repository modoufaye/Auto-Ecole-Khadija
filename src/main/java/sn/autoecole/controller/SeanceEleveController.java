package sn.autoecole.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.dto.SeanceResponse;
import sn.autoecole.service.SeanceService;

import java.util.List;

@RestController
@RequestMapping("/api/eleve/seances")
@RequiredArgsConstructor
public class SeanceEleveController {

    private final SeanceService seanceService;

    @GetMapping
    public List<SeanceResponse> list(@AuthenticationPrincipal UserDetails user) {
        return seanceService.findPublishedForEleve(user.getUsername());
    }

    @GetMapping("/{id}")
    public SeanceResponse get(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        return seanceService.findByIdForEleve(id, user.getUsername());
    }
}
