import axios from 'axios'

// Use a hardcoded URL for now - fix TypeScript env issue
const API_URL = 'http://localhost:5000/api'  // Hardcoded for now

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const apiClient = {
  get: <T>(url: string, config?: any) =>
    api.get<T>(url, config).then((res) => res.data),
  
  post: <T>(url: string, data?: any, config?: any) =>
    api.post<T>(url, data, config).then((res) => res.data),
  
  put: <T>(url: string, data?: any, config?: any) =>
    api.put<T>(url, data, config).then((res) => res.data),
  
  patch: <T>(url: string, data?: any, config?: any) =>
    api.patch<T>(url, data, config).then((res) => res.data),
  
  delete: <T>(url: string, config?: any) =>
    api.delete<T>(url, config).then((res) => res.data),
}