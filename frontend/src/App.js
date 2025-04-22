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
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Precargar recursos críticos
const preloadResources = () => {
  // Precargar API
  fetch('https://proyectofisio.onrender.com/api/health', { 
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-store'
  }).catch(() => {
    // Ignorar errores - solo queremos "despertar" al servidor
  });
};

function App() {
  useEffect(() => {
    // Despertar el servidor cuando se carga la aplicación
    preloadResources();
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