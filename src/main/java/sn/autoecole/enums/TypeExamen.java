package sn.autoecole.enums;

public enum TypeExamen {
    CODE("Examen du code"),
    CONDUITE("Examen de conduite");

    private final String libelle;

    TypeExamen(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
