import React, { useState, useEffect, useRef } from 'react';
import { notificationsApi } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, User, LogOut, Settings, Store } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const [notificationItems, setNotificationItems] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  // Charger les notifications à l'ouverture du menu
  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      const items = (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleString(),
        is_read: n.is_read,
        type: n.type,
      }));
      setNotificationItems(items);
      setNotifCount(items.length);
    } catch (e) {
      console.error('Erreur de chargement des notifications', e);
    }
  };

  // Charger une première fois au montage pour le badge
  useEffect(() => { loadNotifications(); }, []);

  // Écouter les mises à jour de notifications en arrière-plan pour mettre à jour le badge
  useEffect(() => {
    const handler = () => { loadNotifications(); };
    window.addEventListener('notifications:updated', handler);
    return () => window.removeEventListener('notifications:updated', handler);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 ${
        scrolled 
          ? 'shadow-lg' 
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Store className="relative text-white w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold transition-colors duration-300 text-white">
                MagasinManager
              </h1>
              <p className="text-xs transition-colors duration-300 text-white/80">
                Gestion Intelligente
              </p>
            </div>
          </div>

          {/* Search Bar removed */}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={async () => {
                  const next = !showNotifications;
                  setShowNotifications(next);
                  if (next) await loadNotifications();
                }}
                className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 text-white/80 hover:bg-white/10"
                aria-haspopup="true"
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                {notifCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div ref={notifRef} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                    <p className="font-semibold text-gray-800">Notifications</p>
                    <p className="text-sm text-gray-500">Vous avez {notifCount} notifications</p>
                  </div>
                  <ul className="max-h-80 overflow-auto">
                    {notificationItems.map((n) => (
                      <li key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <span className={`text-gray-800 ${n.is_read ? 'opacity-70' : 'font-medium'}`}>{n.title}</span>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{n.time}</span>
                        </div>
                        {n.message && (
                          <div className="text-xs text-gray-600 mt-1">{n.message}</div>
                        )}
                      </li>
                    ))}
                    {notificationItems.length === 0 && (
                      <li className="px-4 py-6 text-center text-gray-500">Aucune notification</li>
                    )}
                  </ul>
                  <div className="p-3 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-105 text-white/80 hover:bg-white/10"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white/20">
                  <User size={18} className="text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <p className="font-semibold text-gray-800">Admin</p>
                    <p className="text-sm text-gray-500">admin@magasin.ma</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Paramètres</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Effect */}
      {!scrolled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
