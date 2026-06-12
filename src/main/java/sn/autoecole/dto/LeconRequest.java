package sn.autoecole.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import sn.autoecole.enums.TypeLecon;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class LeconRequest {

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    @NotNull(message = "L'id de l'élève est obligatoire")
    private Long eleveId;

    @NotNull(message = "L'id du moniteur est obligatoire")
    private Long moniteurId;

    private Long vehiculeId;

    @NotNull(message = "Le type de leçon est obligatoire")
    private TypeLecon type;

    private String observations;
}
