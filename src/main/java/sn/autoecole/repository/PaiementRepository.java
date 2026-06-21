package sn.autoecole.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.autoecole.entity.Paiement;
import sn.autoecole.enums.StatutPaiement;
import sn.autoecole.enums.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findByEleveId(Long eleveId);

    Optional<Paiement> findByReference(String reference);

    List<Paiement> findByStatut(StatutPaiement statut);

    List<Paiement> findByTypePaiement(TypePaiement type);

    List<Paiement> findByDateBetween(LocalDate debut, LocalDate fin);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.statut = :statut")
    BigDecimal sumMontantPaye(@Param("statut") StatutPaiement statut);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.eleve.id = :eleveId AND p.statut = :statut")
    BigDecimal sumMontantPayeByEleve(@Param("eleveId") Long eleveId, @Param("statut") StatutPaiement statut);
}
