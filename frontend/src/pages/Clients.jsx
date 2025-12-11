import React, { useState, useEffect } from 'react';
import { Users, Search, Star, Phone, Mail, MapPin } from 'lucide-react';
import { clientsApi, cartesFideliteApi } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsApi.getAll();
      
      // Charger les cartes de fidélité pour chaque client
      const clientsWithCards = await Promise.all(
        data.map(async (client) => {
          try {
            const cartes = await cartesFideliteApi.getAll();
            const clientCards = cartes.filter(carte => carte.Id_Client === client.Id_Client);
            const totalPoints = clientCards.reduce((sum, carte) => sum + (carte.Points_Cumules || 0), 0);
            
            return {
              ...client,
              points: totalPoints,
              type: totalPoints > 100 ? 'Fidèle' : totalPoints > 0 ? 'Standard' : 'Nouveau',
              cartesCount: clientCards.length,
            };
          } catch (err) {
            return {
              ...client,
              points: 0,
              type: 'Nouveau',
              cartesCount: 0,
            };
          }
        })
      );
      
      setClients(clientsWithCards);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients
  const filteredClients = clients.filter(client => {
    const fullName = `${client.Nom} ${client.Prenom}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           client.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.Telephone?.includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement des clients...</div>
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
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-blue-600" /> Gestion Clients
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
          + Nouveau Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-md flex gap-2">
        <Search className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher un client..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          Aucun client trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div key={client.Id_Client} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                client.type === 'Fidèle' ? 'bg-yellow-100 text-yellow-700' : 
                client.type === 'Standard' ? 'bg-blue-100 text-blue-700' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {client.type}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {client.Prenom?.charAt(0) || client.Nom?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{client.Prenom} {client.Nom}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" /> {client.points || 0} pts
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Mail size={16}/> {client.Email || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16}/> {client.Telephone || 'N/A'}
                </div>
                {client.Adresse && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16}/> {client.Adresse}
                  </div>
                )}
              </div>
              
              <button className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium">
                Voir Historique
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
