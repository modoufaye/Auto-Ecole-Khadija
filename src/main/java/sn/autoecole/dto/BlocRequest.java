package sn.autoecole.dto;

public record BlocRequest(
    String typeBloc,
    String contenu,
    String mediaUrl,
    Integer ordre
) {}
