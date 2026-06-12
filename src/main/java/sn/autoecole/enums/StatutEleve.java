package sn.autoecole.enums;

public enum StatutEleve {
    EN_COURS("En cours de formation"),
    SUSPENDU("Formation suspendue"),
    DIPLOME("Permis obtenu"),
    ABANDONNE("Formation abandonnée");

    private final String libelle;

    StatutEleve(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
