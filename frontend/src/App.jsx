import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Importación de componentes
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import DetallesPaciente from './pages/DetallesPaciente';
import NuevoPaciente from './pages/NuevoPaciente';
import Citas from './pages/Citas';
import EditarEmpresa from './pages/EditarEmpresa';
import OrganizarClinica from './pages/OrganizarClinica';
import Perfil from './pages/Perfil';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import ProgramasPersonalizados from './pages/ProgramasPersonalizados';
import NuevoPrograma from './pages/NuevoPrograma';
import DetalleProgramaPersonalizado from './pages/DetalleProgramaPersonalizado';
import CompartirPrograma from './pages/CompartirPrograma';
import ProtectedRoute from './components/ProtectedRoute';
import EditarPrograma from './pages/EditarPrograma';
import VisualizarPrograma from './pages/VisualizarPrograma';
import AdminPanel from './pages/AdminPanel';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  console.log('Verificando autenticación para ruta protegida');
  const isAuth = authService.isAuthenticated();
  console.log('¿Usuario autenticado?', isAuth);
  
  if (!isAuth) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  console.log('Usuario autenticado, permitiendo acceso a ruta protegida');
  return children;
};

// Componente para rutas públicas (redirige a dashboard si ya está autenticado)
const PublicRoute = ({ children }) => {
  console.log('Verificando estado para ruta pública');
  const isAuth = authService.isAuthenticated();
  console.log('¿Usuario ya autenticado?', isAuth);
  
  if (isAuth) {
    console.log('Usuario ya autenticado, redirigiendo a dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  console.log('Usuario no autenticado, mostrando ruta pública');
  return children;
};

function App() {
  useEffect(() => {
    console.log('===== Iniciando App =====');
    console.log('Versión: 1.0.1');
    console.log('Modo: Depuración activada');
    
    // Mostrar información del usuario actual
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Usuario en App.jsx:', user);
        console.log('ROL EN APP.JSX:', user.rol);
        console.log('Nombre de usuario:', user.nombre || user.username);
        console.log('ID de usuario:', user.id);
        console.log('Token disponible:', !!localStorage.getItem('token'));
      } catch (e) {
        console.error('Error al parsear usuario en App.jsx:', e);
        console.error('Contenido del localStorage user:', userStr);
      }
    } else {
      console.log('No hay usuario en localStorage');
      console.log('Estado de autenticación según servicio:', authService.isAuthenticated());
    }
  }, []);

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
        <Route path="/pacientes/nuevo" element={
          <ProtectedRoute>
            <NuevoPaciente />
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
        {/* Ruta de programas personalizados sin ProtectedRoute */}
        <Route path="/programas-personalizados" element={<ProgramasPersonalizados />} />
        <Route path="/programas-personalizados/nuevo" element={
          <ProtectedRoute>
            <NuevoPrograma />
          </ProtectedRoute>
        } />
        <Route path="/programas-personalizados/:id" element={
          <ProtectedRoute>
            <DetalleProgramaPersonalizado />
          </ProtectedRoute>
        } />
        <Route path="/programas-personalizados/editar/:id" element={
          <ProtectedRoute>
            <DetalleProgramaPersonalizado isEditMode={true} />
          </ProtectedRoute>
        } />
        <Route path="/programas-personalizados/:id/compartir" element={
          <ProtectedRoute>
            <CompartirPrograma />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        } />
        <Route path="/nuevo-programa" element={<ProtectedRoute><NuevoPrograma /></ProtectedRoute>} />
        <Route path="/editar-programa/:id" element={<ProtectedRoute><EditarPrograma /></ProtectedRoute>} />
        <Route path="/visualizar-programa/:id/:token" element={<VisualizarPrograma />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 