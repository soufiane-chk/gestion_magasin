import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';
import { produitsApi, categoriesApi } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockFilter, setStockFilter] = useState('all');
  const [form, setForm] = useState({
    Ref_Produit: '',
    Designation: '',
    Prix_Achat: '',
    Prix_Vente: '',
    Qt_Stock: '',
    Seuil_Alerte: '',
    Taux_TVA: 20,
    Id_Categorie: '',
  });
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    categories: 0,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const lowStock = products.filter(p => p.Qt_Stock < p.Seuil_Alerte).length;
      const totalValue = products.reduce((sum, p) => sum + (p.Prix_Vente * p.Qt_Stock), 0);
      setStats({
        totalProducts: products.length,
        totalValue: totalValue.toLocaleString('fr-FR'),
        lowStockProducts: lowStock,
        categories: categories.length,
      });
    }
  }, [products, categories]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produitsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await produitsApi.delete(id);
        setFeedback('Produit supprimé avec succès');
        loadProducts();
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Ref_Produit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.Id_Categorie === parseInt(selectedCategory);
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.Qt_Stock < product.Seuil_Alerte && product.Qt_Stock > 0;
    } else if (stockFilter === 'out') {
      matchesStock = product.Qt_Stock === 0;
    }
    return matchesSearch && matchesCategory && matchesStock;
  });

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      Ref_Produit: product.Ref_Produit || '',
      Designation: product.Designation || '',
      Prix_Achat: product.Prix_Achat || '',
      Prix_Vente: product.Prix_Vente || '',
      Qt_Stock: product.Qt_Stock || '',
      Seuil_Alerte: product.Seuil_Alerte || '',
      Taux_TVA: product.Taux_TVA || 20,
      Id_Categorie: product.Id_Categorie || '',
    });
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm({
      Ref_Produit: '',
      Designation: '',
      Prix_Achat: '',
      Prix_Vente: '',
      Qt_Stock: '',
      Seuil_Alerte: '',
      Taux_TVA: 20,
      Id_Categorie: '',
    });
    setShowAddModal(true);
  };

  const exportToCSV = () => {
    const csv = [
      ['Référence', 'Désignation', 'Catégorie', 'Prix Achat', 'Prix Vente', 'Stock', 'Seuil', 'TVA%'],
      ...filteredProducts.map(p => [
        p.Ref_Produit,
        p.Designation,
        categories.find(c => c.Id_Categorie === p.Id_Categorie)?.Libelle_Cat || 'N/A',
        p.Prix_Achat,
        p.Prix_Vente,
        p.Qt_Stock,
        p.Seuil_Alerte,
        p.Taux_TVA
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await produitsApi.update(editingProduct.Ref_Produit, {
        Designation: form.Designation,
        Prix_Achat: Number(form.Prix_Achat),
        Prix_Vente: Number(form.Prix_Vente),
        Qt_Stock: Number(form.Qt_Stock),
        Seuil_Alerte: Number(form.Seuil_Alerte),
        Taux_TVA: Number(form.Taux_TVA),
        Id_Categorie: Number(form.Id_Categorie),
      });
      setEditingProduct(null);
      setFeedback('Produit mis à jour avec succès');
      loadProducts();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.Ref_Produit.trim()) {
      alert('Veuillez entrer une référence de produit');
      return;
    }
    try {
      await produitsApi.create({
        Ref_Produit: form.Ref_Produit.trim(),
        Designation: form.Designation,
        Prix_Achat: Number(form.Prix_Achat),
        Prix_Vente: Number(form.Prix_Vente),
        Qt_Stock: Number(form.Qt_Stock),
        Seuil_Alerte: Number(form.Seuil_Alerte),
        Taux_TVA: Number(form.Taux_TVA),
        Id_Categorie: Number(form.Id_Categorie),
      });
      setForm({
        Ref_Produit: '',
        Designation: '',
        Prix_Achat: '',
        Prix_Vente: '',
        Qt_Stock: '',
        Seuil_Alerte: '',
        Taux_TVA: 20,
        Id_Categorie: '',
      });
      setFeedback('Produit ajouté avec succès');
      setShowAddModal(false);
      loadProducts();
    } catch (err) {
      alert('Erreur lors de l\'ajout du produit: ' + err.message);
    }
  };

  // Préparation des données pour le graphique
  const chartData = {
    labels: categories.map(c => c.Libelle_Cat),
    datasets: [{
      label: 'Stock par catégorie',
      data: categories.map(cat =>
        products.filter(p => p.Id_Categorie === cat.Id_Categorie)
          .reduce((sum, p) => sum + p.Qt_Stock, 0)
      ),
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderRadius: 8,
    }]
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
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📦 Gestion des Produits</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez votre inventaire en temps réel</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus size={20} /> Ajouter un produit
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-blue-600 text-sm font-semibold">Produits</p>
          <p className="text-3xl font-bold text-blue-800">{stats.totalProducts}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
          <p className="text-green-600 text-sm font-semibold">Valeur Stock</p>
          <p className="text-2xl font-bold text-green-800">{stats.totalValue} MAD</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
          <p className="text-red-600 text-sm font-semibold">Stock Bas</p>
          <p className="text-3xl font-bold text-red-800">{stats.lowStockProducts}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-purple-600 text-sm font-semibold">Catégories</p>
          <p className="text-3xl font-bold text-purple-800">{stats.categories}</p>
        </div>
      </div>

      {/* Messages de feedback */}
      {feedback && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          {feedback}
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un produit (nom ou référence)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            {categories.map(category => (
              <option key={category.Id_Categorie} value={category.Id_Categorie}>
                {category.Libelle_Cat}
              </option>
            ))}
          </select>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">Tous les stocks</option>
            <option value="low">Stock bas</option>
            <option value="out">Rupture de stock</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Download size={18} /> Exporter
          </button>
        </div>
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
                      {categories.find(c => c.Id_Categorie === product.Id_Categorie)?.Libelle_Cat || 'N/A'}
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
              <h3 className="text-lg font-semibold">
                Modifier le produit
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditingProduct(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                <input
                  type="text"
                  value={form.Ref_Produit}
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={form.Id_Categorie}
                  onChange={(e) => setForm({ ...form, Id_Categorie: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.Id_Categorie} value={category.Id_Categorie}>
                      {category.Libelle_Cat}
                    </option>
                  ))}
                </select>
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

      {/* Modal d'ajout de produit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ajouter un produit</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                <input
                  type="text"
                  value={form.Ref_Produit}
                  onChange={(e) => setForm({ ...form, Ref_Produit: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={form.Id_Categorie}
                  onChange={(e) => setForm({ ...form, Id_Categorie: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.Id_Categorie} value={category.Id_Categorie}>
                      {category.Libelle_Cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Ajouter
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
