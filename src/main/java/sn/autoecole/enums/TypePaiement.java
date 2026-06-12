package sn.autoecole.enums;

public enum TypePaiement {
    INSCRIPTION("Frais d'inscription"),
    LECON("Frais de leçon"),
    EXAMEN("Frais d'examen"),
    AUTRE("Autre paiement");

    private final String libelle;

    TypePaiement(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
