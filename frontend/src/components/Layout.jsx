import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, ShieldCheck, TrendingUp } from 'lucide-react';
import Header from './Header';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`group relative flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
        : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      <Icon size={20} />
    </div>
    <span className="font-medium">{label}</span>
    {active && (
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
    )}
  </Link>
);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-gray-200/50 flex flex-col">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Tableau de bord" 
              path="/app" 
              active={location.pathname === '/app' || location.pathname === '/app/'} 
            />
            <SidebarItem 
              icon={Package} 
              label="Produits" 
              path="/app/products" 
              active={location.pathname === '/app/products'} 
            />
            <SidebarItem 
              icon={ShoppingCart} 
              label="Vente (Caisse)" 
              path="/app/sales" 
              active={location.pathname === '/app/sales'} 
            />
            <SidebarItem 
              icon={TrendingUp} 
              label="Stock" 
              path="/app/stock" 
              active={location.pathname === '/app/stock'} 
            />
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Gestion
              </p>
            </div>
            
            <SidebarItem 
              icon={Users} 
              label="Clients" 
              path="/app/clients" 
              active={location.pathname === '/app/clients'} 
            />
            <SidebarItem 
              icon={ShieldCheck} 
              label="Utilisateurs" 
              path="/app/users" 
              active={location.pathname === '/app/users'} 
            />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-105"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
