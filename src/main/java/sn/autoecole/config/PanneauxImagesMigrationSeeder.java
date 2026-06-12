package sn.autoecole.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(4)
@RequiredArgsConstructor
@Slf4j
public class PanneauxImagesMigrationSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    @Override
    public void run(String... args) {
        int total = 0;
        total += upd("/panneaux/stop.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/French_road_sign_B6.svg/200px-French_road_sign_B6.svg.png");
        total += upd("/panneaux/sens_interdit.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/France_road_sign_B1.svg/250px-France_road_sign_B1.svg.png");
        total += upd("/panneaux/cedez_passage.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/France_road_sign_AB3a.svg/250px-France_road_sign_AB3a.svg.png");
        total += upd("/panneaux/vitesse_50.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/France_road_sign_B14_%2850%29.svg/250px-France_road_sign_B14_%2850%29.svg.png");
        total += upd("/panneaux/virage_droit.svg",
            "https://codedelaroute.io/blog/content/images/2020/08/panneau-de-danger-virage-a--droite-copie.png");
        total += upd("/panneaux/passage_pieton.svg",
            "https://codedelaroute.io/blog/content/images/2022/03/passage-pieton.jpg");
        total += upd("/panneaux/priorite.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/France_road_sign_AB7.svg/250px-France_road_sign_AB7.svg.png");
        total += upd("/panneaux/stationnement_interdit.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/French_traffic_sign_IV-05_Stationnement_interdit.svg/250px-French_traffic_sign_IV-05_Stationnement_interdit.svg.png");
        total += upd("/panneaux/tout_droit.svg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/France_road_sign_C13a.svg/250px-France_road_sign_C13a.svg.png");
        total += upd("/panneaux/dos_ane.svg",
            "https://codedelaroute.io/blog/content/images/2020/08/Panneau-de-danger-cassis-dos-d-a-ne.png");

        // Rapport
        int remaining = jdbc.queryForObject(
            "SELECT COUNT(*) FROM cours WHERE image_url LIKE '/panneaux/%'", Integer.class);
        log.info("Migration images panneaux : {} mis à jour, {} restants avec chemin local", total, remaining);
    }

    private int upd(String oldUrl, String newUrl) {
        return jdbc.update("UPDATE cours SET image_url = ? WHERE image_url = ?", newUrl, oldUrl);
    }
}
