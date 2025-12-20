import React, { useState, useEffect } from 'react';
import { Users, Search, Star, Phone, Mail, MapPin } from 'lucide-react';
import { clientsApi, cartesFideliteApi, ventesApi } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    Telephone: '',
    Adresse: ''
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientHistory, setClientHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const fetchClientHistory = async (client) => {
    setSelectedClient(client);
    setLoadingHistory(true);
    try {
      const history = await ventesApi.getAll();
      console.log('Ventes récupérées:', history);
      // Filtrer les ventes pour ce client (comparaison robuste string/number)
      const filtered = history.filter(v => v.Id_Client && String(v.Id_Client) === String(client.Id_Client));
      setClientHistory(filtered);
    } catch (e) {
      setClientHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          onClick={() => setShowAddModal(true)}
        >
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
              
              <button
                className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium"
                onClick={() => fetchClientHistory(client)}
              >
                Voir Historique
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Ajouter un client</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await clientsApi.create(newClient);
                setShowAddModal(false);
                setNewClient({ Nom: '', Prenom: '', Email: '', Telephone: '', Adresse: '' });
                loadClients();
              } catch (err) {
                alert("Erreur lors de l'ajout du client");
                console.error(err);
              }
            }}>
              <div className="space-y-4">
                <input className="w-full mb-2 border rounded px-3 py-2" placeholder="Nom" value={newClient.Nom} onChange={e => setNewClient({ ...newClient, Nom: e.target.value })} required />
                <input className="w-full mb-2 border rounded px-3 py-2" placeholder="Prénom" value={newClient.Prenom} onChange={e => setNewClient({ ...newClient, Prenom: e.target.value })} required />
                <input className="w-full mb-2 border rounded px-3 py-2" placeholder="Email" value={newClient.Email} onChange={e => setNewClient({ ...newClient, Email: e.target.value })} />
                <input className="w-full mb-2 border rounded px-3 py-2" placeholder="Téléphone" value={newClient.Telephone} onChange={e => setNewClient({ ...newClient, Telephone: e.target.value })} />
                <input className="w-full mb-4 border rounded px-3 py-2" placeholder="Adresse" value={newClient.Adresse} onChange={e => setNewClient({ ...newClient, Adresse: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Ajouter</button>
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowAddModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Historique d'achat
                </h3>
                <p className="text-gray-500">
                  {selectedClient.Prenom} {selectedClient.Nom}
                </p>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setSelectedClient(null)}
              >
                ✕
              </button>
            </div>

            {loadingHistory ? (
              <div className="text-center py-8 text-gray-500">Chargement de l'historique...</div>
            ) : clientHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                Aucun historique d'achat trouvé pour ce client.
              </div>
            ) : (
              <div className="space-y-4">
                {clientHistory.sort((a, b) => new Date(b.date_Commande) - new Date(a.date_Commande)).map((commande) => (
                  <div key={commande.Id_Commande} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-900">
                          {new Date(commande.date_Commande).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-sm text-gray-500 px-2 py-0.5 bg-white border rounded">
                          {commande.Mode_Paiement}
                        </span>
                      </div>
                      <div className="font-bold text-blue-600">
                        Total: {Number(commande.Total_TTC).toFixed(2)} MAD
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2 font-medium">Article</th>
                            <th className="pb-2 font-medium text-right">Prix Unit.</th>
                            <th className="pb-2 font-medium text-right">Qté</th>
                            <th className="pb-2 font-medium text-right">Total Ligne</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {commande.produits?.map((prod, idx) => (
                            <tr key={idx}>
                              <td className="py-2 text-gray-800">{prod.Designation}</td>
                              <td className="py-2 text-right text-gray-600">
                                {Number(prod.pivot?.Prix_Unitaire || prod.Prix_Unitaire).toFixed(2)}
                              </td>
                              <td className="py-2 text-right text-gray-600">
                                {prod.pivot?.Quantite || prod.Quantite}
                              </td>
                              <td className="py-2 text-right font-medium text-gray-800">
                                {(Number(prod.pivot?.Prix_Unitaire || prod.Prix_Unitaire) * Number(prod.pivot?.Quantite || prod.Quantite)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                onClick={() => setSelectedClient(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
