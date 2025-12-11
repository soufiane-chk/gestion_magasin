import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, BarChart3, ShoppingBag, Users, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/30">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-900 to-blue-900 text-white">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">MagasinManager</h1>
            <p className="text-sm text-white/70">Gestion moderne & sécurisée</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-white/30 text-white/90 hover:text-white hover:border-white transition-all"
          >
            Connexion
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2"
          >
            Accéder à la gestion <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <section className="grid lg:grid-cols-2 gap-10 items-center py-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
              <ShieldCheck size={16} /> Sécurisé avec authentification admin
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Pilotez votre magasin avec un
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400"> tableau de bord futuriste</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Suivi des ventes semaine, mois, année. Gestion des produits, stocks et clients avec une interface moderne et animée.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/80 flex items-center gap-2">
                <BarChart3 size={18} /> Analytique en temps réel
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/80 flex items-center gap-2">
                <ShoppingBag size={18} /> Gestion des produits
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/80 flex items-center gap-2">
                <Users size={18} /> Clients & fidélité
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white/5 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard icon={BarChart3} title="Ventes multi périodes" desc="Vue semaine, mois, année en un clic." />
                <FeatureCard icon={Cpu} title="Design futuriste" desc="Animations fluides et glassmorphism." />
                <FeatureCard icon={ShoppingBag} title="Produits éditables" desc="Modifier rapidement prix et stock." />
                <FeatureCard icon={Users} title="Clients & fidélité" desc="Suivi des points et historique." />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-white/70 text-sm">
          <p>© {new Date().getFullYear()} MagasinManager</p>
          <div className="flex gap-4">
            <span>Dashboard futuriste</span>
            <span>Support EMSI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

