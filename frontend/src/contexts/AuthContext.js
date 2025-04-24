import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto que envuelve la aplicación
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Efecto para cargar el usuario actual al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          setUserData(currentUser);
          setIsAuthenticated(true);
          
          // Opcionalmente, validar el token con el backend
          try {
            await authService.validateToken();
          } catch (error) {
            // Si hay un error de validación, cerrar sesión
            if (error.response && error.response.status === 401) {
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setLoginError('');
      
      const response = await authService.login(credentials);
      
      // Actualizar el estado con los datos del usuario
      setUserData(response.usuario);
      setIsAuthenticated(true);
      
      // Cerrar el modal de login
      setLoginModalOpen(false);
      
      return response;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error del servidor con respuesta
        if (error.response.status === 401) {
          setLoginError('Credenciales incorrectas');
        } else if (error.response.status === 403) {
          setLoginError('Cuenta no verificada. Por favor, verifica tu correo electrónico');
        } else {
          setLoginError('Error en el servidor. Por favor, inténtalo más tarde');
        }
      } else if (error.request) {
        // Error de conexión
        setLoginError('No se pudo conectar con el servidor. Verifica tu conexión');
      } else {
        // Otro tipo de error
        setLoginError('Error al iniciar sesión: ' + error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    authService.logout();
    setUserData(null);
    setIsAuthenticated(false);
    
    // Redirigir a la página de inicio si es necesario
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  // Función para controlar el modal de login
  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
    setLoginError('');
  };

  // Valores y funciones que estarán disponibles en el contexto
  const value = {
    userData,
    setUserData,
    isAuthenticated,
    loading,
    loginModalOpen,
    loginError,
    handleLogin,
    handleLogout,
    toggleLoginModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 