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
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class CoursSeeder implements CommandLineRunner {

    private final CoursRepository coursRepository;

    @Override
    public void run(String... args) {
        if (coursRepository.count() > 0) return;

        coursRepository.saveAll(List.of(

            // ============================================================
            // LEÇONS EN IMAGES — FRANÇAIS
            // ============================================================

            img("Panneau STOP",
                "Panneau octogonal rouge avec inscription STOP en blanc. Obligation de marquer l'arrêt complet avant de s'engager.",
                CategoriePanneau.INTERDICTION, Langue.FRANCAIS,
                "/panneaux/stop.svg"),

            img("Sens interdit",
                "Cercle rouge avec barre horizontale blanche. Accès interdit à tout véhicule dans le sens de circulation indiqué.",
                CategoriePanneau.INTERDICTION, Langue.FRANCAIS,
                "/panneaux/sens_interdit.svg"),

            img("Cédez le passage",
                "Triangle inversé blanc à bordure rouge. Obligation de laisser passer les usagers venant de droite ou de la voie principale.",
                CategoriePanneau.PRIORITE, Langue.FRANCAIS,
                "/panneaux/cedez_passage.svg"),

            img("Vitesse maximale 50 km/h",
                "Cercle blanc à bordure rouge avec le chiffre 50. Vitesse maximale autorisée dans cette zone.",
                CategoriePanneau.INTERDICTION, Langue.FRANCAIS,
                "/panneaux/vitesse_50.svg"),

            img("Virage dangereux à droite",
                "Triangle à fond jaune et bordure rouge avec une flèche courbée vers la droite. Danger : virage serré à droite à venir.",
                CategoriePanneau.DANGER, Langue.FRANCAIS,
                "/panneaux/virage_droit.svg"),

            img("Passage pour piétons",
                "Panneau rectangulaire bleu avec silhouette blanche d'un piéton. Zone de traversée protégée pour les piétons.",
                CategoriePanneau.INFORMATION, Langue.FRANCAIS,
                "/panneaux/passage_pieton.svg"),

            img("Route à priorité",
                "Losange jaune à bordure blanche. Vous êtes sur une route prioritaire, les véhicules venant des intersections doivent céder le passage.",
                CategoriePanneau.PRIORITE, Langue.FRANCAIS,
                "/panneaux/priorite.svg"),

            img("Stationnement interdit",
                "Cercle blanc à bordure rouge avec barre oblique rouge et lettre P bleue. Tout arrêt ou stationnement est interdit.",
                CategoriePanneau.INTERDICTION, Langue.FRANCAIS,
                "/panneaux/stationnement_interdit.svg"),

            img("Direction obligatoire — Tout droit",
                "Cercle bleu avec flèche blanche pointant vers le haut. Vous devez obligatoirement continuer tout droit.",
                CategoriePanneau.OBLIGATION, Langue.FRANCAIS,
                "/panneaux/tout_droit.svg"),

            img("Dos d'âne — Ralentisseur",
                "Triangle à fond jaune et bordure rouge avec une bosse. Ralentissez : présence d'un ralentisseur ou dos d'âne.",
                CategoriePanneau.DANGER, Langue.FRANCAIS,
                "/panneaux/dos_ane.svg"),

            // ============================================================
            // LEÇONS EN IMAGES — WOLOF
            // ============================================================

            img("Signe STOP bi",
                "Signe bu digg-digg, bu xonq, am na 'STOP' ci kanam bu weex. Dina taxaw reewum jëf oto bi ci kanam yoon wi.",
                CategoriePanneau.INTERDICTION, Langue.WOLOF,
                "/panneaux/stop.svg"),

            img("Bañal ko dem ci kaw",
                "Round bu xonq am na bar bu weex ci kaw. Oto yi dañu bañ dem ci diggu yoon wi.",
                CategoriePanneau.INTERDICTION, Langue.WOLOF,
                "/panneaux/sens_interdit.svg"),

            img("Yëgëlu gaaw — 50 km/h",
                "Rond bu weex am na xonq ci digg ak 50. Gaaw bu réy nguur dëkk bu yég 50 km/h du sax.",
                CategoriePanneau.INTERDICTION, Langue.WOLOF,
                "/panneaux/vitesse_50.svg"),

            img("Yoon wu yéef ci ndey",
                "Triang bu digg-digg, bu xonq ak bu weex, am na kanam bu yéef ci ndey. Xam-xam : yoon wu yéef ci ndey.",
                CategoriePanneau.DANGER, Langue.WOLOF,
                "/panneaux/virage_droit.svg"),

            img("Yoon wu top",
                "Rond bu bleu am na kanam bu weex bu dem kanam. Waajibul dem kanam rekk.",
                CategoriePanneau.OBLIGATION, Langue.WOLOF,
                "/panneaux/tout_droit.svg"),

            // ============================================================
            // LEÇONS ÉCRITES — FRANÇAIS
            // ============================================================

            txt("Les panneaux d'interdiction",
                """
                Les panneaux d'interdiction ont une forme ronde avec une bordure rouge.
                Ils imposent aux conducteurs de ne pas effectuer l'action représentée.

                Exemples principaux :
                • Sens interdit : interdit d'entrer dans cette voie.
                • Vitesse maximale (30, 50, 70, 90 km/h) : ne pas dépasser la vitesse indiquée.
                • Dépassement interdit : interdiction de dépasser les autres véhicules.
                • Arrêt et stationnement interdits : on ne peut ni s'arrêter ni se garer.
                • Klaxon interdit : usage du klaxon prohibé dans cette zone.

                À retenir : Un panneau d'interdiction impose une obligation NÉGATIVE.
                Il dit CE QU'IL NE FAUT PAS FAIRE.
                """,
                CategoriePanneau.INTERDICTION, Langue.FRANCAIS),

            txt("Les panneaux de danger",
                """
                Les panneaux de danger ont une forme triangulaire avec une bordure rouge
                et un fond jaune ou blanc. Ils avertissent d'un danger à venir.

                Exemples principaux :
                • Virage à droite / à gauche : virage dangereux dans 150 à 300 m.
                • Dos d'âne / Cassis : chaussée inégale, ralentissez.
                • Passage à niveau : croisement avec une voie ferrée, restez vigilant.
                • Animaux sauvages : attention au passage possible d'animaux.
                • Travaux : chantier sur la route, prudence et ralentissement obligatoires.
                • Enfants : zone scolaire, présence possible d'enfants traversant.

                À retenir : Un panneau de danger indique UN RISQUE. Ralentissez et
                adaptez votre conduite en conséquence.
                """,
                CategoriePanneau.DANGER, Langue.FRANCAIS),

            txt("Les panneaux d'obligation",
                """
                Les panneaux d'obligation ont une forme ronde avec un fond bleu.
                Ils imposent aux conducteurs de respecter l'indication signalée.

                Exemples principaux :
                • Sens obligatoire (flèche) : vous devez emprunter la direction indiquée.
                • Voie réservée aux véhicules lents : respectez la voie désignée.
                • Vitesse minimale obligatoire : vous devez rouler à au moins X km/h.
                • Piste cyclable obligatoire : les cyclistes doivent emprunter cette piste.
                • Port du casque obligatoire : pour les motocyclistes.

                À retenir : Un panneau d'obligation impose une action POSITIVE.
                Il dit CE QU'IL FAUT FAIRE.
                """,
                CategoriePanneau.OBLIGATION, Langue.FRANCAIS),

            txt("Les règles de priorité",
                """
                La priorité définit quel usager passe en premier à une intersection.

                Règles fondamentales :
                1. PRIORITÉ À DROITE : À tout carrefour sans signalisation, le véhicule
                   venant de votre droite est prioritaire.

                2. ROUTE PRIORITAIRE (losange jaune) : Vous êtes prioritaire sur
                   tous les véhicules venant des voies secondaires.

                3. CÉDEZ LE PASSAGE (triangle inversé) : Vous devez laisser passer
                   les usagers venant de la voie principale.

                4. STOP (octogone rouge) : Arrêt OBLIGATOIRE. Même si la voie est libre,
                   vous devez marquer un arrêt complet avant de repartir.

                5. PIÉTONS : Les piétons engagés sur un passage protégé sont TOUJOURS
                   prioritaires.

                À retenir : En cas de doute, ralentissez et cédez le passage.
                """,
                CategoriePanneau.PRIORITE, Langue.FRANCAIS),

            // ============================================================
            // LEÇONS ÉCRITES — WOLOF
            // ============================================================

            txt("Signe yu bañal (Panneaux d'interdiction)",
                """
                Signe yu bañal yi dañu am form bu digg-digg ak xonq ci digg.
                Dañu wax ak oto jaay ñu bañ def loolu.

                Ay misaal yu mag :
                • Bañal ko dem ci kaw : du dem ci yoon wii.
                • Gaaw yu réy (30, 50, 70, 90 km/h) : bañ vượt gaaw bi.
                • Bañal ko vượt : du vượt oto yu ànd.
                • Bañal ko taxaw wala garé : du taxaw wala garé fi.
                • Bañal ko jëflante klaxon : du jëflante klaxon ci dëkk bii.

                Xam-xam bu njëkk : Signe bu bañal di wax LOOLU DU DEF.
                """,
                CategoriePanneau.INTERDICTION, Langue.WOLOF),

            txt("Signe yu xam-xam xaj (Panneaux de danger)",
                """
                Signe yu xam-xam xaj yi dañu am form bu triang, xonq ak jaune.
                Dañu wax ne dafa am yëgëlum-boppam ci kanam.

                Ay misaal yu mag :
                • Yoon wu yéef ci ndey / ci kanam : yoon wu yéef wu yaatu.
                • Dos d'âne / Cassis : yoon du sell, weeyu gaaw bi.
                • Passage à niveau : yoon wu tren, seetante torop.
                • Worma yi : xam-xam ne worma dañu mën dem ci yoon wii.
                • Liggéey : am na liggéey ci kanam, dem yomb ak seetante.
                • Xale yi : am na xale yor ca, weeyu gaaw bi.

                Xam-xam bu njëkk : Signe bu xaj bi di wax AM NA XEEX.
                Weeyu gaaw bi te jëm.
                """,
                CategoriePanneau.DANGER, Langue.WOLOF),

            txt("Signe yu waajib (Panneaux d'obligation)",
                """
                Signe yu waajib yi dañu am form bu digg-digg ak bleu ci kaw.
                Dañu wax ak oto jaay ne waajibul def loolu.

                Ay misaal yu mag :
                • Dem ci diggu jëfandikoo kanam (kanam) : waajibul dem ci kaw.
                • Yoon bu oto yu suufu : jëfandikoo yoon bi.
                • Gaaw yu topp (vitesse minimale) : waajibul dem X km/h au moins.
                • Yoon bu vélo waajib : vélo jaay yoon bii.

                Xam-xam bu njëkk : Signe bu waajib bi di wax LOOLU DEF.
                """,
                CategoriePanneau.OBLIGATION, Langue.WOLOF),

            txt("Règle priorité yi (Règles de priorité)",
                """
                Priorité bi di xam kan mën dem ci kanam ci carrefour.

                Règle yi bu mag :
                1. PRIORITÉ ÀK KANAM CI NDEY : Ci carrefour bu amul signe,
                   oto bi jëm ci sa kanam ci ndey moo am priorité.

                2. YOON WU TOP (losange jaune) : Yaa am priorité ci oto
                   yi jëm ci yoon yu wàllu.

                3. CÉDEZ LE PASSAGE (triang bu yéef) : Waajibul laale oto
                   yi jëm ci yoon wu mag wi.

                4. STOP (round bu xonq) : Taxaw WAAJIBUL. Boo gis yoon
                   mu sell, waajibul taxaw reewum jëf oto bi.

                5. KU DEM AK KANAM (Piéton) : Piéton yi dañu am priorité
                   ci jëfandikoo passage protégé bi.

                Xam-xam : Boo am fete, weeyu gaaw bi te laale.
                """,
                CategoriePanneau.PRIORITE, Langue.WOLOF)
        ));

        log.info("Cours panneaux de signalisation insérés avec succès ({} cours)", coursRepository.count());
    }

    private Cours img(String titre, String description, CategoriePanneau cat, Langue langue, String imageUrl) {
        return Cours.builder()
                .titre(titre).description(description)
                .typeContenu(TypeContenu.IMAGE).langue(langue)
                .categorie(cat).imageUrl(imageUrl).build();
    }

    private Cours txt(String titre, String contenu, CategoriePanneau cat, Langue langue) {
        return Cours.builder()
                .titre(titre)
                .typeContenu(TypeContenu.ECRITE).langue(langue)
                .categorie(cat).contenu(contenu.trim()).build();
    }
}
