package sn.autoecole.enums;

public enum ResultatExamen {
    ADMIS("Admis"),
    REFUSE("Refusé"),
    EN_ATTENTE("En attente de résultat");

    private final String libelle;

    ResultatExamen(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
