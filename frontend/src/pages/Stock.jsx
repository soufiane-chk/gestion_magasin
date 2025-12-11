import React, { useState } from 'react';
import { Package, ArrowUpRight, ArrowDownLeft, AlertTriangle, History } from 'lucide-react';

const Stock = () => {
  const [stockItems] = useState([
    { id: 1, name: 'PC Portable HP', quantity: 10, minLimit: 5, lastUpdate: '2025-10-15' },
    { id: 2, name: 'Clavier Logitech', quantity: 3, minLimit: 5, lastUpdate: '2025-10-16' }, // Stock faible
    { id: 3, name: 'Écran Samsung', quantity: 8, minLimit: 3, lastUpdate: '2025-10-14' },
  ]);

  const [history] = useState([
    { id: 101, type: 'ENTREE', product: 'PC Portable HP', qty: 5, date: '2025-10-15 10:30', user: 'Akram' },
    { id: 102, type: 'SORTIE', product: 'Clavier Logitech', qty: 2, date: '2025-10-16 14:20', user: 'Imane' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Package className="text-blue-600" /> Gestion du Stock
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Valeur Totale Stock</p>
          <h3 className="text-2xl font-bold text-gray-800">145,200 MAD</h3>
        </div>
        <div className="bg-red-50 p-5 rounded-xl shadow-sm border border-red-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-600 text-sm font-medium">Alertes Stock Faible</p>
              <h3 className="text-2xl font-bold text-red-700">1 Article</h3>
            </div>
            <AlertTriangle className="text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">État Actuel</div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Produit</th>
                <th className="p-4">Quantité</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map(item => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">
                    {item.quantity < item.minLimit ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1">
                        <AlertTriangle size={12} /> Critique
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium">
                      Réapprovisionner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
            <History size={18} /> Derniers Mouvements
          </div>
          <div className="divide-y">
            {history.map(m => (
              <div key={m.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    m.type === 'ENTREE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {m.type}
                  </span>
                  <span className="text-xs text-gray-400">{m.date.split(' ')[0]}</span>
                </div>
                <p className="font-medium text-sm text-gray-800">{m.product}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Par: {m.user}</span>
                  <span className="font-mono text-gray-700 text-sm">
                    {m.type === 'ENTREE' ? '+' : '-'}{m.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;