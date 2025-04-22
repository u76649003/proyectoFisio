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
  useMediaQuery,
  Avatar,
  Chip,
  Tooltip
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
  MedicalServices,
  LocalHospital,
  BarChart
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { authService, empresaService } from '../services/api';
import { EmpresaLogo } from '../components';
import logoImg from '../assets/logo.svg';

// Componentes estilizados
const DashboardCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
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

const ContentArea = styled(Box)(({ theme, sidebarOpen }) => ({
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

const ActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.shadows[1],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [empresaData, setEmpresaData] = useState(null);
  
  // Datos simulados para el dashboard
  const dashboardData = {
    pacientesActivos: 0,
    citasHoy: 0,
    ingresosMensuales: '€0.00',
    profesionalesActivos: 0,
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
    
    // Obtener datos de la empresa si hay un empresaId
    if (user.empresaId) {
      console.log("Dashboard - Obteniendo datos de la empresa:", user.empresaId);
      fetchEmpresaData(user.empresaId);
    }
    
    // Aquí se podrían cargar los datos del dashboard desde la API
    // fetchDashboardData();
  }, [navigate]);

  const fetchEmpresaData = async (empresaId) => {
    try {
      const data = await empresaService.getEmpresaById(empresaId);
      console.log("Dashboard - Datos de empresa recibidos:", data);
      setEmpresaData(data);
    } catch (error) {
      console.error("Error al obtener datos de la empresa:", error);
    }
  };

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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen}>
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
        {sidebarOpen && (
          <Box sx={{ p: 2, textAlign: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                margin: '0 auto', 
                mb: 1, 
                bgcolor: 'primary.light',
                border: '2px solid white'
              }}
            >
              {userData.nombre?.charAt(0)}{userData.apellidos?.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {userData.nombre} {userData.apellidos}
            </Typography>
            <Chip 
              label={userData.rol} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                mt: 0.5
              }} 
            />
          </Box>
        )}
        
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
          
          {/* Nueva opción: Organizar Clínica */}
          <MenuListItem button component={Link} to="/organizar-clinica">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <MedicalServices />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Organizar Clínica" />}
          </MenuListItem>
          
          <MenuListItem button component={Link} to="/informes">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <BarChart />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Informes" />}
          </MenuListItem>
          
          {/* Ajustes de Empresa */}
          {userData.empresaId && (
            <MenuListItem button component={Link} to={`/editar-empresa/${userData.empresaId}`}>
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
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard color="#1976d2" sx={{ borderRadius: 4, boxShadow: '0 6px 20px rgba(25, 118, 210, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                  Pacientes
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.pacientesActivos}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard color="#2e7d32" sx={{ borderRadius: 4, boxShadow: '0 6px 20px rgba(46, 125, 50, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <Event />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                  Citas Hoy
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.citasHoy}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard color="#0097a7" sx={{ borderRadius: 4, boxShadow: '0 6px 20px rgba(0, 151, 167, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <MedicalServices />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                  Profesionales
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {dashboardData.profesionalesActivos}
              </Typography>
              <ActionLink>
                <Typography variant="body2">Ver detalles</Typography>
                <ChevronRight fontSize="small" />
              </ActionLink>
            </DashboardCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard color="#ed6c02" sx={{ borderRadius: 4, boxShadow: '0 6px 20px rgba(237, 108, 2, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                  Ingresos
                </Typography>
              </Box>
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

        {/* Secciones principales del dashboard */}
        <Grid container spacing={3}>
          {/* Actividad reciente */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
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
                  <Box sx={{ 
                    py: 4, 
                    textAlign: 'center', 
                    bgcolor: '#f9f9f9', 
                    borderRadius: 2 
                  }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay actividad reciente para mostrar.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Enlaces rápidos */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Acciones Rápidas
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      startIcon={<Person />}
                      component={Link}
                      to="/pacientes"
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid rgba(0,0,0,0.1)',
                        color: '#1976d2',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          borderColor: '#1976d2'
                        }
                      }}
                    >
                      Nuevo Paciente
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      startIcon={<Event />}
                      component={Link}
                      to="/citas"
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid rgba(0,0,0,0.1)',
                        color: '#2e7d32',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.04)',
                          borderColor: '#2e7d32'
                        }
                      }}
                    >
                      Nueva Cita
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      startIcon={<MedicalServices />}
                      component={Link}
                      to="/organizar-clinica"
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid rgba(0,0,0,0.1)',
                        color: '#0097a7',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 151, 167, 0.04)',
                          borderColor: '#0097a7'
                        }
                      }}
                    >
                      Organizar Clínica
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      startIcon={<BarChart />}
                      component={Link}
                      to="/informes"
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid rgba(0,0,0,0.1)',
                        color: '#ed6c02',
                        '&:hover': {
                          backgroundColor: 'rgba(237, 108, 2, 0.04)',
                          borderColor: '#ed6c02'
                        }
                      }}
                    >
                      Ver Informes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 