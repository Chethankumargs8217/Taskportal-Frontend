import axios from 'axios'

const api = axios.create({
  baseURL: 'https://task-portal-backend-b42u.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// FIX: Only auto-logout on 401 for TASK routes, NOT for auth routes
// Previously this was catching failed login/register (which also return 401)
// and redirecting to /login before the error message could be shown
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? ''
    const is401 = err.response?.status === 401
    const isAuthRoute = url.includes('/auth/')

    // Only auto-logout if 401 comes from a protected route (not login/register)
    if (is401 && !isAuthRoute) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const aiAPI = {
  generate: (title) => api.get('/ai/generate', { params: { title } }),
}

export default api
