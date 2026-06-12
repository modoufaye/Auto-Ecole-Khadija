package sn.autoecole.entity;

import jakarta.persistence.*;
import lombok.*;
import sn.autoecole.enums.CategoriePanneau;
import sn.autoecole.enums.Langue;
import sn.autoecole.enums.TypeContenu;

@Entity
@Table(name = "cours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_contenu", nullable = false)
    private TypeContenu typeContenu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Langue langue;

    @Enumerated(EnumType.STRING)
    private CategoriePanneau categorie;

    // URL de l'image (pour typeContenu = IMAGE)
    private String imageUrl;

    // Texte du cours (pour typeContenu = ECRITE)
    @Column(length = 3000)
    private String contenu;
}
