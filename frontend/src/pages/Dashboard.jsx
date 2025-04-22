import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Person, 
  CalendarToday, 
  AttachMoney, 
  ChevronRight,
  Event,
  AccessTime,
  People,
  Settings,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  ExitToApp,
  Print as PrintIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

// Componentes estilizados
const DashboardCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  height: '100%',
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.common.white,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  display: 'flex',
  flexDirection: 'column',
}));

const ActionLink = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Sidebar = styled(Box)(({ theme, open }) => ({
  width: open ? 240 : 73,
  flexShrink: 0,
  height: '100vh',
  backgroundColor: theme.palette.primary.main,
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
  [theme.breakpoints.down('sm')]: {
    width: open ? '100%' : 0,
    position: 'fixed',
  },
}));

const ContentArea = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: sidebarOpen ? 240 : 73,
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
  borderRadius: '4px',
  margin: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.shadows[1],
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  
  // Datos simulados para el dashboard
  const dashboardData = {
    pacientesActivos: 0,
    citasHoy: 0,
    ingresosMensuales: '€0.00',
    actividades: []
  };

  useEffect(() => {
    console.log("Dashboard - Componente montado");
    
    // Comprobar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      console.log("Dashboard - Usuario no autenticado, redirigiendo a inicio");
      navigate('/');
      return;
    }
    
    // Obtener datos del usuario
    const user = authService.getCurrentUser();
    console.log("Dashboard - Usuario actual:", user);
    
    if (!user) {
      console.log("Dashboard - No se pudo obtener datos del usuario");
      authService.logout(); // Limpiar cualquier dato inconsistente
      navigate('/');
      return;
    }
    
    setUserData(user);
    console.log("Dashboard - Datos de usuario establecidos correctamente");
    
    // Aquí se podrían cargar los datos del dashboard desde la API
    // fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    console.log("Dashboard - Cerrando sesión");
    authService.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Si no hay datos de usuario, mostrar mensaje de carga o redirigir
  if (!userData) {
    console.log("Dashboard - Renderizando: No hay datos de usuario");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Cargando Dashboard...</Typography>
      </Box>
    );
  }
  
  console.log("Dashboard - Renderizando: Dashboard completo para usuario:", userData.nombre);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          p: 2
        }}>
          {sidebarOpen && (
            <Typography variant="h6" component="div">
              FisioAyuda
            </Typography>
          )}
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        
        <List>
          <MenuListItem button component={Link} to="/dashboard" selected={true}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Inicio" />}
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/pacientes">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <People />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Pacientes" />}
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/citas">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Event />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Citas" />}
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/informes">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <AttachMoney />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Informes" />}
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/configuracion">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Settings />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Configuración" />}
          </MenuListItem>
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
      </Sidebar>

      {/* Contenido principal */}
      <ContentArea sidebarOpen={sidebarOpen}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Dashboard
          </Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<ExportIcon />} 
              sx={{ mr: 1 }}
              size={isMobile ? "small" : "medium"}
            >
              Exportar
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />}
              size={isMobile ? "small" : "medium"}
            >
              Imprimir
            </Button>
          </Box>
        </Box>

        {/* Cards de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <DashboardCard color="#1976d2">
              <Typography variant="h6" gutterBottom>
                Pacientes Activos
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.pacientesActivos}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <DashboardCard color="#2e7d32">
              <Typography variant="h6" gutterBottom>
                Citas Hoy
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.citasHoy}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <DashboardCard color="#0097a7">
              <Typography variant="h6" gutterBottom>
                Ingresos Mensuales
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.ingresosMensuales}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Actividad reciente */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            
            {dashboardData.actividades.length > 0 ? (
              dashboardData.actividades.map((actividad, index) => (
                <ActivityItem key={index}>
                  <ListItemIcon>
                    {actividad.tipo === 'paciente' ? <Person /> : 
                     actividad.tipo === 'cita' ? <Event /> : 
                     <AttachMoney />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={actividad.descripcion}
                    secondary={actividad.fecha}
                  />
                </ActivityItem>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No hay actividad reciente para mostrar.
              </Typography>
            )}
          </CardContent>
        </Card>
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 