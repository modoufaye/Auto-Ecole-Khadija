package sn.autoecole.enums;

public enum CategoriePermis {
    A("Motocyclettes lourdes (>125cc)"),
    A1("Motocyclettes légères (<=125cc)"),
    B("Voitures particulières"),
    C("Camions et poids lourds"),
    D("Transport en commun (bus)"),
    EB("Voitures avec remorque légère"),
    EC("Camions avec remorque");

    private final String description;

    CategoriePermis(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
