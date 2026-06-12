package sn.autoecole.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import sn.autoecole.entity.Cours;
import sn.autoecole.enums.CategoriePanneau;
import sn.autoecole.enums.Langue;
import sn.autoecole.enums.TypeContenu;
import sn.autoecole.repository.CoursRepository;

import java.util.List;

@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
public class PanneauxDangerSeeder implements CommandLineRunner {

    private final CoursRepository coursRepository;

    @Override
    public void run(String... args) {
        if (coursRepository.existsByTitreAndCategorie("Virage à droite (A1)", CategoriePanneau.DANGER)) return;

        coursRepository.saveAll(List.of(
            img("Virage à droite (A1)",
                "Panneau triangulaire à bordure rouge. Signale un virage dangereux vers la droite à 150-300 m.",
                "https://codedelaroute.io/blog/content/images/2020/08/panneau-de-danger-virage-a--droite-copie.png"),

            img("Virage à gauche (A2)",
                "Panneau triangulaire à bordure rouge. Signale un virage dangereux vers la gauche à 150-300 m.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-virage-a--gauche.png"),

            img("Succession de virages — premier à droite (A3a)",
                "Signale une suite de virages dont le premier est à droite. Réduisez votre vitesse.",
                "https://codedelaroute.io/blog/content/images/2020/08/panneau-de-danger-succession-virage-droite-.png"),

            img("Succession de virages — premier à gauche (A3b)",
                "Signale une suite de virages dont le premier est à gauche. Réduisez votre vitesse.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-succession-de-virages-gauche.png"),

            img("Cassis ou dos d'âne (A4)",
                "Signale une chaussée inégale (creux ou bosse). Ralentissez pour éviter des dommages au véhicule.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-cassis-dos-d-a-ne.png"),

            img("Ralentisseur (A5)",
                "Signale la présence d'un ralentisseur (dos d'âne artificiel). Ralentissez avant de le franchir.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-ralentisseur.png"),

            img("Chaussée rétrécie (droite et gauche) (A6)",
                "La chaussée se rétrécit des deux côtés. Soyez vigilant et laissez la priorité si nécessaire.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-chausse-e-re-tre-cie-droite-et-gauche.png"),

            img("Chaussée rétrécie par la droite (A7a)",
                "La chaussée se rétrécit du côté droit. Les véhicules venant en sens inverse peuvent être prioritaires.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-de-danger-chaussee-retrecie-par-la-droite.jpg"),

            img("Chaussée rétrécie par la gauche (A7b)",
                "La chaussée se rétrécit du côté gauche. Adaptez votre position sur la chaussée.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-chausse-e-re-tre-cie-par-la-gauche.png"),

            img("Chaussée glissante (A8)",
                "Signale une chaussée glissante (verglas, boue, gravillons). Réduisez la vitesse et évitez les freinages brusques.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-chausse-e-glissante-verglas.png"),

            img("Pont mobile (A9a)",
                "Signale un pont mobile pouvant être ouvert. Soyez prêt à vous arrêter.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-pont-mobile.png"),

            img("Barrière mobile manuelle (A9b)",
                "Passage à niveau avec barrière manuelle. Ralentissez et soyez prêt à vous arrêter.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-barrie-re-mobile-manuelle.png"),

            img("Passage à niveau sans barrière (A10)",
                "Croisement avec une voie ferrée sans barrière. Arrêtez-vous et assurez-vous qu'aucun train n'arrive.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-passage-a--niveau-sans-barrie-re.png"),

            img("Voies de tramway (A11)",
                "Signale un croisement ou un cheminement de voies de tramway. Attention aux rails glissants.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-voies-tramway.png"),

            img("Présence d'enfants (A12)",
                "Zone scolaire ou aire de jeux. Des enfants peuvent traverser la chaussée de façon imprévisible.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-pre-sence-d-enfants-1.png"),

            img("Passage piéton (A13)",
                "Signale un passage pour piétons. Réduisez la vitesse et soyez prêt à céder le passage.",
                "https://codedelaroute.io/blog/content/images/2022/03/passage-pieton.jpg"),

            img("Danger général (A14)",
                "Signale un danger non défini par un autre panneau. Soyez particulièrement prudent.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-danger.jpg"),

            img("Passage d'animaux domestiques — moutons (A15a)",
                "Des moutons ou des troupeaux peuvent traverser. Ralentissez et soyez prêt à vous arrêter.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneaux-de-danger-passage-d-animaux-moutons.png"),

            img("Passage d'animaux domestiques — vaches (A15b)",
                "Des vaches ou des troupeaux peuvent traverser. Ralentissez et restez vigilant.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-passage-d-animaux-vaches.png"),

            img("Passage d'animaux sauvages (A16)",
                "Des animaux sauvages peuvent surgir sur la chaussée. Soyez particulièrement vigilant la nuit.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-passage-d-animaux-sauvages.png"),

            img("Passage de cavaliers (A17)",
                "Signale un lieu fréquenté par des cavaliers ou chevaux. Ralentissez et évitez les klaxons.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-passage-de-cavaliers.png"),

            img("Pente périlleuse (A18)",
                "Signale une descente dangereuse. Réduisez la vitesse, passez une vitesse inférieure et évitez de freiner en continu.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-ente-de-10--.png"),

            img("Feux tricolores (A19)",
                "Signale la présence prochaine de feux de signalisation. Anticipez et adaptez votre allure.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-feux-tricolores.png"),

            img("Circulation dans les deux sens (A20)",
                "La route passe en double sens. Restez sur votre droite et soyez vigilant face aux véhicules venant en sens inverse.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneaux-de-danger-circulation-dans-les-deux-sens.png"),

            img("Chutes de pierres (A21)",
                "Risque de chutes de pierres ou d'éboulements. Ne vous arrêtez pas sous les talus et restez attentif.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-risque-de-chutes-de-pierres.png"),

            img("Berge ou quai (A22)",
                "Signale la proximité d'une berge, d'un quai ou d'un plan d'eau. Soyez prudent sur la chaussée.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-berge-et-quai.png"),

            img("Présence de cyclistes (A23)",
                "Des cyclistes circulent ou traversent dans cette zone. Laissez suffisamment d'espace de dépassement.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-pre-sence-de-cyclistes.png"),

            img("Aire de danger aérien (A24)",
                "Zone de survol à basse altitude d'aéronefs. Attention aux mouvements aériens inhabituels.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-champ-ae-rien.png"),

            img("Fort vent latéral (A25)",
                "Signale un risque de vent latéral fort. Tenez fermement le volant et réduisez votre vitesse.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-risque-vent-late-ral-fort.png"),

            img("Brouillard fréquent (A26)",
                "Zone souvent exposée au brouillard ou aux fumées épaisses. Allumez les feux de brouillard et réduisez la vitesse.",
                "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-brouillard-fre-quent-fume-e-e-paisse.png"),

            img("Carrefour à sens giratoire (AB)",
                "Signale l'approche d'un carrefour giratoire. Cédez le passage aux véhicules déjà engagés dans le rond-point.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-de-danger-carrefour-a-sens-giratoire.png"),

            img("Intersection — Priorité à droite (AB1)",
                "Signale une intersection où la règle de priorité à droite s'applique.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-de-danger-intersection-priorite-a-droite.png"),

            img("Intersection — Priorité ponctuelle (AB2)",
                "Signale une intersection où vous bénéficiez d'une priorité ponctuelle sur les véhicules venant des côtés.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-de-danger-intersection-priorite-ponctuelle.png"),

            img("Intersection — Cédez le passage (AB3a)",
                "Signale une intersection où vous devez céder le passage à la route principale.",
                "https://codedelaroute.io/blog/content/images/2022/03/Panneau-AB3a.png")
        ));

        log.info("Panneaux de danger insérés avec succès ({} panneaux)", 31);
    }

    private Cours img(String titre, String description, String imageUrl) {
        return Cours.builder()
                .titre(titre).description(description)
                .typeContenu(TypeContenu.IMAGE).langue(Langue.FRANCAIS)
                .categorie(CategoriePanneau.DANGER).imageUrl(imageUrl).build();
    }
}
