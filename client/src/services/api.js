import axios from 'axios';

const TOKEN_KEY = 'frm_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the JWT to every request when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so the UI can show clean toasts.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ── Fridge ────────────────────────────────────────────
export const fridgeApi = {
  get: () => api.get('/fridge').then((r) => r.data),
  add: (name) => api.post('/fridge/add', { name }).then((r) => r.data),
  remove: (name) =>
    api.delete(`/fridge/${encodeURIComponent(name)}`).then((r) => r.data),
  clear: () => api.delete('/fridge').then((r) => r.data),
};

// ── Recipes ───────────────────────────────────────────
export const recipeApi = {
  match: (params = {}) =>
    api.get('/recipe/match', { params }).then((r) => r.data),
  browse: (params = {}) => api.get('/recipe', { params }).then((r) => r.data),
  getOne: (id) => api.get(`/recipe/${id}`).then((r) => r.data),
  toggleSave: (id) => api.post(`/recipe/${id}/save`).then((r) => r.data),
  saved: () => api.get('/recipe/saved').then((r) => r.data),
};

// ── Shopping lists ────────────────────────────────────
export const shoppingApi = {
  generate: (recipeId) =>
    api.post('/shopping-list/generate', { recipeId }).then((r) => r.data),
  list: () => api.get('/shopping-list').then((r) => r.data),
  toggleItem: (id, itemIndex) =>
    api.put(`/shopping-list/${id}/item/${itemIndex}`).then((r) => r.data),
  remove: (id) => api.delete(`/shopping-list/${id}`).then((r) => r.data),
};

export default api;
