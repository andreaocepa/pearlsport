import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach access token from memory on every request
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

// ── API helpers ───────────────────────────────────────────────────────────────

export const articlesApi = {
  list: (params?: Record<string, string | number>) => api.get('/articles', { params }),
  featured: () => api.get('/articles/featured'),
  bySlug: (slug: string) => api.get(`/articles/${slug}`),
  create: (data: unknown) => api.post('/articles', data),
  update: (id: string, data: unknown) => api.put(`/articles/${id}`, data),
  submit: (id: string) => api.patch(`/articles/${id}/submit`),
  publish: (id: string) => api.patch(`/articles/${id}/publish`),
  feature: (id: string) => api.patch(`/articles/${id}/feature`),
  delete: (id: string) => api.delete(`/articles/${id}`),
};

export const fixturesApi = {
  list: (params?: Record<string, string>) => api.get('/fixtures', { params }),
  results: (params?: Record<string, string>) => api.get('/fixtures/results', { params }),
  byId: (id: string) => api.get(`/fixtures/${id}`),
  create: (data: unknown) => api.post('/fixtures', data),
  update: (id: string, data: unknown) => api.put(`/fixtures/${id}`, data),
  delete: (id: string) => api.delete(`/fixtures/${id}`),
};

export const sportsApi = {
  list: () => api.get('/sports'),
};

export const teamsApi = {
  list: (sport?: string) => api.get('/teams', { params: sport ? { sport } : {} }),
  bySlug: (slug: string) => api.get(`/teams/${slug}`),
  create: (data: unknown) => api.post('/teams', data),
  update: (id: string, data: unknown) => api.put(`/teams/${id}`, data),
};

export const competitionsApi = {
  list: (params?: Record<string, string>) => api.get('/competitions', { params }),
  create: (data: unknown) => api.post('/competitions', data),
  update: (id: string, data: unknown) => api.put(`/competitions/${id}`, data),
};

export const mediaApi = {
  upload: (formData: FormData) =>
    api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  list: () => api.get('/media'),
  delete: (storagePath: string) =>
    api.delete(`/media/${Buffer.from(storagePath).toString('base64')}`),
};

export const searchApi = {
  search: (q: string, sport?: string, page?: number) =>
    api.get('/search', { params: { q, sport, page } }),
};

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/users/me'),
};

export const usersApi = {
  list: () => api.get('/users'),
  create: (data: unknown) => api.post('/users', data),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  setRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
  deactivate: (id: string) => api.patch(`/users/${id}/deactivate`),
};
