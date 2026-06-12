package sn.autoecole.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SeanceResponse(
    Long id,
    String titre,
    LocalDateTime dateHeure,
    String theme,
    String statut,
    Long moniteurId,
    String moniteurNom,
    List<EleveInfo> eleves,
    List<BlocInfo> blocs,
    LocalDateTime createdAt
) {
    public record EleveInfo(Long id, String nom, String email) {}
    public record BlocInfo(Long id, String typeBloc, String contenu, String mediaUrl, Integer ordre) {}
}
