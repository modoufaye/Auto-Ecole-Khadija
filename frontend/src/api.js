function clearAuthStorage() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('nom')
  localStorage.removeItem('email')
}

export async function uploadFile(url, file) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api' + url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (res.status === 401) { clearAuthStorage(); window.location.href = '/login'; return }
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Erreur upload')
  return data
}

export async function api(method, url, body = null) {
  const token = localStorage.getItem('token')
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
  if (body !== null) opts.body = JSON.stringify(body)
  const res = await fetch('/api' + url, opts)
  if (res.status === 204) return null
  if (res.status === 401) {
    clearAuthStorage()
    window.location.href = '/login'
    return
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || (data.erreurs ? JSON.stringify(data.erreurs) : 'Erreur serveur'))
  return data
}
