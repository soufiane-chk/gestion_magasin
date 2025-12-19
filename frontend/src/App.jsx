import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Stock from './pages/Stock';
import Login from './pages/Login';
import Clients from './pages/Clients';
import Users from './pages/Users';
import Home from './pages/Home';
import ParametresCompte from './pages/ParametresCompte';

// Protection de route (Vérifie si on est connecté)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Zone protégée */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="stock" element={<Stock />} />
          <Route path="clients" element={<Clients />} />
          <Route path="users" element={<Users />} />
        </Route>
        {/* <Route path="/settings" element={<ParametresCompte />} /> */}
      </Routes>
    </Router>
  );
}

export default App;