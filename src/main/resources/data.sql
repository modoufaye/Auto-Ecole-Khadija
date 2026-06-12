-- Données de départ : Moniteurs
INSERT INTO moniteurs (nom, prenom, telephone, email, numero_cni, numero_permis, date_embauche, actif)
SELECT 'Diallo', 'Mamadou', '771234567', 'mamadou.diallo@autoecole.sn', '1234567890123', 'SN-B-001', '2020-01-15', true
WHERE NOT EXISTS (SELECT 1 FROM moniteurs WHERE telephone = '771234567');

INSERT INTO moniteurs (nom, prenom, telephone, email, numero_cni, numero_permis, date_embauche, actif)
SELECT 'Ndiaye', 'Fatou', '772345678', 'fatou.ndiaye@autoecole.sn', '9876543210987', 'SN-B-002', '2021-03-10', true
WHERE NOT EXISTS (SELECT 1 FROM moniteurs WHERE telephone = '772345678');

INSERT INTO moniteurs (nom, prenom, telephone, email, numero_cni, numero_permis, date_embauche, actif)
SELECT 'Mbaye', 'Ibrahima', '773456789', 'ibrahima.mbaye@autoecole.sn', '1122334455667', 'SN-C-001', '2019-06-01', true
WHERE NOT EXISTS (SELECT 1 FROM moniteurs WHERE telephone = '773456789');

-- Catégories des moniteurs
INSERT INTO moniteur_categories (moniteur_id, categorie)
SELECT m.id, 'B' FROM moniteurs m WHERE m.telephone = '771234567'
AND NOT EXISTS (SELECT 1 FROM moniteur_categories mc WHERE mc.moniteur_id = m.id AND mc.categorie = 'B');

INSERT INTO moniteur_categories (moniteur_id, categorie)
SELECT m.id, 'A' FROM moniteurs m WHERE m.telephone = '771234567'
AND NOT EXISTS (SELECT 1 FROM moniteur_categories mc WHERE mc.moniteur_id = m.id AND mc.categorie = 'A');

INSERT INTO moniteur_categories (moniteur_id, categorie)
SELECT m.id, 'B' FROM moniteurs m WHERE m.telephone = '772345678'
AND NOT EXISTS (SELECT 1 FROM moniteur_categories mc WHERE mc.moniteur_id = m.id AND mc.categorie = 'B');

INSERT INTO moniteur_categories (moniteur_id, categorie)
SELECT m.id, 'C' FROM moniteurs m WHERE m.telephone = '773456789'
AND NOT EXISTS (SELECT 1 FROM moniteur_categories mc WHERE mc.moniteur_id = m.id AND mc.categorie = 'C');

INSERT INTO moniteur_categories (moniteur_id, categorie)
SELECT m.id, 'B' FROM moniteurs m WHERE m.telephone = '773456789'
AND NOT EXISTS (SELECT 1 FROM moniteur_categories mc WHERE mc.moniteur_id = m.id AND mc.categorie = 'B');

-- Données de départ : Véhicules
INSERT INTO vehicules (immatriculation, marque, modele, annee, categorie, kilometrage, statut)
SELECT 'DK-2341-AB', 'Toyota', 'Corolla', 2020, 'B', 45000, 'DISPONIBLE'
WHERE NOT EXISTS (SELECT 1 FROM vehicules WHERE immatriculation = 'DK-2341-AB');

INSERT INTO vehicules (immatriculation, marque, modele, annee, categorie, kilometrage, statut)
SELECT 'DK-1872-CD', 'Renault', 'Clio', 2019, 'B', 67000, 'DISPONIBLE'
WHERE NOT EXISTS (SELECT 1 FROM vehicules WHERE immatriculation = 'DK-1872-CD');

INSERT INTO vehicules (immatriculation, marque, modele, annee, categorie, kilometrage, statut)
SELECT 'DK-5521-EF', 'Honda', 'CB125', 2021, 'A1', 12000, 'DISPONIBLE'
WHERE NOT EXISTS (SELECT 1 FROM vehicules WHERE immatriculation = 'DK-5521-EF');

INSERT INTO vehicules (immatriculation, marque, modele, annee, categorie, kilometrage, statut)
SELECT 'DK-3309-GH', 'Mercedes', 'Actros', 2018, 'C', 120000, 'DISPONIBLE'
WHERE NOT EXISTS (SELECT 1 FROM vehicules WHERE immatriculation = 'DK-3309-GH');

-- Données de départ : Élèves
INSERT INTO eleves (nom, prenom, date_naissance, telephone, adresse, email, numero_cni, categorie_permis, date_inscription, statut, nombre_lecons_code, nombre_lecons_conduite)
SELECT 'Sarr', 'Aminata', '1998-05-12', '775678901', 'Dakar, Plateau', 'aminata.sarr@gmail.com', '2233445566778', 'B', '2026-01-10', 'EN_COURS', 5, 3
WHERE NOT EXISTS (SELECT 1 FROM eleves WHERE telephone = '775678901');

INSERT INTO eleves (nom, prenom, date_naissance, telephone, adresse, email, numero_cni, categorie_permis, date_inscription, statut, nombre_lecons_code, nombre_lecons_conduite)
SELECT 'Fall', 'Oumar', '1995-11-25', '776789012', 'Thiès, Centre', 'oumar.fall@gmail.com', '3344556677889', 'B', '2026-02-14', 'EN_COURS', 8, 6
WHERE NOT EXISTS (SELECT 1 FROM eleves WHERE telephone = '776789012');

INSERT INTO eleves (nom, prenom, date_naissance, telephone, adresse, email, numero_cni, categorie_permis, date_inscription, statut, nombre_lecons_code, nombre_lecons_conduite)
SELECT 'Gueye', 'Sokhna', '2000-03-08', '777890123', 'Dakar, Parcelles Assainies', 'sokhna.gueye@gmail.com', '4455667788990', 'A1', '2026-03-01', 'EN_COURS', 3, 2
WHERE NOT EXISTS (SELECT 1 FROM eleves WHERE telephone = '777890123');

INSERT INTO eleves (nom, prenom, date_naissance, telephone, adresse, email, numero_cni, categorie_permis, date_inscription, statut, nombre_lecons_code, nombre_lecons_conduite)
SELECT 'Ba', 'Moussa', '1992-07-19', '778901234', 'Saint-Louis', 'moussa.ba@gmail.com', '5566778899001', 'C', '2025-10-05', 'DIPLOME', 15, 20
WHERE NOT EXISTS (SELECT 1 FROM eleves WHERE telephone = '778901234');
