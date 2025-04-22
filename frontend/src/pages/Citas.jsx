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
  useTheme,
  useMediaQuery,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { 
  Person, 
  Event, 
  AttachMoney, 
  Settings, 
  Dashboard as DashboardIcon, 
  Menu as MenuIcon, 
  ExitToApp,
  Add as AddIcon,
  ChevronLeft,
  ChevronRight,
  People
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

// Componentes estilizados (reutilizados del Dashboard)
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

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const CalendarDay = styled(Box)(({ theme, isToday }) => ({
  height: '80px',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  backgroundColor: isToday ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
  overflow: 'hidden',
  position: 'relative',
}));

const CalendarTimeSlot = styled(Box)(({ theme, hasAppointment }) => ({
  height: '30px',
  padding: theme.spacing(0.5),
  margin: '1px 0',
  backgroundColor: hasAppointment ? theme.palette.primary.light : 'transparent',
  borderRadius: '4px',
  color: hasAppointment ? theme.palette.primary.contrastText : theme.palette.text.primary,
  fontSize: '0.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: hasAppointment ? 'pointer' : 'default',
}));

const Citas = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [selectedProfesional, setSelectedProfesional] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Datos simulados de profesionales
  const profesionales = [
    { id: 1, nombre: 'Dr. Juan Pérez' },
    { id: 2, nombre: 'Dra. María López' },
  ];
  
  // Datos simulados de citas
  const citas = [];

  // Generar días de la semana actual
  const daysOfWeek = [];
  const startOfWeek = new Date(currentWeek);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lunes

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    daysOfWeek.push(day);
  }

  // Formato de fecha corto
  const formatShortDate = (date) => {
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(date);
  };

  // Formato de día de la semana
  const formatWeekday = (date) => {
    return new Intl.DateTimeFormat('es', { weekday: 'short' }).format(date);
  };

  // Comprobar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Obtener formato para el encabezado del calendario
  const getWeekRangeText = () => {
    const start = new Date(daysOfWeek[0]);
    const end = new Date(daysOfWeek[6]);
    
    const startMonth = start.toLocaleString('es', { month: 'long' });
    const endMonth = end.toLocaleString('es', { month: 'long' });
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} de ${startMonth} de ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} de ${startMonth} - ${end.getDate()} de ${endMonth} de ${start.getFullYear()}`;
    }
  };

  // Navegar a la semana anterior
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  // Navegar a la semana siguiente
  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  // Ir a la semana actual
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Manejar cambio de profesional seleccionado
  const handleProfesionalChange = (event) => {
    setSelectedProfesional(event.target.value);
  };

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Obtener datos del usuario
    const user = authService.getCurrentUser();
    setUserData(user);
    
    // Aquí se podrían cargar los datos de citas desde la API
    // fetchCitasData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Si no hay datos de usuario, no mostrar nada
  if (!userData) {
    return null;
  }

  // Horas de trabajo (8:00 - 20:00)
  const workingHours = Array.from({ length: 13 }, (_, i) => i + 8);

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
          <MenuListItem button component={Link} to="/dashboard">
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
          
          <MenuListItem button component={Link} to="/citas" selected={true}>
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
          flexWrap: 'wrap',
          mb: 4
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: { xs: 2, md: 0 } }}>
            Calendario de Citas
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/citas/nueva"
          >
            Nueva Cita
          </Button>
        </Box>

        {/* Controles del calendario */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <CalendarHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={goToPreviousWeek}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6">
                  {getWeekRangeText()}
                </Typography>
                <IconButton onClick={goToNextWeek}>
                  <ChevronRight />
                </IconButton>
                <Button variant="outlined" size="small" onClick={goToCurrentWeek}>
                  Hoy
                </Button>
              </Box>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Profesional</InputLabel>
                <Select
                  value={selectedProfesional}
                  onChange={handleProfesionalChange}
                  label="Profesional"
                  size="small"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {profesionales.map((profesional) => (
                    <MenuItem key={profesional.id} value={profesional.id}>
                      {profesional.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CalendarHeader>

            {/* Vista para pantallas más grandes: Calendario semanal */}
            {!isMobile && (
              <Box sx={{ overflowX: 'auto' }}>
                <Grid container sx={{ minWidth: 700 }}>
                  {/* Encabezados de los días */}
                  <Grid item xs={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Box p={1} fontWeight="medium" textAlign="center">
                      Hora
                    </Box>
                  </Grid>
                  
                  {daysOfWeek.map((day, index) => (
                    <Grid item xs key={index} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Box p={1} fontWeight="medium" textAlign="center" sx={{ 
                        bgcolor: isToday(day) ? 'primary.main' : 'grey.100',
                        color: isToday(day) ? 'white' : 'inherit'
                      }}>
                        <Typography variant="subtitle2">
                          {formatWeekday(day)}
                        </Typography>
                        <Typography variant="body2">
                          {formatShortDate(day)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                  
                  {/* Filas de horas */}
                  {workingHours.map((hour) => (
                    <React.Fragment key={hour}>
                      <Grid item xs={1}>
                        <Box p={1} textAlign="center" sx={{ 
                          borderBottom: 1, 
                          borderRight: 1, 
                          borderColor: 'divider',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {`${hour}:00`}
                        </Box>
                      </Grid>
                      
                      {daysOfWeek.map((day, dayIndex) => (
                        <Grid item xs key={`${hour}-${dayIndex}`}>
                          <CalendarDay isToday={isToday(day)}>
                            {/* Aquí se renderizarían las citas para esta hora y día */}
                          </CalendarDay>
                        </Grid>
                      ))}
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Vista para móviles: Lista de citas del día */}
            {isMobile && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Citas del día
                </Typography>
                
                {citas.length > 0 ? (
                  citas.map((cita) => (
                    <Paper key={cita.id} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">
                        {cita.hora} - {cita.paciente}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cita.tipoConsulta}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No hay citas programadas para el día seleccionado.
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </ContentArea>
    </Box>
  );
};

export default Citas; 