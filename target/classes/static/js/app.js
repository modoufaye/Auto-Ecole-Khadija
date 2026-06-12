'use strict';

/* ============================================================
   API Utility
   ============================================================ */
async function api(method, url, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch('/api' + url, opts);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.erreurs ? JSON.stringify(data.erreurs) : 'Erreur serveur');
  return data;
}

/* ============================================================
   Toast Notifications
   ============================================================ */
function toast(msg, type = 'success') {
  const icons = { success: 'check-circle-fill', danger: 'x-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' };
  const id = 'toast-' + Date.now();
  document.getElementById('toastContainer').insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast text-bg-${type} border-0 align-items-center" role="alert">
      <div class="d-flex">
        <div class="toast-body"><i class="bi bi-${icons[type] || 'info-circle-fill'} me-2"></i>${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);
  const el = document.getElementById(id);
  const t = new bootstrap.Toast(el, { delay: 3500 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

/* ============================================================
   Navigation
   ============================================================ */
const SECTION_TITLES = {
  dashboard: 'Tableau de bord', eleves: 'Gestion des Élèves',
  moniteurs: 'Gestion des Moniteurs', vehicules: 'Gestion des Véhicules',
  lecons: 'Gestion des Leçons', examens: 'Gestion des Examens', paiements: 'Gestion des Paiements'
};

const LOADERS = {
  dashboard: () => Dashboard.load(), eleves: () => Eleves.load(),
  moniteurs: () => Moniteurs.load(), vehicules: () => Vehicules.load(),
  lecons: () => Lecons.load(), examens: () => Examens.load(), paiements: () => Paiements.load()
};

const App = {
  show(name) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('d-none'));
    document.querySelectorAll('.sidebar-menu .nav-link').forEach(a => a.classList.remove('active'));
    document.getElementById('section-' + name).classList.remove('d-none');
    document.querySelector(`.nav-link[data-section="${name}"]`)?.classList.add('active');
    document.getElementById('pageTitle').textContent = SECTION_TITLES[name] || name;
    LOADERS[name]?.();
  },
  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
  }
};

/* ============================================================
   Formatting Helpers
   ============================================================ */
function fmtDate(s) {
  if (!s) return '-';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

function fmtMontant(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('fr-SN').format(n) + ' FCFA';
}

function fmtTime(t) {
  return t ? t.substring(0, 5) : '';
}

const BADGES = {
  statut_eleve:    { EN_COURS: 'primary', DIPLOME: 'success', SUSPENDU: 'warning text-dark', ABANDONNE: 'danger' },
  statut_vehicule: { DISPONIBLE: 'success', EN_COURS: 'primary', EN_MAINTENANCE: 'warning text-dark', HORS_SERVICE: 'danger' },
  statut_lecon:    { PLANIFIEE: 'info text-dark', EN_COURS: 'primary', TERMINEE: 'success', ANNULEE: 'secondary' },
  resultat:        { ADMIS: 'success', REFUSE: 'danger', EN_ATTENTE: 'warning text-dark' },
  type_lecon:      { CODE: 'secondary', CONDUITE: 'primary' },
  statut_paiement: { PAYE: 'success', EN_ATTENTE: 'warning text-dark', ANNULE: 'secondary' },
  type_paiement:   { INSCRIPTION: 'info text-dark', LECON: 'primary', EXAMEN: 'purple', AUTRE: 'secondary' }
};

const LABELS = {
  EN_COURS: 'En cours', DIPLOME: 'Diplômé', SUSPENDU: 'Suspendu', ABANDONNE: 'Abandonné',
  DISPONIBLE: 'Disponible', EN_MAINTENANCE: 'En maintenance', HORS_SERVICE: 'Hors service',
  PLANIFIEE: 'Planifiée', TERMINEE: 'Terminée', ANNULEE: 'Annulée',
  ADMIS: 'Admis', REFUSE: 'Refusé', EN_ATTENTE: 'En attente',
  CODE: 'Code', CONDUITE: 'Conduite',
  PAYE: 'Payé', ANNULE: 'Annulé',
  INSCRIPTION: 'Inscription', LECON: 'Leçon', EXAMEN: 'Examen', AUTRE: 'Autre'
};

function badge(key, map) {
  const color = map[key] || 'secondary';
  return `<span class="badge bg-${color}">${LABELS[key] || key}</span>`;
}

function emptyRow(cols, msg = 'Aucun enregistrement') {
  return `<tr><td colspan="${cols}" class="text-center py-5 text-muted"><i class="bi bi-inbox fs-3 d-block mb-2"></i>${msg}</td></tr>`;
}

function loadingRow(cols) {
  return `<tr><td colspan="${cols}" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div></td></tr>`;
}

/* ============================================================
   Dashboard
   ============================================================ */
const Dashboard = {
  async load() {
    try {
      const s = await api('GET', '/dashboard/stats');
      document.getElementById('dashboardStats').innerHTML = `
        <div class="col-12"><div class="section-label">Élèves</div></div>
        ${sc('Total élèves', s.totalEleves, 'people-fill', 'primary')}
        ${sc('En formation', s.elevesEnCours, 'person-check-fill', 'info')}
        ${sc('Diplômés', s.elevesDiplomes, 'award-fill', 'success')}
        ${sc('Suspendus', s.elevesSuspendus, 'person-x-fill', 'warning')}
        <div class="col-12"><div class="section-label">Personnel & Flotte</div></div>
        ${sc('Moniteurs actifs', s.moniteursActifs + ' / ' + s.totalMoniteurs, 'person-badge-fill', 'primary')}
        ${sc('Véhicules dispos', s.vehiculesDisponibles + ' / ' + s.totalVehicules, 'car-front-fill', 'success')}
        ${sc('En maintenance', s.vehiculesEnMaintenance, 'tools', 'warning')}
        <div class="col-12"><div class="section-label">Formation</div></div>
        ${sc('Total leçons', s.totalLecons, 'journal-text', 'primary')}
        ${sc('Leçons terminées', s.leconsTerminees, 'check-circle-fill', 'success')}
        ${sc('Total examens', s.totalExamens, 'clipboard2-check-fill', 'primary')}
        ${sc('Admis', s.examensAdmis, 'emoji-smile-fill', 'success')}
        ${sc('Refusés', s.examensRefuses, 'emoji-frown-fill', 'danger')}
        <div class="col-12"><div class="section-label">Finance</div></div>
        ${sc('Total encaissé', fmtMontant(s.totalEncaisse), 'cash-coin', 'success', true)}
        ${sc('Paiements enregistrés', s.totalPaiements, 'receipt', 'primary')}`;
    } catch (e) {
      toast('Erreur chargement tableau de bord', 'danger');
    }
  }
};

function sc(title, value, icon, color, wide = false) {
  return `<div class="${wide ? 'col-md-4' : 'col-xl-3 col-md-4'} col-sm-6">
    <div class="card stat-card shadow-sm h-100">
      <div class="card-body d-flex align-items-center gap-3 p-3">
        <div class="stat-icon bg-${color} bg-opacity-10 text-${color}"><i class="bi bi-${icon}"></i></div>
        <div><div class="stat-value">${value}</div><div class="stat-label">${title}</div></div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   Élèves
   ============================================================ */
const Eleves = {
  list: [],

  async load() {
    document.getElementById('elevesTbody').innerHTML = loadingRow(8);
    try {
      this.list = await api('GET', '/eleves');
      this.render(this.list);
    } catch (e) { toast('Erreur chargement élèves', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('elevesTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucun élève enregistré'); return; }
    tb.innerHTML = items.map((e, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>
          <div class="fw-semibold">${e.nom} ${e.prenom}</div>
          ${e.email ? `<div class="text-muted" style="font-size:.78rem">${e.email}</div>` : ''}
        </td>
        <td>${e.telephone}</td>
        <td><span class="badge bg-secondary">${e.categoriePermis}</span></td>
        <td><span class="text-muted" style="font-size:.8rem"><i class="bi bi-book me-1"></i>${e.nombreLeconsCode} <i class="bi bi-steering2 ms-2 me-1"></i>${e.nombreLeconsConduite}</span></td>
        <td>${badge(e.statut, BADGES.statut_eleve)}</td>
        <td class="text-muted">${fmtDate(e.dateInscription)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="Eleves.openModal(${e.id})" title="Modifier"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="Eleves.delete(${e.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  },

  search(term) {
    if (!term.trim()) { this.render(this.list); return; }
    const t = term.toLowerCase();
    this.render(this.list.filter(e => `${e.nom} ${e.prenom} ${e.telephone}`.toLowerCase().includes(t)));
  },

  filterStatut(val) {
    this.render(val ? this.list.filter(e => e.statut === val) : this.list);
  },

  async openModal(id = null) {
    document.getElementById('eleveModalTitle').textContent = id ? 'Modifier l\'élève' : 'Nouvel élève';
    document.getElementById('eleveId').value = '';
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    document.getElementById('eleveDateNaissance').value = '';
    document.getElementById('eleveTelephone').value = '';
    document.getElementById('eleveAdresse').value = '';
    document.getElementById('eleveEmail').value = '';
    document.getElementById('eleveNumeroCni').value = '';
    document.getElementById('eleveCategoriePermis').value = '';
    document.getElementById('eleveStatutGroup').style.display = id ? '' : 'none';

    if (id) {
      const e = this.list.find(x => x.id === id) || await api('GET', `/eleves/${id}`);
      document.getElementById('eleveId').value = e.id;
      document.getElementById('eleveNom').value = e.nom;
      document.getElementById('elevePrenom').value = e.prenom;
      document.getElementById('eleveDateNaissance').value = e.dateNaissance;
      document.getElementById('eleveTelephone').value = e.telephone;
      document.getElementById('eleveAdresse').value = e.adresse || '';
      document.getElementById('eleveEmail').value = e.email || '';
      document.getElementById('eleveNumeroCni').value = e.numeroCni || '';
      document.getElementById('eleveCategoriePermis').value = e.categoriePermis;
      document.getElementById('eleveStatut').value = e.statut;
    }
    new bootstrap.Modal(document.getElementById('eleveModal')).show();
  },

  async save() {
    const id = document.getElementById('eleveId').value;
    const nom = document.getElementById('eleveNom').value.trim();
    const prenom = document.getElementById('elevePrenom').value.trim();
    const tel = document.getElementById('eleveTelephone').value.trim();
    const cat = document.getElementById('eleveCategoriePermis').value;
    const dn = document.getElementById('eleveDateNaissance').value;
    if (!nom || !prenom || !tel || !cat || !dn) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }

    const data = {
      nom, prenom, dateNaissance: dn, telephone: tel,
      adresse: document.getElementById('eleveAdresse').value || null,
      email: document.getElementById('eleveEmail').value || null,
      numeroCni: document.getElementById('eleveNumeroCni').value || null,
      categoriePermis: cat,
      statut: id ? document.getElementById('eleveStatut').value : 'EN_COURS'
    };
    try {
      if (id) { await api('PUT', `/eleves/${id}`, data); toast('Élève modifié'); }
      else { await api('POST', '/eleves', data); toast('Élève créé'); }
      bootstrap.Modal.getInstance(document.getElementById('eleveModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer cet élève définitivement ?')) return;
    try {
      await api('DELETE', `/eleves/${id}`);
      toast('Élève supprimé');
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Moniteurs
   ============================================================ */
const Moniteurs = {
  list: [],

  async load() {
    document.getElementById('moniteursTbody').innerHTML = loadingRow(8);
    try {
      this.list = await api('GET', '/moniteurs');
      this.render(this.list);
    } catch (e) { toast('Erreur chargement moniteurs', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('moniteursTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucun moniteur enregistré'); return; }
    tb.innerHTML = items.map((m, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>
          <div class="fw-semibold">${m.nom} ${m.prenom}</div>
          ${m.email ? `<div class="text-muted" style="font-size:.78rem">${m.email}</div>` : ''}
        </td>
        <td>${m.telephone}</td>
        <td>${(m.categoriesAutorisees || []).map(c => `<span class="badge bg-secondary me-1">${c}</span>`).join('') || '<span class="text-muted">—</span>'}</td>
        <td class="text-muted">${m.numeroPermis || '—'}</td>
        <td>${m.actif ? '<span class="badge bg-success">Actif</span>' : '<span class="badge bg-secondary">Inactif</span>'}</td>
        <td class="text-muted">${fmtDate(m.dateEmbauche)}</td>
        <td class="text-end">
          <button class="btn btn-sm ${m.actif ? 'btn-outline-warning' : 'btn-outline-success'} me-1" onclick="Moniteurs.toggleActif(${m.id})" title="${m.actif ? 'Désactiver' : 'Activer'}"><i class="bi bi-${m.actif ? 'pause-circle' : 'play-circle'}-fill"></i></button>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="Moniteurs.openModal(${m.id})" title="Modifier"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="Moniteurs.delete(${m.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  },

  search(term) {
    if (!term.trim()) { this.render(this.list); return; }
    const t = term.toLowerCase();
    this.render(this.list.filter(m => `${m.nom} ${m.prenom}`.toLowerCase().includes(t)));
  },

  async openModal(id = null) {
    document.getElementById('moniteurModalTitle').textContent = id ? 'Modifier le moniteur' : 'Nouveau moniteur';
    document.getElementById('moniteurId').value = '';
    document.getElementById('moniteurNom').value = '';
    document.getElementById('moniteurPrenom').value = '';
    document.getElementById('moniteurTelephone').value = '';
    document.getElementById('moniteurEmail').value = '';
    document.getElementById('moniteurNumeroCni').value = '';
    document.getElementById('moniteurNumeroPermis').value = '';
    document.getElementById('moniteurDateEmbauche').value = '';
    document.getElementById('moniteurActif').checked = true;
    document.querySelectorAll('.cat-check').forEach(c => c.checked = false);

    if (id) {
      const m = this.list.find(x => x.id === id) || await api('GET', `/moniteurs/${id}`);
      document.getElementById('moniteurId').value = m.id;
      document.getElementById('moniteurNom').value = m.nom;
      document.getElementById('moniteurPrenom').value = m.prenom;
      document.getElementById('moniteurTelephone').value = m.telephone;
      document.getElementById('moniteurEmail').value = m.email || '';
      document.getElementById('moniteurNumeroCni').value = m.numeroCni || '';
      document.getElementById('moniteurNumeroPermis').value = m.numeroPermis || '';
      document.getElementById('moniteurDateEmbauche').value = m.dateEmbauche || '';
      document.getElementById('moniteurActif').checked = m.actif;
      (m.categoriesAutorisees || []).forEach(c => {
        const el = document.getElementById('cat' + c);
        if (el) el.checked = true;
      });
    }
    new bootstrap.Modal(document.getElementById('moniteurModal')).show();
  },

  async save() {
    const id = document.getElementById('moniteurId').value;
    const nom = document.getElementById('moniteurNom').value.trim();
    const prenom = document.getElementById('moniteurPrenom').value.trim();
    const tel = document.getElementById('moniteurTelephone').value.trim();
    if (!nom || !prenom || !tel) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }

    const cats = [...document.querySelectorAll('.cat-check:checked')].map(c => c.value);
    const data = {
      nom, prenom, telephone: tel,
      email: document.getElementById('moniteurEmail').value || null,
      numeroCni: document.getElementById('moniteurNumeroCni').value || null,
      numeroPermis: document.getElementById('moniteurNumeroPermis').value || null,
      dateEmbauche: document.getElementById('moniteurDateEmbauche').value || null,
      categoriesAutorisees: cats,
      actif: document.getElementById('moniteurActif').checked
    };
    try {
      if (id) { await api('PUT', `/moniteurs/${id}`, data); toast('Moniteur modifié'); }
      else { await api('POST', '/moniteurs', data); toast('Moniteur créé'); }
      bootstrap.Modal.getInstance(document.getElementById('moniteurModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async toggleActif(id) {
    try {
      await api('PATCH', `/moniteurs/${id}/toggle-actif`);
      toast('Statut mis à jour');
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer ce moniteur ?')) return;
    try {
      await api('DELETE', `/moniteurs/${id}`);
      toast('Moniteur supprimé');
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Véhicules
   ============================================================ */
const Vehicules = {
  list: [],

  async load() {
    document.getElementById('vehiculesTbody').innerHTML = loadingRow(8);
    try {
      this.list = await api('GET', '/vehicules');
      this.render(this.list);
    } catch (e) { toast('Erreur chargement véhicules', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('vehiculesTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucun véhicule enregistré'); return; }
    tb.innerHTML = items.map((v, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td><span class="fw-semibold font-monospace">${v.immatriculation}</span></td>
        <td><div class="fw-semibold">${v.marque}</div><div class="text-muted" style="font-size:.78rem">${v.modele}</div></td>
        <td>${v.annee}</td>
        <td><span class="badge bg-secondary">${v.categorie}</span></td>
        <td>${v.kilometrage.toLocaleString('fr-SN')} km</td>
        <td>${badge(v.statut, BADGES.statut_vehicule)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="Vehicules.openModal(${v.id})" title="Modifier"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="Vehicules.delete(${v.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  },

  filterStatut(val) {
    this.render(val ? this.list.filter(v => v.statut === val) : this.list);
  },

  filterCategorie(val) {
    this.render(val ? this.list.filter(v => v.categorie === val) : this.list);
  },

  async openModal(id = null) {
    document.getElementById('vehiculeModalTitle').textContent = id ? 'Modifier le véhicule' : 'Nouveau véhicule';
    document.getElementById('vehiculeId').value = '';
    document.getElementById('vehiculeImmat').value = '';
    document.getElementById('vehiculeMarque').value = '';
    document.getElementById('vehiculeModele').value = '';
    document.getElementById('vehiculeAnnee').value = new Date().getFullYear();
    document.getElementById('vehiculeCategorie').value = '';
    document.getElementById('vehiculeKm').value = 0;
    document.getElementById('vehiculeStatut').value = 'DISPONIBLE';
    document.getElementById('vehiculeObs').value = '';

    if (id) {
      const v = this.list.find(x => x.id === id) || await api('GET', `/vehicules/${id}`);
      document.getElementById('vehiculeId').value = v.id;
      document.getElementById('vehiculeImmat').value = v.immatriculation;
      document.getElementById('vehiculeMarque').value = v.marque;
      document.getElementById('vehiculeModele').value = v.modele;
      document.getElementById('vehiculeAnnee').value = v.annee;
      document.getElementById('vehiculeCategorie').value = v.categorie;
      document.getElementById('vehiculeKm').value = v.kilometrage;
      document.getElementById('vehiculeStatut').value = v.statut;
      document.getElementById('vehiculeObs').value = v.observations || '';
    }
    new bootstrap.Modal(document.getElementById('vehiculeModal')).show();
  },

  async save() {
    const id = document.getElementById('vehiculeId').value;
    const immat = document.getElementById('vehiculeImmat').value.trim();
    const marque = document.getElementById('vehiculeMarque').value.trim();
    const modele = document.getElementById('vehiculeModele').value.trim();
    const annee = parseInt(document.getElementById('vehiculeAnnee').value);
    const cat = document.getElementById('vehiculeCategorie').value;
    if (!immat || !marque || !modele || !annee || !cat) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }

    const data = {
      immatriculation: immat, marque, modele, annee, categorie: cat,
      kilometrage: parseInt(document.getElementById('vehiculeKm').value) || 0,
      statut: document.getElementById('vehiculeStatut').value,
      observations: document.getElementById('vehiculeObs').value || null
    };
    try {
      if (id) { await api('PUT', `/vehicules/${id}`, data); toast('Véhicule modifié'); }
      else { await api('POST', '/vehicules', data); toast('Véhicule créé'); }
      bootstrap.Modal.getInstance(document.getElementById('vehiculeModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer ce véhicule ?')) return;
    try {
      await api('DELETE', `/vehicules/${id}`);
      toast('Véhicule supprimé');
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Leçons
   ============================================================ */
const Lecons = {
  list: [],

  async load() {
    document.getElementById('leconsTbody').innerHTML = loadingRow(8);
    try {
      this.list = await api('GET', '/lecons');
      this.render(this.list);
    } catch (e) { toast('Erreur chargement leçons', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('leconsTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucune leçon planifiée'); return; }
    tb.innerHTML = items.map((l, i) => {
      const editable = l.statut === 'PLANIFIEE';
      const terminable = l.statut === 'PLANIFIEE' || l.statut === 'EN_COURS';
      return `<tr>
        <td class="text-muted">${i + 1}</td>
        <td>
          <div class="fw-semibold">${fmtDate(l.date)}</div>
          <div class="text-muted" style="font-size:.78rem">${fmtTime(l.heureDebut)} – ${fmtTime(l.heureFin)}</div>
        </td>
        <td>${l.eleve ? `${l.eleve.nom} ${l.eleve.prenom}` : '—'}</td>
        <td>${l.moniteur ? `${l.moniteur.nom} ${l.moniteur.prenom}` : '—'}</td>
        <td>${l.vehicule ? `<span class="font-monospace" style="font-size:.78rem">${l.vehicule.immatriculation}</span>` : '<span class="text-muted">—</span>'}</td>
        <td>${badge(l.type, BADGES.type_lecon)}</td>
        <td>${badge(l.statut, BADGES.statut_lecon)}</td>
        <td class="text-end d-flex justify-content-end gap-1 flex-wrap">
          ${terminable ? `<button class="btn btn-sm btn-success btn-action" onclick="Lecons.terminer(${l.id})" title="Terminer"><i class="bi bi-check-lg"></i></button>` : ''}
          ${editable ? `<button class="btn btn-sm btn-warning btn-action" onclick="Lecons.annuler(${l.id})" title="Annuler"><i class="bi bi-x-lg"></i></button>` : ''}
          ${editable ? `<button class="btn btn-sm btn-outline-primary btn-action" onclick="Lecons.openModal(${l.id})" title="Modifier"><i class="bi bi-pencil-fill"></i></button>` : ''}
          <button class="btn btn-sm btn-outline-danger btn-action" onclick="Lecons.delete(${l.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`;
    }).join('');
  },

  toggleVehicule(type) {
    const vg = document.getElementById('leconVehiculeGroup');
    const req = document.querySelector('.lecon-veh-req');
    if (type === 'CONDUITE') {
      vg.style.opacity = '1';
      if (req) req.style.display = '';
    } else {
      vg.style.opacity = '0.5';
      if (req) req.style.display = 'none';
    }
  },

  async openModal(id = null) {
    document.getElementById('leconModalTitle').textContent = id ? 'Modifier la leçon' : 'Planifier une leçon';
    document.getElementById('leconId').value = '';
    document.getElementById('leconDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('leconHeureDebut').value = '08:00';
    document.getElementById('leconHeureFin').value = '10:00';
    document.getElementById('leconType').value = '';
    document.getElementById('leconObs').value = '';

    const [eleves, moniteurs, vehicules] = await Promise.all([
      api('GET', '/eleves'), api('GET', '/moniteurs/actifs'), api('GET', '/vehicules/disponibles')
    ]);

    document.getElementById('leconEleveId').innerHTML =
      '<option value="">Choisir un élève…</option>' +
      eleves.map(e => `<option value="${e.id}">${e.nom} ${e.prenom} (${e.categoriePermis})</option>`).join('');

    document.getElementById('leconMoniteurId').innerHTML =
      '<option value="">Choisir un moniteur…</option>' +
      moniteurs.map(m => `<option value="${m.id}">${m.nom} ${m.prenom}</option>`).join('');

    document.getElementById('leconVehiculeId').innerHTML =
      '<option value="">Aucun / Non applicable</option>' +
      vehicules.map(v => `<option value="${v.id}">${v.immatriculation} – ${v.marque} ${v.modele} (${v.categorie})</option>`).join('');

    if (id) {
      const l = this.list.find(x => x.id === id) || await api('GET', `/lecons/${id}`);
      document.getElementById('leconId').value = l.id;
      document.getElementById('leconDate').value = l.date;
      document.getElementById('leconHeureDebut').value = l.heureDebut.substring(0, 5);
      document.getElementById('leconHeureFin').value = l.heureFin.substring(0, 5);
      document.getElementById('leconType').value = l.type;
      document.getElementById('leconEleveId').value = l.eleve?.id || '';
      document.getElementById('leconMoniteurId').value = l.moniteur?.id || '';
      document.getElementById('leconVehiculeId').value = l.vehicule?.id || '';
      document.getElementById('leconObs').value = l.observations || '';
      this.toggleVehicule(l.type);
    }
    new bootstrap.Modal(document.getElementById('leconModal')).show();
  },

  async save() {
    const id = document.getElementById('leconId').value;
    const date = document.getElementById('leconDate').value;
    const hd = document.getElementById('leconHeureDebut').value;
    const hf = document.getElementById('leconHeureFin').value;
    const eleveId = document.getElementById('leconEleveId').value;
    const moniteurId = document.getElementById('leconMoniteurId').value;
    const type = document.getElementById('leconType').value;
    const vehiculeId = document.getElementById('leconVehiculeId').value;
    if (!date || !hd || !hf || !eleveId || !moniteurId || !type) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }
    if (type === 'CONDUITE' && !vehiculeId) { toast('Un véhicule est obligatoire pour une leçon de conduite', 'warning'); return; }

    const data = {
      date, heureDebut: hd, heureFin: hf,
      eleveId: parseInt(eleveId), moniteurId: parseInt(moniteurId),
      vehiculeId: vehiculeId ? parseInt(vehiculeId) : null,
      type, observations: document.getElementById('leconObs').value || null
    };
    try {
      if (id) { await api('PUT', `/lecons/${id}`, data); toast('Leçon modifiée'); }
      else { await api('POST', '/lecons', data); toast('Leçon planifiée'); }
      bootstrap.Modal.getInstance(document.getElementById('leconModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async terminer(id) {
    if (!confirm('Marquer cette leçon comme terminée ?')) return;
    try { await api('PATCH', `/lecons/${id}/terminer`); toast('Leçon terminée ✓'); this.load(); }
    catch (e) { toast(e.message, 'danger'); }
  },

  async annuler(id) {
    if (!confirm('Annuler cette leçon ?')) return;
    try { await api('PATCH', `/lecons/${id}/annuler`); toast('Leçon annulée'); this.load(); }
    catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer cette leçon ?')) return;
    try { await api('DELETE', `/lecons/${id}`); toast('Leçon supprimée'); this.load(); }
    catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Examens
   ============================================================ */
const Examens = {
  list: [],

  async load() {
    document.getElementById('examensTbody').innerHTML = loadingRow(8);
    try {
      this.list = await api('GET', '/examens');
      this.render(this.list);
    } catch (e) { toast('Erreur chargement examens', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('examensTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucun examen enregistré'); return; }
    tb.innerHTML = items.map((e, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>${fmtDate(e.date)}</td>
        <td>${e.eleve ? `${e.eleve.nom} ${e.eleve.prenom}` : '—'}</td>
        <td>${badge(e.type, BADGES.type_lecon)}</td>
        <td>${badge(e.resultat, BADGES.resultat)}</td>
        <td>${e.score != null ? `<strong>${e.score}</strong>/100` : '<span class="text-muted">—</span>'}</td>
        <td><span class="badge bg-light text-dark border">${e.tentative}${e.tentative === 1 ? 'ère' : 'ème'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-success me-1 btn-action" onclick="Examens.openResultat(${e.id})" title="Mettre à jour résultat"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-action" onclick="Examens.delete(${e.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  },

  async openModal() {
    document.getElementById('examenId').value = '';
    document.getElementById('examenDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('examenType').value = '';
    document.getElementById('examenResultat').value = 'EN_ATTENTE';
    document.getElementById('examenScore').value = '';
    document.getElementById('examenObs').value = '';

    const eleves = await api('GET', '/eleves');
    document.getElementById('examenEleveId').innerHTML =
      '<option value="">Choisir un élève…</option>' +
      eleves.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join('');

    new bootstrap.Modal(document.getElementById('examenModal')).show();
  },

  async save() {
    const date = document.getElementById('examenDate').value;
    const eleveId = document.getElementById('examenEleveId').value;
    const type = document.getElementById('examenType').value;
    if (!date || !eleveId || !type) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }

    const data = {
      date, eleveId: parseInt(eleveId), type,
      resultat: document.getElementById('examenResultat').value,
      score: document.getElementById('examenScore').value ? parseInt(document.getElementById('examenScore').value) : null,
      observations: document.getElementById('examenObs').value || null
    };
    try {
      await api('POST', '/examens', data);
      toast('Examen enregistré');
      bootstrap.Modal.getInstance(document.getElementById('examenModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  openResultat(id) {
    const e = this.list.find(x => x.id === id);
    document.getElementById('resultatExamenId').value = id;
    document.getElementById('resultatValue').value = e?.resultat || 'EN_ATTENTE';
    document.getElementById('resultatScore').value = e?.score ?? '';
    document.getElementById('resultatObs').value = e?.observations || '';
    new bootstrap.Modal(document.getElementById('resultatModal')).show();
  },

  async saveResultat() {
    const id = document.getElementById('resultatExamenId').value;
    const body = {
      resultat: document.getElementById('resultatValue').value,
      score: document.getElementById('resultatScore').value ? parseInt(document.getElementById('resultatScore').value) : null,
      observations: document.getElementById('resultatObs').value || null
    };
    try {
      await api('PATCH', `/examens/${id}/resultat`, body);
      toast('Résultat mis à jour');
      bootstrap.Modal.getInstance(document.getElementById('resultatModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer cet examen ?')) return;
    try { await api('DELETE', `/examens/${id}`); toast('Examen supprimé'); this.load(); }
    catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Paiements
   ============================================================ */
const Paiements = {
  list: [],

  async load() {
    document.getElementById('paiementsTbody').innerHTML = loadingRow(8);
    try {
      [this.list] = await Promise.all([api('GET', '/paiements')]);
      this.render(this.list);
      const total = await api('GET', '/paiements/total-encaisse');
      document.getElementById('totalEncaisse').textContent = fmtMontant(total.totalEncaisse);
    } catch (e) { toast('Erreur chargement paiements', 'danger'); }
  },

  render(items) {
    const tb = document.getElementById('paiementsTbody');
    if (!items.length) { tb.innerHTML = emptyRow(8, 'Aucun paiement enregistré'); return; }
    tb.innerHTML = items.map((p, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td><span class="font-monospace text-muted" style="font-size:.78rem">${p.reference}</span></td>
        <td>${fmtDate(p.date)}</td>
        <td>${p.eleve ? `${p.eleve.nom} ${p.eleve.prenom}` : '—'}</td>
        <td><strong class="text-success">${fmtMontant(p.montant)}</strong></td>
        <td>${badge(p.typePaiement, BADGES.type_paiement)}</td>
        <td>${badge(p.statut, BADGES.statut_paiement)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1 btn-action" onclick="Paiements.openModal(${p.id})" title="Modifier"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-action" onclick="Paiements.delete(${p.id})" title="Supprimer"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  },

  async openModal(id = null) {
    document.getElementById('paiementModalTitle').textContent = id ? 'Modifier le paiement' : 'Nouveau paiement';
    document.getElementById('paiementId').value = '';
    document.getElementById('paiementDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('paiementMontant').value = '';
    document.getElementById('paiementType').value = '';
    document.getElementById('paiementStatut').value = 'PAYE';
    document.getElementById('paiementDescription').value = '';

    const eleves = await api('GET', '/eleves');
    document.getElementById('paiementEleveId').innerHTML =
      '<option value="">Choisir un élève…</option>' +
      eleves.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join('');

    if (id) {
      const p = this.list.find(x => x.id === id) || await api('GET', `/paiements/${id}`);
      document.getElementById('paiementId').value = p.id;
      document.getElementById('paiementDate').value = p.date;
      document.getElementById('paiementMontant').value = p.montant;
      document.getElementById('paiementEleveId').value = p.eleve?.id || '';
      document.getElementById('paiementType').value = p.typePaiement;
      document.getElementById('paiementStatut').value = p.statut;
      document.getElementById('paiementDescription').value = p.description || '';
    }
    new bootstrap.Modal(document.getElementById('paiementModal')).show();
  },

  async save() {
    const id = document.getElementById('paiementId').value;
    const date = document.getElementById('paiementDate').value;
    const montant = parseFloat(document.getElementById('paiementMontant').value);
    const eleveId = document.getElementById('paiementEleveId').value;
    const type = document.getElementById('paiementType').value;
    if (!date || !montant || !eleveId || !type) { toast('Veuillez remplir tous les champs obligatoires', 'warning'); return; }

    const data = {
      date, montant, eleveId: parseInt(eleveId), typePaiement: type,
      statut: document.getElementById('paiementStatut').value,
      description: document.getElementById('paiementDescription').value || null
    };
    try {
      if (id) { await api('PUT', `/paiements/${id}`, data); toast('Paiement modifié'); }
      else { await api('POST', '/paiements', data); toast('Paiement enregistré'); }
      bootstrap.Modal.getInstance(document.getElementById('paiementModal'))?.hide();
      this.load();
    } catch (e) { toast(e.message, 'danger'); }
  },

  async delete(id) {
    if (!confirm('Supprimer ce paiement ?')) return;
    try { await api('DELETE', `/paiements/${id}`); toast('Paiement supprimé'); this.load(); }
    catch (e) { toast(e.message, 'danger'); }
  }
};

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  App.show('dashboard');
});
