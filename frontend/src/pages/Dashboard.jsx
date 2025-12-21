import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Wallet, ShoppingBag, AlertTriangle, CalendarDays, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { statsApi } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
  <div className="relative overflow-hidden bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
    
    <div className="flex items-start justify-between relative z-10">
      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
          trend === 'up' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
            : 'bg-rose-50 border-rose-100 text-rose-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span className="text-xs font-bold">{trendValue}</span>
        </div>
      )}
    </div>
    
    <div className="mt-6 relative z-10">
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
        {title}
        {subtitle && <span className="text-gray-300">•</span>}
        {subtitle && <span className="text-xs text-gray-400 font-normal">{subtitle}</span>}
      </p>
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
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Vue d'ensemble
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Bienvenue sur votre tableau de bord de gestion.
          </p>
        </div>
        
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex w-full lg:w-auto overflow-x-auto custom-scrollbar animate-slide-up" style={{animationDelay: '0.1s'}}>
          {['jours','semaine','mois','annee'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                period === p 
                  ? 'bg-gray-900 text-white shadow-lg scale-[1.02]' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {p === 'jours' ? 'Aujourd\'hui' : p === 'semaine' ? 'Semaine' : p === 'mois' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <StatCard 
          title="Chiffre d'affaires" 
          value={`${stats.totalRevenue.toLocaleString('fr-FR')} MAD`} 
          icon={Wallet} 
          color="from-emerald-400 to-teal-500"
          trend="up"
          trendValue="+12.5%"
          subtitle="vs. période préc."
        />
        <StatCard 
          title="Commandes Totales" 
          value={`${stats.totalOrders}`} 
          icon={ShoppingBag} 
          color="from-blue-500 to-indigo-600"
          trend="up"
          trendValue="+5.2%"
          subtitle="Commandes validées"
        />
        <StatCard 
          title="Stock Faible" 
          value={`${stats.lowStockCount}`} 
          icon={AlertTriangle} 
          color="from-amber-400 to-orange-500"
          trend="down" // Assuming down is bad for revenue but here it's alert count, let's keep it simple
          trendValue="Attention"
          subtitle="Produits à réapprovisionner"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <TrendingUp size={20} />
                </span>
                Performance des ventes
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <span className="text-sm font-medium text-gray-500">Total Période:</span>
              <span className="text-lg font-bold text-indigo-600">{totalVentes}</span>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderRadius: '16px', 
                    border: 'none', 
                    padding: '12px 20px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                  formatter={(value) => [`${value} MAD`, 'Chiffre d\'affaires']}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVentes)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
