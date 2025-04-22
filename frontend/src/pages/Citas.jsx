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
import { authService, agendaService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';

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

// Función para formatear fechas
const formatDate = (dateStr) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(dateStr).toLocaleDateString('es-ES', options);
};

// Función para verificar si una fecha es hoy
const isToday = (dateStr) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

const Citas = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [selectedProfesional, setSelectedProfesional] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Datos simulados de profesionales
  const profesionales = [
    { id: 1, nombre: 'Dr. Juan Pérez' },
    { id: 2, nombre: 'Dra. María López' },
  ];
  
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
    
    // Cargar citas al montar el componente
    const fetchCitas = async () => {
      try {
        // Generar fechas de la semana actual
        generateWeekDates(currentWeek);
        
        // Cargar citas por fecha (implementación simulada)
        await loadCitasByWeek(currentWeek);
      } catch (error) {
        console.error('Error al cargar citas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCitas();
  }, [navigate, currentWeek]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Función para generar las fechas de la semana
  const generateWeekDates = (baseDate) => {
    const dates = [];
    const startDate = new Date(baseDate);
    const day = startDate.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Ajustar al lunes de la semana actual
    startDate.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1));
    
    // Generar 7 días (una semana)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    setWeekDates(dates);
  };
  
  // Cargar citas de la semana
  const loadCitasByWeek = async (baseDate) => {
    try {
      // Implementación simulada - en una app real, cargaríamos desde la API
      const citasSimuladas = [
        {
          id: 1,
          fechaHora: '2023-10-16T10:00:00',
          paciente: { id: 1, nombre: 'Juan', apellidos: 'Pérez' },
          fisioterapeuta: { id: 1, nombre: 'Ana', apellidos: 'Silva' },
          tratamiento: 'Fisioterapia General',
          duracion: 60,
          estado: 'CONFIRMADA'
        },
        {
          id: 2,
          fechaHora: '2023-10-16T11:30:00',
          paciente: { id: 2, nombre: 'María', apellidos: 'González' },
          fisioterapeuta: { id: 1, nombre: 'Ana', apellidos: 'Silva' },
          tratamiento: 'Rehabilitación',
          duracion: 45,
          estado: 'CONFIRMADA'
        },
        {
          id: 3,
          fechaHora: '2023-10-17T09:00:00',
          paciente: { id: 3, nombre: 'Carlos', apellidos: 'Rodríguez' },
          fisioterapeuta: { id: 2, nombre: 'Luis', apellidos: 'Martínez' },
          tratamiento: 'Masaje Terapéutico',
          duracion: 30,
          estado: 'CONFIRMADA'
        }
      ];
      
      setCitas(citasSimuladas);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  // Si no hay datos de usuario, no mostrar nada
  if (!userData) {
    return null;
  }

  // Horas de trabajo (8:00 - 20:00)
  const workingHours = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <SidebarMenu>
      {/* Header con título y botones */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Agenda de Citas
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/citas/nueva')}
        >
          Nueva Cita
        </Button>
      </Box>
      
      {/* Control de navegación de semanas */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        bgcolor: '#f5f5f5',
        p: 2,
        borderRadius: 2
      }}>
        <Button 
          startIcon={<ChevronLeft />}
          onClick={goToPreviousWeek}
        >
          Semana Anterior
        </Button>
        
        <Typography variant="h6">
          {weekDates.length > 0 ? (
            `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`
          ) : 'Cargando...'}
        </Typography>
        
        <Button 
          endIcon={<ChevronRight />}
          onClick={goToNextWeek}
        >
          Semana Siguiente
        </Button>
      </Box>
      
      {/* Vista del calendario por semana */}
      {!isMobile ? (
        // Vista de escritorio: calendario semanal
        <Grid container spacing={1} sx={{ mb: 4 }}>
          {weekDates.map((date, index) => (
            <Grid key={date} item xs={12/7}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 1, 
                bgcolor: isToday(date) ? 'primary.light' : '#f5f5f5',
                color: isToday(date) ? 'white' : 'inherit',
                borderRadius: '4px 4px 0 0',
                fontWeight: 'bold'
              }}>
                {formatDate(date).split(',')[0]}
              </Box>
              <Paper sx={{ 
                height: 'calc(100vh - 300px)', 
                overflow: 'auto',
                p: 1,
                boxShadow: 'none',
                border: '1px solid #eee'
              }}>
                {loading ? (
                  <Typography align="center" sx={{ py: 2 }}>Cargando...</Typography>
                ) : citas.filter(cita => cita.fechaHora.startsWith(date)).length > 0 ? (
                  citas.filter(cita => cita.fechaHora.startsWith(date)).map(cita => (
                    <Card 
                      key={cita.id} 
                      sx={{ 
                        mb: 1, 
                        boxShadow: 2,
                        '&:hover': {
                          boxShadow: 4,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => navigate(`/citas/${cita.id}`)}
                    >
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Typography>
                        <Typography variant="body2">
                          {cita.paciente.nombre} {cita.paciente.apellidos}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                          {cita.tratamiento}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography align="center" color="textSecondary" sx={{ py: 2 }}>
                    No hay citas
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Vista móvil: lista de citas por día
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="day-select-label">Día</InputLabel>
            <Select
              labelId="day-select-label"
              value={weekDates.length > 0 ? weekDates[0] : ''}
              label="Día"
            >
              {weekDates.map(date => (
                <MenuItem key={date} value={date}>
                  {formatDate(date)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Typography align="center" sx={{ py: 2 }}>Cargando...</Typography>
            ) : citas.length > 0 ? (
              citas.map(cita => (
                <Card 
                  key={cita.id} 
                  sx={{ 
                    mb: 2, 
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => navigate(`/citas/${cita.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(cita.fechaHora.split('T')[0])}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {cita.paciente.nombre} {cita.paciente.apellidos}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {cita.tratamiento} - {cita.duracion} min
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fisioterapeuta: {cita.fisioterapeuta.nombre} {cita.fisioterapeuta.apellidos}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography align="center" color="textSecondary" sx={{ py: 2 }}>
                No hay citas programadas para esta semana
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </SidebarMenu>
  );
};

export default Citas; 