package sn.autoecole.entity;

import jakarta.persistence.*;
import lombok.*;
import sn.autoecole.enums.TypeBloc;

@Entity
@Table(name = "blocs_contenu")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BlocContenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seance_id", nullable = false)
    private Seance seance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBloc typeBloc;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    private String mediaUrl;

    private Integer ordre;
}
