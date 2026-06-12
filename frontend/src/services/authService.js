import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Injecte le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirige vers /login si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      ;['token','role','nom','email'].forEach(k => localStorage.removeItem(k))
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authService = {
  login: (email, motDePasse) =>
    api.post('/auth/login', { email, motDePasse }).then((r) => r.data),

  register: (nom, email, motDePasse, role) =>
    api.post('/auth/register', { nom, email, motDePasse, role }).then((r) => r.data),
}
