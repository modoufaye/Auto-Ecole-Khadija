export function fmtDate(s) {
  if (!s) return '-'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

export function fmtMontant(n) {
  if (n == null) return '-'
  return new Intl.NumberFormat('fr-SN').format(n) + ' FCFA'
}

export function fmtTime(t) {
  return t ? t.substring(0, 5) : ''
}

export const BADGES = {
  statut_eleve:    { EN_COURS: 'primary', DIPLOME: 'success', SUSPENDU: 'warning text-dark', ABANDONNE: 'danger' },
  statut_vehicule: { DISPONIBLE: 'success', EN_COURS: 'primary', EN_MAINTENANCE: 'warning text-dark', HORS_SERVICE: 'danger' },
  statut_lecon:    { PLANIFIEE: 'info text-dark', EN_COURS: 'primary', TERMINEE: 'success', ANNULEE: 'secondary' },
  resultat:        { ADMIS: 'success', REFUSE: 'danger', EN_ATTENTE: 'warning text-dark' },
  type_lecon:      { CODE: 'secondary', CONDUITE: 'primary' },
  statut_paiement: { PAYE: 'success', EN_ATTENTE: 'warning text-dark', ANNULE: 'secondary' },
  type_paiement:   { INSCRIPTION: 'info text-dark', LECON: 'primary', EXAMEN: 'secondary', AUTRE: 'secondary' },
}

export const LABELS = {
  EN_COURS: 'En cours', DIPLOME: 'Diplômé', SUSPENDU: 'Suspendu', ABANDONNE: 'Abandonné',
  DISPONIBLE: 'Disponible', EN_MAINTENANCE: 'En maintenance', HORS_SERVICE: 'Hors service',
  PLANIFIEE: 'Planifiée', TERMINEE: 'Terminée', ANNULEE: 'Annulée',
  ADMIS: 'Admis', REFUSE: 'Refusé', EN_ATTENTE: 'En attente',
  CODE: 'Code', CONDUITE: 'Conduite',
  PAYE: 'Payé', ANNULE: 'Annulé',
  INSCRIPTION: 'Inscription', LECON: 'Leçon', EXAMEN: 'Examen', AUTRE: 'Autre',
}

