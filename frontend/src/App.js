import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Landing from './pages/Landing';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import EditarEmpresa from './pages/EditarEmpresa';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Citas from './pages/Citas';
import { authService } from './services/api';

// Definir el tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Azul de FisioAyuda
    },
    secondary: {
      main: '#34A853', // Verde para acentos
    },
    background: {
      default: '#f5f5f5', // Fondo gris claro
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute - Verificando autenticación...");
  
  // Verificar token en localStorage
  const token = localStorage.getItem('token');
  console.log("Token en localStorage:", token ? `${token.substring(0, 15)}...` : "No hay token");
  
  // Verificar datos de usuario
  const userStr = localStorage.getItem('user');
  console.log("Datos de usuario en localStorage:", userStr ? "Presentes" : "Ausentes");
  
  // Verificar timestamp de última autenticación
  const lastAuth = localStorage.getItem('lastAuthentication');
  console.log("Timestamp de última autenticación:", lastAuth);
  
  // Verificar autenticación de forma más completa
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  // Log para depuración
  console.log("ProtectedRoute - Estado de autenticación:", isAuthenticated);
  console.log("ProtectedRoute - Usuario actual:", currentUser ? `ID: ${currentUser.id}, Rol: ${currentUser.rol}` : "No hay usuario");
  
  // Si no está autenticado, redirigir al inicio
  if (!isAuthenticated || !currentUser) {
    console.log("Acceso denegado a ruta protegida - Redirigiendo a inicio");
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado, permitir acceso a la ruta
  console.log("Acceso permitido a ruta protegida");
  return children;
};

// Precargar recursos críticos
const preloadResources = () => {
  // Precargar API usando un endpoint público que no requiera autenticación
  fetch('https://proyectofisio.onrender.com/api/auth/health-check', { 
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).catch((error) => {
    // Ignorar errores pero los registramos para depuración
    console.log("Preload fetch completado (puede que con errores)");
  });
};

// Intervalo de verificación de sesión (en milisegundos) - 5 minutos
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

function App() {
  useEffect(() => {
    // Despertar el servidor cuando se carga la aplicación
    preloadResources();
    
    // Verificar si hay una sesión activa al cargar la app
    const checkInitialSession = async () => {
      if (authService.isAuthenticated()) {
        // Refrescar la sesión para extender su validez
        authService.refreshSession();
        console.log("Sesión existente refrescada al iniciar la aplicación");
      }
    };
    
    checkInitialSession();
    
    // Configurar verificación periódica de la sesión
    const sessionCheckInterval = setInterval(() => {
      if (authService.isAuthenticated()) {
        // Refrescar la sesión para mantenerla activa mientras el usuario usa la app
        authService.refreshSession();
        console.log("Sesión refrescada periódicamente");
      }
    }, SESSION_CHECK_INTERVAL);
    
    // Configurar detección de actividad del usuario
    const handleUserActivity = () => {
      if (authService.isAuthenticated()) {
        authService.refreshSession();
      }
    };
    
    // Eventos para detectar actividad del usuario
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    
    // Limpiar intervalos y event listeners al desmontar
    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pacientes" element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
          <Route path="/citas" element={<ProtectedRoute><Citas /></ProtectedRoute>} />
          <Route path="/editar-empresa/:id" element={<ProtectedRoute><EditarEmpresa /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 