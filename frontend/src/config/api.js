// Configuration de l'API
// En développement, utilise le proxy Vite si disponible, sinon l'URL directe
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

