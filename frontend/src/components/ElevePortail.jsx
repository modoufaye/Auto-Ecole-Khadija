import { useEffect, useState } from 'react'
import { api } from '../api'
import { fmtDate } from '../utils'
import { useAuth } from '../context/AuthContext'
import { toast } from './Toast'
import '../landing.css'

const RES_STYLE = {
  ADMIS:      { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Admis' },
  REFUSE:     { bg: '#fee2e2', color: '#b91c1c', dot: '#dc2626', label: 'Refusé' },
  EN_ATTENTE: { bg: '#fef9c3', color: '#a16207', dot: '#ca8a04', label: 'En attente' },
}
const TYPE_STYLE = {
  CODE:     { bg: '#eff6ff', color: '#2563eb', label: 'Code' },
  CONDUITE: { bg: '#f0fdf4', color: '#16a34a', label: 'Conduite' },
}
const STATUT_LECON = {
  PLANIFIEE: { bg: '#fef9c3', color: '#a16207', dot: '#ca8a04', label: 'Planifiée' },
  TERMINEE:  { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Terminée' },
  ANNULEE:   { bg: '#fee2e2', color: '#b91c1c', dot: '#dc2626', label: 'Annulée' },
}

function initials(prenom = '', nom = '') {
  return ((prenom[0] || '') + (nom[0] || '')).toUpperCase()
}

/* ── Tableau de leçons réutilisable ─────────────────────── */
function TableLecons({ lecons, empty }) {
  if (!lecons.length) return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: '#f1f5f9' }}>
        <i className={`bi bi-${empty.icon}`} style={{ fontSize: '1.4rem', color: '#94a3b8' }} />
      </div>
      <div className="text-sm font-medium text-slate-400">{empty.text}</div>
    </div>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['#', 'Date', 'Horaire', 'Moniteur', 'Statut', 'Observations'].map((h, i) => (
              <th key={h} className={`py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${i === 0 ? 'text-center w-10' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...lecons].sort((a, b) => b.date.localeCompare(a.date)).map((l, i) => {
            const st = STATUT_LECON[l.statut] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', label: l.statut }
            const isEven = i % 2 === 0
            return (
              <tr key={l.id} style={{ background: isEven ? '#fff' : '#fafbfc' }}
                className="transition-colors hover:bg-blue-50/40">
                <td className="py-3.5 px-4 text-center">
                  <span className="text-xs font-bold text-slate-300">{i + 1}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-sm font-semibold text-slate-700">{fmtDate(l.date)}</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="text-xs font-medium text-slate-500">
                    {l.heureDebut ? `${l.heureDebut.slice(0,5)} – ${l.heureFin?.slice(0,5)}` : '—'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs text-slate-500">
                    {l.moniteur ? `${l.moniteur.prenom} ${l.moniteur.nom}` : '—'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: st.bg, color: st.color }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                    {st.label}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400 max-w-[160px] truncate">{l.observations || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ElevePortail({ onGoSection }) {
  const { user } = useAuth()
  const [profil, setProfil]   = useState(null)
  const [examens, setExamens] = useState([])
  const [lecons, setLecons]   = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm]         = useState({})
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    Promise.all([
      api('GET', '/eleve/profil'),
      api('GET', '/eleve/mes-examens'),
      api('GET', '/eleve/mes-lecons'),
    ])
      .then(([p, e, l]) => { setProfil(p); setExamens(e); setLecons(l); setForm(toForm(p)) })
      .catch(err => setErreur(err.message || 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  function toForm(p) {
    return { prenom: p.prenom || '', nom: p.nom || '', telephone: p.telephone || '',
      email: p.email || '', adresse: p.adresse || '', numeroCni: p.numeroCni || '' }
  }

  const saveInfos = async () => {
    if (!form.prenom || !form.nom || !form.telephone) {
      toast('Prénom, nom et téléphone sont obligatoires', 'warning'); return
    }
    setSaving(true)
    try {
      const updated = await api('PUT', '/eleve/profil', form)
      setProfil(updated); setForm(toForm(updated)); setEditMode(false)
      toast('Informations mises à jour')
    } catch (e) { toast(e.message || 'Erreur lors de la sauvegarde', 'danger') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#1e3a5f] rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Chargement de votre espace…</span>
      </div>
    </div>
  )

  if (erreur) return (
    <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <i className="bi bi-exclamation-triangle-fill text-amber-500" style={{ fontSize: '1.1rem' }} />
      </div>
      <div>
        <div className="font-bold">{erreur}</div>
        <div className="text-sm mt-0.5 text-amber-600">Votre compte n'est pas encore lié à un profil élève. Contactez l'administration.</div>
      </div>
    </div>
  )

  const today          = new Date().toISOString().split('T')[0]
  const prochainExamen = examens.filter(e => e.date >= today && e.resultat === 'EN_ATTENTE').sort((a, b) => a.date.localeCompare(b.date))[0]
  const leconsConduite = lecons.filter(l => l.type === 'CONDUITE')
  const leconsCode     = lecons.filter(l => l.type === 'CODE')
  const examensAdmis   = examens.filter(e => e.resultat === 'ADMIS')
  const joursAvant     = prochainExamen ? Math.ceil((new Date(prochainExamen.date) - new Date()) / 86400000) : null
  const statutLabel    = { DIPLOME: 'Diplômé', EN_COURS: 'En formation', SUSPENDU: 'Suspendu', ABANDONNE: 'Abandonné' }[profil.statut] || profil.statut
  const statutColor    = { DIPLOME: { bg: 'rgba(212,160,23,.28)', color: '#fbbf24' }, EN_COURS: { bg: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.92)' }, SUSPENDU: { bg: 'rgba(239,68,68,.25)', color: '#fca5a5' }, ABANDONNE: { bg: 'rgba(100,116,139,.25)', color: '#cbd5e1' } }[profil.statut] || { bg: 'rgba(255,255,255,.15)', color: '#fff' }

  const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 text-sm outline-none focus:border-[#1e3a5f] focus:bg-white transition-all"
  const labelCls = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5"

  /* ── Composant en-tête de section ── */
  const SectionHeader = ({ gradient, border, icon, iconBg, iconColor, title, subtitle, badge, badgeStyle }) => (
    <div className="flex items-center justify-between px-6 py-3"
      style={{ background: gradient, borderBottom: `2px solid ${border}` }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: iconBg }}>
          <i className={`bi bi-${icon}`} style={{ color: iconColor, fontSize: '.85rem' }} />
        </div>
        <div>
          <div className="font-extrabold text-sm leading-tight" style={{ color: title.color }}>{title.text}</div>
          <div className="text-xs mt-0.5" style={{ color: subtitle.color }}>{subtitle.text}</div>
        </div>
      </div>
      {badge != null && (
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={badgeStyle}>{badge}</span>
      )}
    </div>
  )

  return (
    <div className="space-y-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══ BANNIÈRE ══════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #142a47 0%, #1e3a5f 50%, #2a4f7c 100%)', boxShadow: '0 8px 32px rgba(30,58,95,.3)' }}>

        {/* Décorations */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"
          style={{ background: 'radial-gradient(circle, #d4a017, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />

        <div className="relative px-6 py-2 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar + nom */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold"
                style={{ background: 'linear-gradient(135deg, #d4a017, #f0bb2a)', color: '#1e3a5f', boxShadow: '0 4px 14px rgba(212,160,23,.4)' }}>
                {initials(profil.prenom, profil.nom)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#1e3a5f] flex items-center justify-center"
                style={{ background: profil.statut === 'DIPLOME' ? '#d4a017' : profil.statut === 'EN_COURS' ? '#22c55e' : '#94a3b8' }}>
                <i className={`bi bi-${profil.statut === 'DIPLOME' ? 'patch-check-fill' : profil.statut === 'EN_COURS' ? 'play-fill' : 'pause-fill'}`}
                  style={{ fontSize: '.45rem', color: '#fff' }} />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-0.5">Mon espace</div>
              <div className="text-xl font-extrabold text-white leading-tight">{profil.prenom} {profil.nom}</div>
              {profil.email && <div className="text-sm text-blue-200 mt-0.5">{profil.email}</div>}
            </div>
          </div>

          {/* Droite : statut + prochain examen */}
          <div className="sm:ml-auto flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full border"
              style={{ background: statutColor.bg, color: statutColor.color, borderColor: 'rgba(255,255,255,.1)' }}>
              {statutLabel}
            </span>

            {prochainExamen && (
              <div className="rounded-xl px-4 py-2.5 text-center border"
                style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)' }}>
                <div className="text-xs text-blue-300 font-medium mb-1">Prochain examen</div>
                <div className="font-extrabold text-white text-base leading-none">{fmtDate(prochainExamen.date)}</div>
                <div className="mt-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: TYPE_STYLE[prochainExamen.type]?.bg, color: TYPE_STYLE[prochainExamen.type]?.color }}>
                    {TYPE_STYLE[prochainExamen.type]?.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre de stats intégrée */}
        <div className="grid grid-cols-4 border-t" style={{ borderColor: 'rgba(255,255,255,.08)', background: 'rgba(0,0,0,.15)' }}>
          {[
            { label: 'Cours conduite', value: leconsConduite.length, icon: 'car-front-fill',         color: '#60a5fa' },
            { label: 'Cours code',     value: leconsCode.length,     icon: 'sign-turn-right-fill',   color: '#a78bfa' },
            { label: 'Examens',        value: examens.length,        icon: 'clipboard2-check-fill',  color: '#38bdf8' },
            { label: 'Admis',          value: examensAdmis.length,   icon: 'patch-check-fill',       color: '#4ade80' },
          ].map(({ label, value, icon, color }, i) => (
            <div key={label} className={`flex flex-col items-center py-2 ${i > 0 ? 'border-l' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,.08)' }}>
              <i className={`bi bi-${icon}`} style={{ color, fontSize: '.85rem', marginBottom: 4 }} />
              <div className="text-lg font-extrabold text-white leading-none">{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.45)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alerte examen proche ── */}
      {prochainExamen && joursAvant <= 30 && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium"
          style={joursAvant <= 7
            ? { background: 'linear-gradient(135deg,#fef2f2,#fff5f5)', color: '#dc2626', border: '1px solid #fecaca', boxShadow: '0 2px 8px rgba(220,38,38,.1)' }
            : { background: 'linear-gradient(135deg,#fefce8,#fffef5)', color: '#a16207', border: '1px solid #fde68a', boxShadow: '0 2px 8px rgba(161,98,7,.08)' }
          }>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: joursAvant <= 7 ? '#fee2e2' : '#fef9c3' }}>
            <i className="bi bi-alarm-fill" style={{ fontSize: '.9rem' }} />
          </div>
          <div>
            <span className="font-bold">Examen {TYPE_STYLE[prochainExamen.type]?.label} dans {joursAvant} jour{joursAvant > 1 ? 's' : ''}</span>
            <span className="font-normal opacity-80"> — le {fmtDate(prochainExamen.date)}</span>
          </div>
        </div>
      )}

      {/* ══ COURS CODE ════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
        <SectionHeader
          gradient="linear-gradient(135deg, #1e3a5f 0%, #2a4f7c 100%)"
          border="#1e3a5f"
          icon="sign-turn-right-fill"
          iconBg="rgba(255,255,255,.18)"
          iconColor="#fff"
          title={{ text: 'Cours Code', color: '#fff' }}
          subtitle={{ text: 'Formation théorique du code de la route', color: 'rgba(147,197,253,.85)' }}
          badge={leconsCode.length}
          badgeStyle={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}
        />
        <TableLecons lecons={leconsCode} empty={{ icon: 'book', text: 'Aucun cours de code enregistré' }} />
      </div>

      {/* ══ COURS CONDUITE ════════════════════════════════════ */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
        <SectionHeader
          gradient="linear-gradient(135deg, #d4a017 0%, #f0bb2a 100%)"
          border="#b8860b"
          icon="car-front-fill"
          iconBg="rgba(255,255,255,.25)"
          iconColor="#1e3a5f"
          title={{ text: 'Cours Conduite', color: '#1e3a5f' }}
          subtitle={{ text: 'Formation pratique à la conduite', color: 'rgba(30,58,95,.6)' }}
          badge={leconsConduite.length}
          badgeStyle={{ background: 'rgba(30,58,95,.15)', color: '#1e3a5f' }}
        />
        <TableLecons lecons={leconsConduite} empty={{ icon: 'car-front', text: 'Aucun cours de conduite enregistré' }} />
      </div>

      {/* ══ INFOS : 2 colonnes ════════════════════════════════ */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Informations personnelles */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
          <SectionHeader
            gradient="linear-gradient(135deg, #d4a017 0%, #f0bb2a 100%)"
            border="#b8860b"
            icon="person-fill"
            iconBg="rgba(255,255,255,.25)"
            iconColor="#1e3a5f"
            title={{ text: 'Informations personnelles', color: '#1e3a5f' }}
            subtitle={{ text: 'Modifiables à tout moment', color: 'rgba(30,58,95,.6)' }}
          />

          {editMode ? (
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'prenom', label: 'Prénom' },
                  { key: 'nom',    label: 'Nom' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input className={inputCls} value={form[f.key]}
                      onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              {[
                { key: 'telephone', label: 'Téléphone', type: 'tel' },
                { key: 'email',     label: 'Email',     type: 'email' },
                { key: 'adresse',   label: 'Adresse',   type: 'text' },
                { key: 'numeroCni', label: 'Numéro CNI', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input className={inputCls} type={f.type} value={form[f.key]}
                    onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setForm(toForm(profil)); setEditMode(false) }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all"
                  style={{ background: '#f1f5f9', color: '#64748b' }}>
                  Annuler
                </button>
                <button onClick={saveInfos} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white border-0 cursor-pointer"
                  style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg,#1e3a5f,#2a4f7c)', boxShadow: saving ? 'none' : '0 4px 12px rgba(30,58,95,.3)' }}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }}></span>Enregistrement…</>
                    : <><i className="bi bi-check-lg" />Enregistrer</>}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-6 py-2">
                {[
                  { icon: 'person',        label: 'Prénom',     value: profil.prenom },
                  { icon: 'person-fill',   label: 'Nom',        value: profil.nom },
                  { icon: 'telephone',     label: 'Téléphone',  value: profil.telephone },
                  { icon: 'envelope',      label: 'Email',      value: profil.email },
                  { icon: 'geo-alt',       label: 'Adresse',    value: profil.adresse },
                  { icon: 'credit-card',   label: 'Numéro CNI', value: profil.numeroCni },
                ].map(({ icon, label, value }, i, arr) => (
                  <div key={label} className={`flex items-center gap-4 py-3 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: '#fef9c3' }}>
                      <i className={`bi bi-${icon}`} style={{ color: '#b45309', fontSize: '.78rem' }} />
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                      <span className="text-sm text-slate-700 font-medium text-right truncate max-w-[55%]">
                        {value || <span className="text-slate-300 font-normal">—</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-slate-50">
                <button onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all"
                  style={{ background: 'linear-gradient(135deg, #d4a017, #f0bb2a)', color: '#1e3a5f', boxShadow: '0 4px 12px rgba(212,160,23,.25)' }}>
                  <i className="bi bi-pencil-fill" style={{ fontSize: '.8rem' }} />
                  Modifier mes informations
                </button>
              </div>
            </>
          )}
        </div>

        {/* Informations de formation */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
          <SectionHeader
            gradient="linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
            border="#0e7490"
            icon="mortarboard-fill"
            iconBg="rgba(255,255,255,.2)"
            iconColor="#fff"
            title={{ text: 'Informations de formation', color: '#fff' }}
            subtitle={{ text: 'Gérées par l\'administration', color: 'rgba(165,243,252,.85)' }}
          />
          <div className="px-6 py-2">
            {[
              { icon: 'card-checklist',   label: 'Catégorie',      value: profil.categoriePermis },
              { icon: 'circle-fill',      label: 'Statut',         value: statutLabel,
                badge: { DIPLOME: { bg: '#fef9c3', color: '#a16207' }, EN_COURS: { bg: '#dcfce7', color: '#15803d' }, SUSPENDU: { bg: '#fef9c3', color: '#a16207' }, ABANDONNE: { bg: '#fee2e2', color: '#b91c1c' } }[profil.statut] },
              { icon: 'calendar-event',   label: 'Inscription',    value: fmtDate(profil.dateInscription) },
              { icon: 'person-badge',     label: 'Moniteur',       value: profil.moniteur ? `${profil.moniteur.prenom} ${profil.moniteur.nom}` : null },
              { icon: 'trophy',           label: 'Examens admis',  value: `${examensAdmis.length} / ${examens.length}` },
            ].map(({ icon, label, value, badge }, i, arr) => (
              <div key={label} className={`flex items-center gap-4 py-3 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e0f7fa' }}>
                  <i className={`bi bi-${icon}`} style={{ color: '#0891b2', fontSize: '.78rem' }} />
                </div>
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                  {badge
                    ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={badge}>{value}</span>
                    : <span className="text-sm text-slate-700 font-medium text-right">{value || <span className="text-slate-300 font-normal">—</span>}</span>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Mini-progression */}
          {examens.length > 0 && (
            <div className="mx-6 mb-5 mt-3 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg,#f0f9ff,#e0f7fa)', border: '1px solid #bae6fd' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-700">Taux de réussite</span>
                <span className="text-sm font-extrabold text-cyan-700">
                  {Math.round(examensAdmis.length / examens.length * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#bae6fd' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(examensAdmis.length / examens.length * 100)}%`, background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }} />
              </div>
              <div className="text-xs text-cyan-600 mt-1.5">{examensAdmis.length} admis sur {examens.length} examen{examens.length > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
