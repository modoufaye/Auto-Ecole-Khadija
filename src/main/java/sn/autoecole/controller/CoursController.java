package sn.autoecole.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.autoecole.entity.Cours;
import sn.autoecole.enums.CategoriePanneau;
import sn.autoecole.enums.Langue;
import sn.autoecole.enums.TypeContenu;
import sn.autoecole.repository.CoursRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cours")
@RequiredArgsConstructor
public class CoursController {

    private final CoursRepository coursRepository;

    @GetMapping
    public List<Cours> getAll() {
        return coursRepository.findAll();
    }

    @GetMapping("/langue/{langue}")
    public List<Cours> getByLangue(@PathVariable Langue langue) {
        return coursRepository.findByLangue(langue);
    }

    @GetMapping("/type/{type}")
    public List<Cours> getByType(@PathVariable TypeContenu type) {
        return coursRepository.findByTypeContenu(type);
    }

    @GetMapping("/categorie/{categorie}")
    public List<Cours> getByCategorie(@PathVariable CategoriePanneau categorie) {
        return coursRepository.findByCategorie(categorie);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cours> getById(@PathVariable Long id) {
        return coursRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cours> create(@RequestBody Map<String, String> body) {
        String titre = body.get("titre");
        if (titre == null || titre.isBlank())
            return ResponseEntity.badRequest().build();
        Cours cours = Cours.builder()
                .titre(titre.trim())
                .description(body.get("description"))
                .contenu(body.get("contenu"))
                .imageUrl(body.get("imageUrl"))
                .typeContenu(TypeContenu.valueOf(body.getOrDefault("typeContenu", "IMAGE")))
                .langue(Langue.valueOf(body.getOrDefault("langue", "FRANCAIS")))
                .categorie(body.get("categorie") != null ? CategoriePanneau.valueOf(body.get("categorie")) : null)
                .build();
        return ResponseEntity.ok(coursRepository.save(cours));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cours> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return coursRepository.findById(id).map(cours -> {
            if (body.containsKey("titre")       && body.get("titre") != null) cours.setTitre(body.get("titre").trim());
            if (body.containsKey("description")) cours.setDescription(body.get("description"));
            if (body.containsKey("contenu"))     cours.setContenu(body.get("contenu"));
            if (body.containsKey("imageUrl"))    cours.setImageUrl(body.get("imageUrl"));
            if (body.containsKey("langue"))      cours.setLangue(Langue.valueOf(body.get("langue")));
            if (body.containsKey("categorie") && body.get("categorie") != null)
                cours.setCategorie(CategoriePanneau.valueOf(body.get("categorie")));
            return ResponseEntity.ok(coursRepository.save(cours));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!coursRepository.existsById(id)) return ResponseEntity.notFound().build();
        coursRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
