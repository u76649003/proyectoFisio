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
import OrganizarClinica from './pages/OrganizarClinica';
import { authService } from './services/api';
import { AuthProvider } from './contexts/AuthContext';

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
          width: '100%',
          minWidth: '200px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            width: '100%',
            minWidth: '200px',
          },
          '& .MuiInputBase-input': {
            width: '100%',
            minWidth: '200px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          minWidth: '200px',
          width: '100%',
        },
        select: {
          width: '100%',
          boxSizing: 'border-box',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          minWidth: '200px',
          width: '100%',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: '100%',
          minWidth: '200px',
        },
        input: {
          width: '100%',
        },
      },
    },
  },
});

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  // Verificar autenticación de forma más completa
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  // Si no está autenticado, redirigir al inicio
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado, permitir acceso a la ruta
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
  }).catch(() => {
    // Ignorar errores silenciosamente
  });
};

// Intervalo de verificación de sesión (en milisegundos) - 5 minutos
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

function App() {
  useEffect(() => {
    // Despertar el servidor cuando se carga la aplicación
    preloadResources();
    
    // Verificar si hay una sesión activa al cargar la app
    if (authService.isAuthenticated()) {
      // Actualizar timestamp para extender su validez
      authService.refreshSession();
    }
    
    // Configurar verificación periódica de la sesión
    const sessionCheckInterval = setInterval(() => {
      if (authService.isAuthenticated()) {
        // Refrescar la sesión para mantenerla activa
        authService.refreshSession();
      }
    }, SESSION_CHECK_INTERVAL);
    
    // Limpiar intervalo al desmontar
    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pacientes" element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
            <Route path="/citas" element={<ProtectedRoute><Citas /></ProtectedRoute>} />
            <Route path="/organizar-clinica" element={<ProtectedRoute><OrganizarClinica /></ProtectedRoute>} />
            <Route path="/editar-empresa/:id" element={<ProtectedRoute><EditarEmpresa /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 