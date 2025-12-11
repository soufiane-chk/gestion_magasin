# Configuration API - Frontend

## Configuration de l'API

Le frontend est maintenant connecté au backend Laravel via l'API REST.

### Variables d'environnement

Créez un fichier `.env` dans le dossier `frontend` avec :

```env
VITE_API_URL=http://localhost:8000/api
```

### Services API disponibles

Les services suivants sont disponibles dans `src/services/api.js` :

- `categoriesApi` - Gestion des catégories
- `produitsApi` - Gestion des produits
- `fournisseursApi` - Gestion des fournisseurs
- `clientsApi` - Gestion des clients
- `commandesApi` - Gestion des commandes
- `cartesFideliteApi` - Gestion des cartes de fidélité

### Exemple d'utilisation

```javascript
import { produitsApi } from '../services/api';

// Récupérer tous les produits
const produits = await produitsApi.getAll();

// Créer un produit
await produitsApi.create({
  Ref_Produit: 'PROD001',
  Designation: 'Produit test',
  Prix_Achat: 100,
  Prix_Vente: 150,
  // ...
});
```

### Configuration CORS

Le backend Laravel est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Autre serveur de dev)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

### Démarrage

1. Démarrer le backend Laravel :
   ```bash
   cd backend
   php artisan serve
   ```

2. Démarrer le frontend :
   ```bash
   cd frontend
   npm run dev
   ```

3. Le frontend sera accessible sur `http://localhost:5173`
4. L'API sera accessible sur `http://localhost:8000/api`

