import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';

const ParametresCompte = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // À adapter selon ton système d'authentification
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userApi.getMe();
        console.log('Données utilisateur:', data); // Ajoute ceci
        setUser(data?.user || data);
        setForm({ nom: data?.user?.nom || data.nom, email: data?.user?.email || data.email, password: '' });
      } catch (e) {
        setFeedback("Erreur lors du chargement du compte.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateMe({
        nom: form.nom,
        email: form.email,
        ...(form.password ? { password: form.password } : {})
      });
      setFeedback("Compte mis à jour avec succès !");
      setForm({ ...form, password: '' });
    } catch (e) {
      setFeedback("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!user && !loading) {
    return <div className="text-red-600">Impossible de charger les informations du compte.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Paramètres du compte</h2>
      {feedback && <div className="mb-4 text-blue-700">{feedback}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default ParametresCompte;