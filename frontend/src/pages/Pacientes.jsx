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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment
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
  Search as SearchIcon,
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

const Pacientes = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos simulados de pacientes
  const pacientes = [];

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Obtener datos del usuario
    const user = authService.getCurrentUser();
    setUserData(user);
    
    // Aquí se podrían cargar los datos de pacientes desde la API
    // fetchPacientesData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar pacientes según término de búsqueda
  const filteredPacientes = pacientes.filter((paciente) => 
    paciente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente?.telefono?.includes(searchTerm)
  );

  // Si no hay datos de usuario, no mostrar nada
  if (!userData) {
    return null;
  }

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
          
          <MenuListItem button component={Link} to="/pacientes" selected={true}>
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
          flexWrap: 'wrap',
          mb: 4
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: { xs: 2, md: 0 } }}>
            Pacientes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
            <TextField
              placeholder="Buscar paciente..."
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { sm: '300px' } }}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/pacientes/nuevo"
              fullWidth={isMobile}
            >
              Nuevo Paciente
            </Button>
          </Box>
        </Box>

        {/* Tabla de pacientes */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Última visita</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPacientes.length > 0 ? (
                filteredPacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>
                      {paciente.nombre} {paciente.apellidos}
                    </TableCell>
                    <TableCell>{paciente.telefono}</TableCell>
                    <TableCell>{paciente.email}</TableCell>
                    <TableCell>{paciente.ultimaVisita}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        component={Link}
                        to={`/pacientes/${paciente.id}`}
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No hay pacientes registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentArea>
    </Box>
  );
};

export default Pacientes; 