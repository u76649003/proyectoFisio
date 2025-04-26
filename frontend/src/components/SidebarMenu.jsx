import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People,
  Event,
  BarChart,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
  MedicalServices,
  FitnessCenter
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, empresaService } from '../services/api';
import EmpresaLogo from './EmpresaLogo';

// Componentes estilizados
const SidebarContainer = styled(Box)(({ theme, open }) => ({
  width: open ? 280 : 73,
  flexShrink: 0,
  height: '100vh',
  backgroundColor: theme.palette.primary.main,
  backgroundImage: 'linear-gradient(to bottom, #1976d2, #1565c0)',
  color: theme.palette.common.white,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflow: 'hidden',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1000,
  boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
  [theme.breakpoints.down('sm')]: {
    width: open ? '100%' : 0,
    position: 'fixed',
  },
}));

const ContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen'
})(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: sidebarOpen ? 280 : 73,
  transition: theme.transitions.create('margin-left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    padding: theme.spacing(2),
  },
}));

const MenuListItem = styled(ListItem)(({ theme, selected }) => ({
  padding: theme.spacing(1.5, 2),
  color: selected ? theme.palette.primary.contrastText : 'rgba(255, 255, 255, 0.8)',
  backgroundColor: selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  borderRadius: '8px',
  margin: theme.spacing(0.5, 1.5),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const SidebarMenu = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [empresaData, setEmpresaData] = useState(null);

  // Efecto para cargar datos de usuario
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar autenticación primero
        if (!authService.isAuthenticated()) {
          console.log('No autenticado en SidebarMenu, redirigiendo al inicio');
          navigate('/');
          return;
        }
        
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUserData(currentUser);
          console.log('===== INFORMACIÓN DE USUARIO =====');
          console.log('ID:', currentUser.id);
          console.log('Nombre:', currentUser.nombre, currentUser.apellidos);
          console.log('ROL DEL USUARIO:', currentUser.rol);
          console.log('================================');
          
          // Si hay un ID de empresa en el usuario o en localStorage, cargar datos de empresa
          const empresaId = currentUser.empresaId || localStorage.getItem('empresaId');
          if (empresaId) {
            fetchEmpresaData(empresaId);
          }
        } else {
          // Si no hay usuario autenticado, redirigir a login
          console.log('Usuario no encontrado en SidebarMenu, redirigiendo al inicio');
          navigate('/');
        }
      } catch (error) {
        console.error('Error en SidebarMenu al cargar usuario:', error);
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Función para obtener datos de empresa
  const fetchEmpresaData = async (empresaId) => {
    try {
      const data = await empresaService.getEmpresaById(empresaId);
      setEmpresaData(data);
    } catch (error) {
      console.error('Error al cargar datos de empresa:', error);
    }
  };

  // Función para mostrar/ocultar sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determinar qué página está activa
  const isActive = (path) => {
    console.log('Verificando si la ruta es activa:', path);
    console.log('Ruta actual:', location.pathname);
    
    // Para rutas principales, verificar si la ruta actual comienza con la ruta dada
    if (path === '/programas-personalizados') {
      const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
      console.log('¿Es ruta de programas personalizados activa?', isActive);
      return isActive;
    }
    
    // Para otras rutas, verificar coincidencia exacta
    return location.pathname === path;
  };

  // Función para manejar clics en los enlaces del menú
  const handleMenuClick = (path) => {
    // Solo navegar si la ruta es diferente a la actual
    console.log('Intentando navegar a:', path);
    console.log('Ruta actual:', location.pathname);
    console.log('Token actual:', localStorage.getItem('token') ? 'Existe' : 'No existe');
    
    // Fix especial para programas personalizados
    if (path === '/programas-personalizados') {
      console.log('Navegando a programas personalizados usando navigate');
      // Usar navigate en lugar de window.location para preservar el token
      navigate('/programas-personalizados', { replace: true });
      return;
    }
    
    if (location.pathname !== path) {
      console.log('Navegando a nueva ruta:', path);
      navigate(path);
    } else {
      console.log('Ya estamos en la ruta:', path);
    }
  };

  // Función para manejar cierre de sesión
  const handleLogout = () => {
    // Limpiamos los datos de sesión
    authService.logout();
    // Navegamos al inicio
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <SidebarContainer open={sidebarOpen}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: 2,
          justifyContent: sidebarOpen ? 'space-between' : 'center',
        }}>
          {sidebarOpen ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmpresaLogo 
                logoUrl={empresaData?.logoUrl} 
                size={36} 
                useDefaultLogo={true} 
                sx={{ mr: 1.5 }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {empresaData?.nombre || 'FisioAyuda'}
              </Typography>
            </Box>
          ) : (
            <EmpresaLogo 
              logoUrl={empresaData?.logoUrl} 
              size={36} 
              useDefaultLogo={true}
            />
          )}
          <IconButton 
            color="inherit" 
            onClick={toggleSidebar}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
        
        {/* Información del usuario */}
        {sidebarOpen && userData && (
          <Box sx={{ p: 2, textAlign: 'center', mb: 1 }}>
            <Box 
              onClick={() => handleMenuClick('/perfil')}
              sx={{ 
                cursor: 'pointer',
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  margin: '0 auto', 
                  mb: 1, 
                  bgcolor: 'primary.light',
                  border: '2px solid white',
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {userData.nombre?.charAt(0)}{userData.apellidos?.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' }
              }}>
                {userData.nombre} {userData.apellidos}
              </Typography>
            </Box>
            <Chip 
              label={userData.rol} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                mt: 0.5
              }} 
            />
            <Typography 
              variant="body2" 
              color="rgba(255,255,255,0.7)" 
              sx={{ 
                mt: 1, 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline', color: 'white' }
              }}
              onClick={() => handleMenuClick('/perfil')}
            >
              Editar perfil
            </Typography>
          </Box>
        )}
        
        <List>
          <MenuListItem 
            button 
            selected={isActive('/dashboard')}
            onClick={() => handleMenuClick('/dashboard')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Inicio" />}
          </MenuListItem>
          
          <MenuListItem 
            button 
            selected={isActive('/pacientes')}
            onClick={() => handleMenuClick('/pacientes')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <People />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Pacientes" />}
          </MenuListItem>
          
          <MenuListItem 
            button 
            selected={isActive('/citas')}
            onClick={() => handleMenuClick('/citas')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Event />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Citas" />}
          </MenuListItem>
          
          {/* Opción de Organizar Clínica */}
          <MenuListItem 
            button 
            selected={isActive('/organizar-clinica')}
            onClick={() => handleMenuClick('/organizar-clinica')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <MedicalServices />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Organizar Clínica" />}
          </MenuListItem>
          
          {/* Nueva opción de Programas Personalizados - ACCESO PARA TODOS LOS ROLES */}
          <MenuListItem 
            button 
            selected={isActive('/programas-personalizados')}
            component="a"
            href="/programas-personalizados"
            sx={{ 
              bgcolor: isActive('/programas-personalizados') ? 'rgba(255,255,255,0.3)' : 'transparent',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <FitnessCenter />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Programas Personalizados" />}
          </MenuListItem>
          
          <MenuListItem 
            button 
            selected={isActive('/informes')}
            onClick={() => handleMenuClick('/informes')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <BarChart />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Informes" />}
          </MenuListItem>
          
          {/* Configuración (solo visible para DUEÑO) */}
          {userData && userData.empresaId && (
            <MenuListItem 
              button 
              selected={location.pathname.startsWith('/editar-empresa')}
              onClick={() => handleMenuClick(`/editar-empresa/${userData.empresaId}`)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Settings />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Configuración" />}
            </MenuListItem>
          )}
        </List>
        
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <MenuListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <ExitToApp />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Cerrar sesión" />}
          </MenuListItem>
        </Box>
      </SidebarContainer>

      {/* Contenido principal */}
      <ContentWrapper sidebarOpen={sidebarOpen}>
        {children}
      </ContentWrapper>
    </Box>
  );
};

export default SidebarMenu; 