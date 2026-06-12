package sn.autoecole.enums;

public enum TypeLecon {
    CODE("Leçon de code"),
    CONDUITE("Leçon de conduite");

    private final String libelle;

    TypeLecon(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
