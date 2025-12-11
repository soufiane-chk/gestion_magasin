import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, AlertTriangle, CalendarDays } from 'lucide-react';
import { statsApi } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('jours');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    todayOrders: 0,
    series: [],
    period: 'days',
  });

  const chartData = useMemo(() => {
    return (stats.series || []).map((d) => ({ name: d.label, ventes: d.total }));
  }, [stats]);

  const totalVentes = useMemo(
    () => chartData.reduce((sum, item) => sum + item.ventes, 0).toLocaleString('fr-FR') + ' MAD',
    [chartData]
  );

  const toApiPeriod = (p) => {
    switch (p) {
      case 'jours': return 'days';
      case 'semaine': return 'weeks';
      case 'mois': return 'months';
      case 'annee': return 'years';
      default: return 'days';
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await statsApi.getOverview(toApiPeriod(period));
      setStats(data);
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    const handler = () => loadStats();
    window.addEventListener('stats:updated', handler);
    return () => window.removeEventListener('stats:updated', handler);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Chiffre d'affaires (Total)" value={`${stats.totalRevenue.toLocaleString('fr-FR')} MAD`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Ventes" value={`${stats.totalOrders}`} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Stock Faible" value={`${stats.lowStockCount} Articles`} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays size={18} /> Évolution des ventes ({period === 'jours' ? '14 jours' : period === 'semaine' ? '12 semaines' : period === 'mois' ? '12 mois' : '5 ans'})
            </h3>
            <p className="text-sm text-gray-500">Total période : {totalVentes}</p>
          </div>
          <div className="flex items-center gap-2">
            {['jours','semaine','mois','annee'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${
                  period === p ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p === 'jours' ? 'Jours' : p === 'semaine' ? 'Semaine' : p === 'mois' ? 'Mois' : 'Année'}
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">{loading ? 'Chargement...' : ''}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ventes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
