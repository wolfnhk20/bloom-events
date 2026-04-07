import axios from 'axios'
import { supabase } from './supabase'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    return Promise.reject(error)
  }
)

export const packagesApi = {
  getAll: () => api.get('/api/packages'),
  getById: (id) => api.get(`/api/packages/${id}`),
  recommend: (guestCount) => api.get(`/api/packages/recommend?guestCount=${guestCount}`),
  create: (data) => api.post('/api/packages', data),
  update: (id, data) => api.put(`/api/packages/${id}`, data),
  delete: (id) => api.delete(`/api/packages/${id}`),
}

export const servicesApi = {
  getAll: () => api.get('/api/services'),
  create: (data) => api.post('/api/services', data),
  update: (id, data) => api.put(`/api/services/${id}`, data),
  delete: (id) => api.delete(`/api/services/${id}`),
}

export const eventsApi = {
  getAll: () => api.get('/api/events'),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
  getCostBreakdown: (id) => api.get(`/api/events/${id}/cost`),
}

export const guestsApi = {
  getAll: (eventId) => api.get(`/api/events/${eventId}/guests`),
  add: (eventId, guest) => api.post(`/api/events/${eventId}/guests`, guest),
  addBulk: (eventId, guests) => api.post(`/api/events/${eventId}/guests/bulk`, guests),
  remove: (eventId, guestId) => api.delete(`/api/events/${eventId}/guests/${guestId}`),
}

export const adminApi = {
  getStats: () => api.get('/api/admin/stats'),
  getAllEvents: (params) => api.get('/api/admin/events', { params }),
  updateEventStatus: (id, status) => api.put(`/api/admin/events/${id}/status`, { status }),
  deleteEvent: (id) => api.delete(`/api/admin/events/${id}`),
  getAllUsers: (params) => api.get('/api/admin/users', { params }),
}

export default api
