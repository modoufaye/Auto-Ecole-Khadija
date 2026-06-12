package sn.autoecole.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.autoecole.entity.Moniteur;

import java.util.List;

@Repository
public interface MoniteurRepository extends JpaRepository<Moniteur, Long> {

    List<Moniteur> findByActifTrue();

    List<Moniteur> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    java.util.Optional<Moniteur> findByEmailIgnoreCase(String email);
}
