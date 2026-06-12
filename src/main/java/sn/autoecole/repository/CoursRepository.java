package sn.autoecole.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.autoecole.entity.Cours;
import sn.autoecole.enums.CategoriePanneau;
import sn.autoecole.enums.Langue;
import sn.autoecole.enums.TypeContenu;

import java.util.List;

public interface CoursRepository extends JpaRepository<Cours, Long> {
    List<Cours> findByLangue(Langue langue);
    List<Cours> findByTypeContenu(TypeContenu typeContenu);
    List<Cours> findByCategorie(CategoriePanneau categorie);
    List<Cours> findByLangueAndTypeContenu(Langue langue, TypeContenu typeContenu);
    boolean existsByTitreAndCategorie(String titre, CategoriePanneau categorie);
}
