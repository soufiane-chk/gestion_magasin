import apiConfig from '../config/api';

/**
 * Service API pour faire des appels HTTP vers le backend Laravel
 */
class ApiService {
  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
  }

  /**
   * Récupère le token d'authentification depuis localStorage
   */
  getAuthToken() {
    return localStorage.getItem('userToken');
  }

  /**
   * Construit les headers avec l'authentification si disponible
   */
  getHeaders() {
    const headers = { ...apiConfig.headers };
    const token = this.getAuthToken();
    headers['X-Requested-With'] = 'XMLHttpRequest';
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['Accept'] = 'application/json';
    }

    return headers;
  }

  /**
   * Gère les erreurs de réponse
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue';
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || `Erreur ${response.status}`;
        if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('crumb')) {
          errorMessage = 'Aucun jeton CSRF valide (crumb) n’a été inclus. Configurez l’URL de l’API: créez frontend/.env avec VITE_API_URL=http://127.0.0.1:8001/api';
        }
      } catch {
        errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  /**
   * Méthode générique pour faire des requêtes
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      // Si c'est une erreur réseau (Failed to fetch)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8001');
      }
      throw error;
    }
  }

  // Méthodes CRUD génériques
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instances spécifiques pour chaque ressource
export const apiService = new ApiService();

// Services spécifiques
export const categoriesApi = {
  getAll: () => apiService.get('/categories'),
  getById: (id) => apiService.get(`/categories/${id}`),
  create: (data) => apiService.post('/categories', data),
  update: (id, data) => apiService.put(`/categories/${id}`, data),
  delete: (id) => apiService.delete(`/categories/${id}`),
};

export const produitsApi = {
  getAll: () => apiService.get('/produits'),
  getById: (id) => apiService.get(`/produits/${id}`),
  create: (data) => apiService.post('/produits', data),
  update: (id, data) => apiService.put(`/produits/${id}`, data),
  delete: (id) => apiService.delete(`/produits/${id}`),
};

export const fournisseursApi = {
  getAll: () => apiService.get('/fournisseurs'),
  getById: (id) => apiService.get(`/fournisseurs/${id}`),
  create: (data) => apiService.post('/fournisseurs', data),
  update: (id, data) => apiService.put(`/fournisseurs/${id}`, data),
  delete: (id) => apiService.delete(`/fournisseurs/${id}`),
};

export const clientsApi = {
  getAll: () => apiService.get('/clients'),
  getById: (id) => apiService.get(`/clients/${id}`),
  create: (data) => apiService.post('/clients', data),
  update: (id, data) => apiService.put(`/clients/${id}`, data),
  delete: (id) => apiService.delete(`/clients/${id}`),
};

export const commandesApi = {
  getAll: () => apiService.get('/commandes'),
  getById: (id) => apiService.get(`/commandes/${id}`),
  create: (data) => apiService.post('/commandes', data),
  update: (id, data) => apiService.put(`/commandes/${id}`, data),
  delete: (id) => apiService.delete(`/commandes/${id}`),
};

export const ventesApi = commandesApi;

export const cartesFideliteApi = {
  getAll: () => apiService.get('/cartes-fidelite'),
  getById: (id) => apiService.get(`/cartes-fidelite/${id}`),
  create: (data) => apiService.post('/cartes-fidelite', data),
  update: (id, data) => apiService.put(`/cartes-fidelite/${id}`, data),
  delete: (id) => apiService.delete(`/cartes-fidelite/${id}`),
};

export const notificationsApi = {
  getAll: () => apiService.get('/notifications'),
  markRead: (id) => apiService.patch(`/notifications/${id}/read`, {}),
  markAllRead: () => apiService.patch('/notifications/read-all', {}),
};

export const statsApi = {
  getOverview: (period = 'days') => apiService.get(`/stats/overview?period=${encodeURIComponent(period)}`),
};

export const usersApi = {
  getAll: () => apiService.get('/users'),
  create: (data) => apiService.post('/users', data),
  delete: (id) => apiService.delete(`/users/${id}`),
};

export const userApi = {
  getMe: async () => {
    // Adapte l'endpoint selon ton backend (ex: /me ou /user)
    return apiService.get('/me');
  },
  updateMe: async (data) => {
    // Adapte l'endpoint selon ton backend (ex: /me ou /user)
    return apiService.put('/me', data);
  }
};
