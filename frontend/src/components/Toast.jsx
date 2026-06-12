import { useState, useCallback } from 'react'

let _addToast = null

export function useToastManager() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  _addToast = addToast
  return { toasts }
}

export function toast(msg, type = 'success') {
  _addToast?.(msg, type)
}

const ICONS = { success: 'check-circle-fill', danger: 'x-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' }

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast show text-bg-${t.type} border-0 align-items-center`}>
          <div className="d-flex">
            <div className="toast-body">
              <i className={`bi bi-${ICONS[t.type] || 'info-circle-fill'} me-2`}></i>
              {t.msg}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
