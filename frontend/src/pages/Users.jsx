import React, { useEffect, useState } from 'react';
import { Shield, UserPlus, Trash2 } from 'lucide-react';
import { usersApi } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usersApi.getAll();
      const mapped = (data || []).map(u => ({
        id: u.id,
        name: u.name || u.Nom_Utilisateur || '—',
        email: u.email,
        role: u.Type_Utilisateur || '—',
      }));
      setUsers(mapped);
    } catch (e) {
      setError(e.message || 'Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email) {
      setError('Nom et email sont requis');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await usersApi.create({ name: form.name, email: form.email, password: form.password || undefined });
      setForm({ name: '', email: '', password: '' });
      setShowAdd(false);
      await loadUsers();
      alert('Utilisateur ajouté avec succès');
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirmer la suppression de cet utilisateur ?')) return;
    setLoading(true);
    setError('');
    try {
      await usersApi.delete(id);
      await loadUsers();
      alert('Utilisateur supprimé');
    } catch (e) {
      setError(e.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="text-blue-600" /> Administration
        </h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2"
        >
          <UserPlus size={18} /> Ajouter un utilisateur
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="Nom"
              className="p-2 border rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input 
              type="email" 
              placeholder="Email"
              className="p-2 border rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input 
              type="password" 
              placeholder="Mot de passe (optionnel)"
              className="p-2 border rounded-lg"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Enregistrer</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border">Annuler</button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4">Utilisateur</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rôle</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="p-4" colSpan={4}>Chargement...</td></tr>
            )}
            {!loading && users.map(user => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Administrateur' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={4}>Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
