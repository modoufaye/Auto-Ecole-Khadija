package sn.autoecole.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import sn.autoecole.enums.ResultatExamen;
import sn.autoecole.enums.TypeExamen;

import java.time.LocalDate;

@Entity
@Table(name = "examens")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date est obligatoire")
    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "eleve_id", nullable = false)
    @NotNull(message = "L'élève est obligatoire")
    private Eleve eleve;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type d'examen est obligatoire")
    @Column(nullable = false)
    private TypeExamen type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResultatExamen resultat = ResultatExamen.EN_ATTENTE;

    @Min(value = 0, message = "Le score ne peut pas être négatif")
    @Max(value = 100, message = "Le score ne peut pas dépasser 100")
    private Integer score;

    @Column(nullable = false)
    @Builder.Default
    private int tentative = 1;

    @Column(length = 500)
    private String observations;
}
