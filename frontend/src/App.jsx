import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Importación de componentes
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import DetallesPaciente from './pages/DetallesPaciente';
import Citas from './pages/Citas';
import EditarEmpresa from './pages/EditarEmpresa';
import OrganizarClinica from './pages/OrganizarClinica';
import Perfil from './pages/Perfil';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rutas públicas (redirige a dashboard si ya está autenticado)
const PublicRoute = ({ children }) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/pacientes" element={
          <ProtectedRoute>
            <Pacientes />
          </ProtectedRoute>
        } />
        <Route path="/pacientes/:id" element={
          <ProtectedRoute>
            <DetallesPaciente />
          </ProtectedRoute>
        } />
        <Route path="/citas" element={
          <ProtectedRoute>
            <Citas />
          </ProtectedRoute>
        } />
        <Route path="/editar-empresa/:id" element={
          <ProtectedRoute>
            <EditarEmpresa />
          </ProtectedRoute>
        } />
        <Route path="/organizar-clinica" element={
          <ProtectedRoute>
            <OrganizarClinica />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 