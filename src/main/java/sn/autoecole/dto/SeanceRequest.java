package sn.autoecole.dto;

import java.util.List;

public record SeanceRequest(
    String titre,
    String dateHeure,
    String theme,
    String statut,
    List<Long> eleveIds,
    List<BlocRequest> blocs
) {}
