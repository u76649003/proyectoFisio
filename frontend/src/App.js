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
import ProgramasPersonalizados from './pages/ProgramasPersonalizados';
import NuevoPrograma from './pages/NuevoPrograma';
import DetalleProgramaPersonalizado from './pages/DetalleProgramaPersonalizado';
import EditarPrograma from './pages/EditarPrograma';
import CompartirPrograma from './pages/CompartirPrograma';
import VisualizarPrograma from './pages/VisualizarPrograma';
import Perfil from './pages/Perfil';
import { authService } from './services/api';
import { AuthProvider } from './contexts/AuthContext';
import { Box, Typography } from '@mui/material';

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
  const [checking, setChecking] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState(false);

  // Efecto para verificar autenticación de forma asíncrona
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Si acabamos de iniciar sesión (tokenValidated está presente),
        // asumimos que la autenticación es correcta sin más validaciones
        const tokenValidated = localStorage.getItem('tokenValidated');
        if (tokenValidated === 'true') {
          console.log('Sesión reciente detectada, permitiendo acceso');
          setIsAuth(true);
          setChecking(false);
          return;
        }
        
        // Verificar existencia de token y datos de usuario
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          console.log('No hay token o datos de usuario');
          setIsAuth(false);
          setChecking(false);
          return;
        }
        
        try {
          // Verificar que los datos de usuario son JSON válido
          JSON.parse(userStr);
        } catch (e) {
          console.error('Error en datos de usuario almacenados:', e);
          localStorage.removeItem('user');
          setIsAuth(false);
          setChecking(false);
          return;
        }
        
        // Si hay token y datos de usuario válidos, permitimos el acceso
        setIsAuth(true);
        setChecking(false);
      } catch (error) {
        console.error('Error en ProtectedRoute:', error);
        setIsAuth(false);
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Mostrar indicador mientras se verifica la autenticación
  if (checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Verificando acceso...</Typography>
      </Box>
    );
  }
  
  // Redirigir si no está autenticado
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado, permitir acceso
  return children;
};

// Precargar recursos críticos
const preloadResources = () => {
  // Precargar API usando un endpoint público que no requiera autenticación
  fetch('http://localhost:8081/api/auth/health-check', { 
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
  const [sessionState, setSessionState] = React.useState('valid'); // 'checking', 'valid', 'invalid'

  useEffect(() => {
    // Despertar el servidor cuando se carga la aplicación
    preloadResources();
    
    // Si acabamos de iniciar sesión (tokenValidated está presente),
    // asumimos que la autenticación es correcta sin más validaciones
    const tokenValidated = localStorage.getItem('tokenValidated');
    if (tokenValidated === 'true') {
      console.log('Sesión reciente detectada en App, omitiendo validaciones iniciales');
      setSessionState('valid');
      return;
    }
    
    // Verificar si hay una sesión activa al cargar la app
    if (authService.isAuthenticated()) {
      console.log('Sesión existente detectada, actualizando timestamp');
      // Actualizar timestamp para extender su validez
      localStorage.setItem('lastAuthentication', Date.now().toString());
      setSessionState('valid');
    } else {
      console.log('No hay sesión válida detectada');
      setSessionState('invalid');
    }
    
    // Configurar verificación periódica de la sesión (cada 5 minutos)
    const sessionCheckInterval = setInterval(() => {
      // Solo refrescamos si NO acabamos de iniciar sesión
      if (localStorage.getItem('tokenValidated') !== 'true' && authService.isAuthenticated()) {
        console.log('Verificación periódica de sesión');
        // Refrescar la sesión para mantenerla activa, pero sin redirecciones automáticas
        authService.refreshSession()
          .then(refreshed => {
            if (!refreshed) {
              console.log('Sesión no refrescada, pero continuamos');
            }
          })
          .catch(error => {
            console.error('Error en verificación periódica:', error);
            // No hacemos nada adicional aquí para evitar cerrar sesión por errores temporales
          });
      }
    }, SESSION_CHECK_INTERVAL);
    
    // Limpiar intervalo al desmontar
    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, []);

  // Ya no mostramos pantalla de carga, pues asumimos validez por defecto
  // para evitar bloquear la interfaz innecesariamente

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
            
            {/* Rutas para Programas Personalizados */}
            <Route path="/programas-personalizados" element={<ProtectedRoute><ProgramasPersonalizados /></ProtectedRoute>} />
            <Route path="/programas-personalizados/nuevo" element={<ProtectedRoute><NuevoPrograma /></ProtectedRoute>} />
            <Route path="/programas-personalizados/:id" element={<ProtectedRoute><DetalleProgramaPersonalizado /></ProtectedRoute>} />
            <Route path="/programas-personalizados/editar/:id" element={<ProtectedRoute><EditarPrograma /></ProtectedRoute>} />
            <Route path="/programas-personalizados/:id/compartir" element={<ProtectedRoute><CompartirPrograma /></ProtectedRoute>} />
            <Route path="/programa/:token" element={<VisualizarPrograma />} />
            
            {/* Ruta para Perfil */}
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 