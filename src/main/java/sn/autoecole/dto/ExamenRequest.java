package sn.autoecole.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import sn.autoecole.enums.ResultatExamen;
import sn.autoecole.enums.TypeExamen;

import java.time.LocalDate;

@Data
public class ExamenRequest {

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    @NotNull(message = "L'id de l'élève est obligatoire")
    private Long eleveId;

    @NotNull(message = "Le type d'examen est obligatoire")
    private TypeExamen type;

    private ResultatExamen resultat;

    @Min(0) @Max(100)
    private Integer score;

    private String observations;
}
