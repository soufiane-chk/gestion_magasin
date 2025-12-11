import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Printer } from 'lucide-react';
import { produitsApi, commandesApi, apiService } from '../services/api';

const Sales = () => {
  const [products, setProducts] = useState([]);
  
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('Client Comptoir');
  const [paymentMode, setPaymentMode] = useState('Espèces');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Charger l'utilisateur
        const me = await apiService.get('/auth/me');
        setUserId(me?.id || null);
      } catch {}
      try {
        const data = await produitsApi.getAll();
        const mapped = (data || []).map(p => ({
          id: p.Ref_Produit,
          name: p.Designation,
          price: Number(p.Prix_Vente),
          category: p.categorie?.Nom_Categorie || '—',
          stock: Number(p.Qt_Stock),
          raw: p,
        }));
        setProducts(mapped);
      } catch (e) {
        console.error('Erreur chargement produits', e);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {

        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    // Construire la commande pour l'API
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const payload = {
      Nom_Commande: `VENTE-${now.getTime()}`,
      date_Commande: dateStr,
      Heure_Cmd: timeStr,
      Total_TTC: totalAmount,
      Mode_Paiement: paymentMode,
      Id_Client: null,
      Id_Utilisateur: userId || 1,
      produits: cart.map(item => ({
        Ref_Produit: item.id,
        Quantite: item.qty,
        Prix_Unitaire: item.price,
      })),
    };

    try {
      const res = await commandesApi.create(payload);
      // Recharger les produits pour mettre à jour le stock
      const data = await produitsApi.getAll();
      const mapped = (data || []).map(p => ({
        id: p.Ref_Produit,
        name: p.Designation,
        price: Number(p.Prix_Vente),
        category: p.categorie?.Nom_Categorie || '—',
        stock: Number(p.Qt_Stock),
        raw: p,
      }));
      setProducts(mapped);
      setCart([]);
      // Informer le tableau de bord de rafraîchir ses statistiques
      try { window.dispatchEvent(new Event('stats:updated')); } catch {}
      // Informer le header de rafraîchir ses notifications
      try { window.dispatchEvent(new Event('notifications:updated')); } catch {}
      alert(`Vente validée pour un total de ${totalAmount} MAD !`);
    } catch (e) {
      alert(`Erreur lors de la validation de la vente: ${e.message}`);
      console.error(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.32))] gap-6">
  
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Scanner ou chercher un produit..." 
            className="flex-1 outline-none font-medium text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between h-32 group"
            >
              <div>
                <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-blue-600 font-bold text-lg">{product.price} MAD</span>
                <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
        <div className="p-5 border-b bg-gray-50 rounded-t-xl">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Panier en cours
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select 
              className="p-2 border rounded-lg bg-white text-sm"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option>Client Comptoir</option>
            </select>
            <select 
              className="p-2 border rounded-lg bg-white text-sm"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option>Espèces</option>
              <option>Carte</option>
              <option>Virement</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
              <p>Le panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.price} MAD x {item.qty}</p>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right ml-3">
                  <p className="font-bold text-gray-800 text-sm">{item.price * item.qty}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t bg-gray-50 rounded-b-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Sous-total</span>
            <span className="font-medium">{totalAmount} MAD</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-gray-800">
            <span>Total à payer</span>
            <span>{totalAmount} MAD</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={20} />
            Valider la Vente
          </button>
          
          <button className="w-full text-gray-500 text-sm flex justify-center items-center gap-2 hover:text-gray-800">
             <Printer size={16} /> Imprimer un devis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
