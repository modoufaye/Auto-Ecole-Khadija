package sn.autoecole.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.autoecole.entity.Vehicule;
import sn.autoecole.enums.CategoriePermis;
import sn.autoecole.enums.StatutVehicule;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {

    Optional<Vehicule> findByImmatriculation(String immatriculation);

    List<Vehicule> findByStatut(StatutVehicule statut);

    List<Vehicule> findByCategorie(CategoriePermis categorie);

    List<Vehicule> findByStatutAndCategorie(StatutVehicule statut, CategoriePermis categorie);
}
