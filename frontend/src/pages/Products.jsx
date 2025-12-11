import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { produitsApi } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    Designation: '',
    Prix_Vente: '',
    Qt_Stock: '',
    Seuil_Alerte: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produitsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await produitsApi.delete(id);
        loadProducts(); // Recharger la liste
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Designation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categorie?.Id_Categorie === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      Designation: product.Designation || '',
      Prix_Vente: product.Prix_Vente || '',
      Qt_Stock: product.Qt_Stock || '',
      Seuil_Alerte: product.Seuil_Alerte || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await produitsApi.update(editingProduct.Ref_Produit, {
        ...form,
        Prix_Vente: Number(form.Prix_Vente),
        Qt_Stock: Number(form.Qt_Stock),
        Seuil_Alerte: Number(form.Seuil_Alerte),
      });
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Produits</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Ajouter un produit
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          className="border rounded-lg px-4 py-2 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {/* Les catégories seront chargées dynamiquement si nécessaire */}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Référence</th>
              <th className="p-4 font-semibold text-gray-600">Désignation</th>
              <th className="p-4 font-semibold text-gray-600">Catégorie</th>
              <th className="p-4 font-semibold text-gray-600">Prix Vente (MAD)</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.Ref_Produit} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{product.Ref_Produit}</td>
                  <td className="p-4">{product.Designation}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                      {product.categorie?.Libelle_Cat || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{product.Prix_Vente} MAD</td>
                  <td className={`p-4 font-medium ${
                    product.Qt_Stock < product.Seuil_Alerte ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {product.Qt_Stock} {product.Qt_Stock < product.Seuil_Alerte && '(Alerte)'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => openEdit(product)}
                  >
                    <Edit size={18} />
                  </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(product.Ref_Produit)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modifier le produit</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditingProduct(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Désignation</label>
                <input
                  type="text"
                  value={form.Designation}
                  onChange={(e) => setForm({ ...form, Designation: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Vente</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.Prix_Vente}
                    onChange={(e) => setForm({ ...form, Prix_Vente: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.Qt_Stock}
                    onChange={(e) => setForm({ ...form, Qt_Stock: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte</label>
                <input
                  type="number"
                  value={form.Seuil_Alerte}
                  onChange={(e) => setForm({ ...form, Seuil_Alerte: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
