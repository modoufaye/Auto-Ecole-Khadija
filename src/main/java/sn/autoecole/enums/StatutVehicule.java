package sn.autoecole.enums;

public enum StatutVehicule {
    DISPONIBLE("Disponible"),
    EN_COURS("En cours d'utilisation"),
    EN_MAINTENANCE("En maintenance"),
    HORS_SERVICE("Hors service");

    private final String libelle;

    StatutVehicule(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
