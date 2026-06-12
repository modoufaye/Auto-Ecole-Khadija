package sn.autoecole.enums;

public enum StatutPaiement {
    PAYE("Payé"),
    EN_ATTENTE("En attente"),
    ANNULE("Annulé");

    private final String libelle;

    StatutPaiement(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
