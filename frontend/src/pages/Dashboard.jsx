import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar,
  Grid, 
  Card, 
  CardContent
} from '@mui/material';
import { 
  ChevronRight, 
  AttachMoney, 
  People, 
  Event, 
  MedicalServices,
  Download as ExportIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { authService, pacienteService, agendaService, usuarioService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

// Componentes estilizados para las tarjetas del dashboard
const DashboardCard = styled(Card)(({ theme, color }) => ({
  backgroundColor: color,
  color: '#fff',
  height: '100%',
  padding: theme.spacing(3),
  '&:hover': {
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transform: 'translateY(-5px)'
  },
  transition: 'transform 0.2s, box-shadow 0.2s'
}));

const ActionLink = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 600;
  
  // Estados para los datos del dashboard
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    pacientesActivos: 0,
    citasHoy: 0,
    profesionalesActivos: 0,
    ingresosMensuales: '0€'
  });
  
  // Cargar datos del usuario y del dashboard
  useEffect(() => {
    const loadUserData = async () => {
      // Verificar autenticación
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      // Obtener datos del usuario
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUserData(currentUser);
        
        // Cargar datos para el dashboard
        try {
          await loadDashboardData(currentUser);
        } catch (error) {
          console.error('Error cargando datos del dashboard:', error);
        }
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Función para cargar los datos del dashboard
  const loadDashboardData = useCallback(async (user) => {
    try {
      // Contador de pacientes
      let pacientesCount = 0;
      try {
        const pacientes = await pacienteService.getPacientesByEmpresa(user.empresaId);
        pacientesCount = pacientes.length;
      } catch (e) {
        console.error('Error al cargar pacientes:', e);
      }
      
      // Contador de citas para hoy
      let citasHoyCount = 0;
      try {
        const today = new Date().toISOString().split('T')[0];
        const citas = await agendaService.getAgenda(today);
        citasHoyCount = citas.length;
      } catch (e) {
        console.error('Error al cargar citas:', e);
      }
      
      // Contador de profesionales
      let profesionalesCount = 0;
      try {
        const profesionales = await usuarioService.getUsuariosByEmpresa(user.empresaId);
        profesionalesCount = profesionales.length;
      } catch (e) {
        console.error('Error al cargar profesionales:', e);
      }
      
      // Simular cálculo de ingresos (en una aplicación real esto sería una API real)
      const ingresos = '2.500€';
      
      setDashboardData({
        pacientesActivos: pacientesCount,
        citasHoy: citasHoyCount,
        profesionalesActivos: profesionalesCount,
        ingresosMensuales: ingresos
      });
    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
    }
  }, []);

  return (
    <SidebarMenu>
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
        <Grid item xs={12} sm={6} md={userData?.rol === 'DUENO' ? 3 : 4}>
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
        
        <Grid item xs={12} sm={6} md={userData?.rol === 'DUENO' ? 3 : 4}>
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
        
        <Grid item xs={12} sm={6} md={userData?.rol === 'DUENO' ? 3 : 4}>
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
        
        {/* Tarjeta de Ingresos - Solo visible para el DUEÑO */}
        {userData?.rol === 'DUENO' && (
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
        )}
      </Grid>

      {/* Actividad reciente */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Actividad reciente
              </Typography>
              <Box sx={{ mb: 2 }}>
                {/* Ejemplo de actividad reciente */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa'
                }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Event />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Nueva cita agendada</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Juan Pérez - Hoy a las 16:30
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa'
                }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Nuevo paciente registrado</Typography>
                    <Typography variant="body2" color="text.secondary">
                      María García - Ayer a las 10:15
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa'
                }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <MedicalServices />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Nuevo tratamiento asignado</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ana Martínez - Hace 2 días
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="text" color="primary">
                  Ver todas las actividades
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Próximas citas
              </Typography>
              
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JP</Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">Juan Pérez</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fisioterapia - Primera visita
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    16:30
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>MG</Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">María García</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rehabilitación - Seguimiento
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    17:45
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f7fa'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>AM</Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">Ana Martínez</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Masaje terapéutico
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    18:30
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="text" color="primary" onClick={() => navigate('/citas')}>
                  Ver todas las citas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SidebarMenu>
  );
};

export default Dashboard; 