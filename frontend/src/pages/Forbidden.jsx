import { useNavigate } from 'react-router-dom'

export default function Forbidden() {
  const navigate = useNavigate()
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '4rem' }}></i>
      <h2 className="mt-3">Accès refusé</h2>
      <p className="text-muted">Vous n&apos;avez pas les droits pour accéder à cette page.</p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>Retour
      </button>
    </div>
  )
}
