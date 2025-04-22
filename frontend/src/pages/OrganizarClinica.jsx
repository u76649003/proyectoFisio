import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemAvatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Chip,
  Stack,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Tooltip,
  Alert,
  Container,
  AppBar,
  Toolbar
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
  MedicalServices,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalHospital,
  CalendarMonth,
  People,
  BarChart,
  Room,
  PersonAdd
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { authService, empresaService, usuarioService } from '../services/api';
import { EmpresaLogo } from '../components';
import SidebarMenu from '../components/SidebarMenu';
import { CircularProgress } from '@mui/material';
import { Tabs } from '@mui/material';

// Componentes estilizados (reutilizados del Dashboard)
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

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: theme.palette.background.paper,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SpecialtyChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

// Lista de especialidades de fisioterapia
const ESPECIALIDADES = [
  'Fisioterapia General',
  'Fisioterapia Deportiva',
  'Fisioterapia Neurológica',
  'Fisioterapia Pediátrica',
  'Fisioterapia Geriátrica',
  'Fisioterapia Respiratoria',
  'Fisioterapia Traumatológica',
  'Fisioterapia Reumatológica',
  'Terapia Manual',
  'Osteopatía',
  'Rehabilitación',
  'Otro'
];

const OrganizarClinica = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [empresaData, setEmpresaData] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [filteredProfesionales, setFilteredProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    dni: '',
    rol: 'FISIOTERAPEUTA',
    numeroColegiado: '',
    especialidad: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filtroRol, setFiltroRol] = useState('TODOS');
  
  // Estados para los diferentes tipos de datos
  const [salas, setSalas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Datos simulados para la demostración
  const salasDummy = [
    { id: 1, nombre: 'Sala de Fisioterapia 1', capacidad: 2, equipamiento: 'Camilla, Máquina de ultrasonido', estado: 'DISPONIBLE' },
    { id: 2, nombre: 'Sala de Rehabilitación', capacidad: 4, equipamiento: 'Barras paralelas, Pesas, Colchonetas', estado: 'DISPONIBLE' },
    { id: 3, nombre: 'Consulta 1', capacidad: 1, equipamiento: 'Camilla, Escritorio, Sillas', estado: 'OCUPADA' }
  ];
  
  const serviciosDummy = [
    { id: 1, nombre: 'Fisioterapia General', duracion: 60, precio: 50, descripcion: 'Sesión de fisioterapia general para tratamiento de dolencias musculares.' },
    { id: 2, nombre: 'Masaje Terapéutico', duracion: 45, precio: 40, descripcion: 'Masaje para aliviar tensiones y mejorar la circulación.' },
    { id: 3, nombre: 'Rehabilitación Deportiva', duracion: 90, precio: 70, descripcion: 'Rehabilitación especializada para deportistas.' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    console.log("OrganizarClinica - Componente montado");
    
    // Comprobar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      console.log("OrganizarClinica - Usuario no autenticado, redirigiendo a inicio");
      navigate('/');
      return;
    }
    
    // Obtener datos del usuario
    const user = authService.getCurrentUser();
    console.log("OrganizarClinica - Usuario actual:", user);
    
    if (!user) {
      console.log("OrganizarClinica - No se pudo obtener datos del usuario");
      authService.logout();
      navigate('/');
      return;
    }
    
    setUserData(user);
    
    // Obtener datos de la empresa
    if (user.empresaId) {
      fetchEmpresaData(user.empresaId);
      // Cargar profesionales (fisioterapeutas) de la empresa
      fetchProfesionales(user.empresaId);
      // Cargar salas (simulado por ahora)
      setSalas(salasDummy);
      // Cargar servicios (simulado por ahora)
      setServicios(serviciosDummy);
    }
  }, [navigate]);

  const fetchEmpresaData = async (empresaId) => {
    try {
      const data = await empresaService.getEmpresaById(empresaId);
      console.log("OrganizarClinica - Datos de empresa recibidos:", data);
      setEmpresaData(data);
    } catch (error) {
      console.error("Error al obtener datos de la empresa:", error);
    }
  };

  const fetchProfesionales = async (empresaId) => {
    try {
      console.log("Obteniendo profesionales para empresa:", empresaId);
      const response = await usuarioService.getUsuariosByEmpresa(empresaId);
      
      // Filtrar solo fisioterapeutas y recepcionistas
      const filteredUsers = response.filter(user => 
        user.rol === 'FISIOTERAPEUTA' || user.rol === 'RECEPCIONISTA'
      );
      
      console.log("Profesionales obtenidos:", filteredUsers);
      setProfesionales(filteredUsers);
      setFilteredProfesionales(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
      setLoading(false);
    }
  };

  // Efecto para filtrar profesionales según búsqueda y filtro de rol
  useEffect(() => {
    if (!profesionales) return;
    
    let filtered = [...profesionales];
    
    // Filtrar por rol si no es "TODOS"
    if (filtroRol !== 'TODOS') {
      filtered = filtered.filter(prof => prof.rol === filtroRol);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(prof => 
        prof.nombre?.toLowerCase().includes(search) || 
        prof.apellidos?.toLowerCase().includes(search) ||
        prof.email?.toLowerCase().includes(search) ||
        (prof.especialidad && prof.especialidad.toLowerCase().includes(search))
      );
    }
    
    setFilteredProfesionales(filtered);
  }, [searchTerm, filtroRol, profesionales]);

  // Determinar si el usuario actual puede añadir fisioterapeutas
  const puedeAñadirFisioterapeutas = userData?.rol === 'DUENO' || userData?.rol === 'ADMINISTRADOR' || userData?.rol === 'RECEPCIONISTA';
  
  // Determinar si el usuario actual puede gestionar recepcionistas
  // Solo DUEÑO o ADMINISTRADOR pueden gestionar recepcionistas
  const puedeGestionarRecepcionistas = userData?.rol === 'DUENO' || userData?.rol === 'ADMINISTRADOR';

  // Determinar si el usuario actual puede añadir/editar/eliminar cualquier tipo de personal
  const puedeGestionarPersonal = puedeAñadirFisioterapeutas || puedeGestionarRecepcionistas;

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenDialog = (profesional = null) => {
    if (profesional) {
      // Edición de un profesional existente
      
      // Verificar si el usuario actual puede editar este tipo de profesional
      if (profesional.rol === 'RECEPCIONISTA' && !puedeGestionarRecepcionistas) {
        alert("No tienes permisos para editar recepcionistas. Solo el dueño de la clínica puede gestionar recepcionistas.");
        return;
      }

      // Si es FISIOTERAPEUTA quien intenta editar, no permitirlo
      if (userData?.rol === 'FISIOTERAPEUTA') {
        alert("No tienes permisos para editar personal de la clínica.");
        return;
      }
      
      setFormData({
        id: profesional.id,
        nombre: profesional.nombre || '',
        apellidos: profesional.apellidos || '',
        email: profesional.email || '',
        password: '', // No mostrar contraseña por seguridad
        telefono: profesional.telefono || '',
        dni: profesional.dni || '',
        rol: profesional.rol || 'FISIOTERAPEUTA',
        numeroColegiado: profesional.numeroColegiado || '',
        especialidad: profesional.especialidad || ''
      });
      setSelectedProfesional(profesional);
      setIsEditing(true);
    } else {
      // Creación de un nuevo profesional

      // Si es FISIOTERAPEUTA quien intenta crear, no permitirlo
      if (userData?.rol === 'FISIOTERAPEUTA') {
        alert("No tienes permisos para añadir personal a la clínica.");
        return;
      }
      
      // Para recepcionistas, solo pueden crear fisioterapeutas
      const defaultRol = 'FISIOTERAPEUTA';
      
      setFormData({
        id: null,
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        telefono: '',
        dni: '',
        rol: defaultRol,
        numeroColegiado: '',
        especialidad: ''
      });
      setSelectedProfesional(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido";
    }
    
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria para nuevos usuarios";
    }
    
    // Validación condicional según el rol
    if (formData.rol === 'FISIOTERAPEUTA') {
      if (!formData.numeroColegiado.trim()) {
        newErrors.numeroColegiado = "El número de colegiado es obligatorio para fisioterapeutas";
      }
      
      if (!formData.especialidad) {
        newErrors.especialidad = "La especialidad es obligatoria para fisioterapeutas";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Preparar datos para envío
    const profesionalData = {
      ...formData,
      empresaId: userData.empresaId
    };
    
    try {
      if (isEditing && selectedProfesional) {
        // Actualizar profesional existente
        await usuarioService.updateUsuario(selectedProfesional.id, profesionalData);
      } else {
        // Crear nuevo profesional
        await usuarioService.createUsuario(profesionalData);
      }
      
      // Cerrar diálogo y recargar datos
      handleCloseDialog();
      fetchProfesionales(userData.empresaId);
    } catch (error) {
      console.error("Error al guardar profesional:", error);
      // Mostrar error general
      setErrors(prev => ({
        ...prev,
        general: "Error al guardar: " + (error.message || "Inténtelo de nuevo")
      }));
    }
  };

  const handleDeleteProfesional = async (id, rol) => {
    // Verificar si el usuario puede eliminar este tipo de profesional
    if (rol === 'RECEPCIONISTA' && !puedeGestionarRecepcionistas) {
      alert("No tienes permisos para eliminar recepcionistas. Solo el dueño de la clínica puede gestionar recepcionistas.");
      return;
    }
    
    // Si es FISIOTERAPEUTA quien intenta eliminar, no permitirlo
    if (userData?.rol === 'FISIOTERAPEUTA') {
      alert("No tienes permisos para eliminar personal de la clínica.");
      return;
    }
    
    // Confirmar antes de eliminar
    if (window.confirm(`¿Está seguro que desea eliminar a este ${rol === 'FISIOTERAPEUTA' ? 'fisioterapeuta' : 'recepcionista'}?`)) {
      try {
        await usuarioService.deleteUsuario(id);
        // Recargar la lista
        fetchProfesionales(userData.empresaId);
      } catch (error) {
        console.error("Error al eliminar profesional:", error);
        alert("No se pudo eliminar el profesional. Inténtelo de nuevo.");
      }
    }
  };

  const handleFiltroRolChange = (event) => {
    setFiltroRol(event.target.value);
  };

  // Si no hay datos de usuario, mostrar mensaje de carga
  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Cargando...</Typography>
      </Box>
    );
  }

  return (
    <SidebarMenu>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Organizar Clínica
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {puedeGestionarPersonal && (
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog()}
            >
              Añadir Personal
            </Button>
          )}
          <Button 
            variant="outlined"
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/organizar-clinica/salas/nueva')}
          >
            Nueva Sala
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/organizar-clinica/servicios/nuevo')}
          >
            Nuevo Servicio
          </Button>
        </Box>
      </Box>
      
      {/* Pestañas de navegación */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant={activeTab === 0 ? 'contained' : 'text'} 
            onClick={() => setActiveTab(0)}
            startIcon={<People />}
          >
            Personal
          </Button>
          <Button 
            variant={activeTab === 1 ? 'contained' : 'text'} 
            onClick={() => setActiveTab(1)}
            startIcon={<Room />}
          >
            Salas
          </Button>
          <Button 
            variant={activeTab === 2 ? 'contained' : 'text'} 
            onClick={() => setActiveTab(2)}
            startIcon={<MedicalServices />}
          >
            Servicios
          </Button>
        </Stack>
      </Box>
      
      {/* Buscador */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={activeTab === 0 ? "Buscar personal..." : activeTab === 1 ? "Buscar salas..." : "Buscar servicios..."}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: activeTab === 0 && (
              <InputAdornment position="end">
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={filtroRol}
                    onChange={handleFiltroRolChange}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="TODOS">Todos</MenuItem>
                    <MenuItem value="FISIOTERAPEUTA">Fisioterapeutas</MenuItem>
                    <MenuItem value="RECEPCIONISTA">Recepcionistas</MenuItem>
                  </Select>
                </FormControl>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {/* Contenido según la pestaña seleccionada */}
      {activeTab === 0 ? (
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'info.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <People sx={{ mr: 1 }} />
            <Typography variant="h6">Personal de la Clínica</Typography>
          </Box>
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography>Cargando personal...</Typography>
              </Box>
            ) : filteredProfesionales.length > 0 ? (
              <List>
                {filteredProfesionales.map((profesional) => (
                  <React.Fragment key={profesional.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton 
                            color="primary"
                            onClick={() => handleOpenDialog(profesional)}
                            disabled={profesional.rol === 'RECEPCIONISTA' && !puedeGestionarRecepcionistas}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteProfesional(profesional.id, profesional.rol)}
                            disabled={profesional.rol === 'RECEPCIONISTA' && !puedeGestionarRecepcionistas}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: profesional.rol === 'FISIOTERAPEUTA' ? 'secondary.main' : 'info.main'
                        }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${profesional.nombre} ${profesional.apellidos}`}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {profesional.rol === 'FISIOTERAPEUTA' 
                                ? `Fisioterapeuta${profesional.especialidad ? ` - ${profesional.especialidad}` : ''}`
                                : 'Recepcionista'}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                              {profesional.email}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>No se encontró personal con los criterios de búsqueda</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Sección de Salas - visible solo si la pestaña es 'salas' */}
          {activeTab === 1 && (
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: 3,
                overflow: 'hidden',
                height: '100%'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Room sx={{ mr: 1 }} />
                  <Typography variant="h6">Salas Disponibles</Typography>
                </Box>
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {loading ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography>Cargando salas...</Typography>
                    </Box>
                  ) : salas.length > 0 ? (
                    <List>
                      {salas.map((sala) => (
                        <React.Fragment key={sala.id}>
                          <ListItem
                            secondaryAction={
                              <Box>
                                <Button 
                                  size="small"
                                  startIcon={<EditIcon />}
                                  onClick={() => navigate(`/organizar-clinica/salas/${sala.id}`)}
                                >
                                  Editar
                                </Button>
                              </Box>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{ 
                                  bgcolor: sala.estado === 'DISPONIBLE' ? 'success.main' : 'error.main'
                                }}
                              >
                                <Room />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={sala.nombre}
                              secondary={
                                <>
                                  <Typography variant="body2" component="span">
                                    Capacidad: {sala.capacidad} personas
                                  </Typography>
                                  <br />
                                  <Typography 
                                    variant="body2" 
                                    component="span"
                                    color={sala.estado === 'DISPONIBLE' ? 'success.main' : 'error.main'}
                                    sx={{ fontWeight: 'bold' }}
                                  >
                                    {sala.estado}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography>No se encontraron salas</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Sección de Servicios - visible solo si la pestaña es 'servicios' */}
          {activeTab === 2 && (
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: 3,
                overflow: 'hidden',
                height: '100%'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'secondary.main', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <MedicalServices sx={{ mr: 1 }} />
                  <Typography variant="h6">Servicios Ofrecidos</Typography>
                </Box>
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {loading ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography>Cargando servicios...</Typography>
                    </Box>
                  ) : servicios.length > 0 ? (
                    <List>
                      {servicios.map((servicio) => (
                        <React.Fragment key={servicio.id}>
                          <ListItem
                            secondaryAction={
                              <Box>
                                <Button 
                                  size="small"
                                  startIcon={<EditIcon />}
                                  onClick={() => navigate(`/organizar-clinica/servicios/${servicio.id}`)}
                                >
                                  Editar
                                </Button>
                              </Box>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                <MedicalServices />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={servicio.nombre}
                              secondary={
                                <>
                                  <Typography variant="body2" component="span">
                                    Duración: {servicio.duracion} min
                                  </Typography>
                                  <br />
                                  <Typography variant="body2" component="span">
                                    Precio: {servicio.precio} €
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography>No se encontraron servicios</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
      
      {/* Diálogo para añadir/editar personal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar personal' : 'Añadir nuevo personal'}
        </DialogTitle>
        <DialogContent>
          {errors.general && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {errors.general}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleFormChange}
                error={Boolean(errors.apellidos)}
                helperText={errors.apellidos}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password || "La contraseña para el nuevo usuario"}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI/NIE"
                name="dni"
                value={formData.dni}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleFormChange}
                  label="Rol"
                  disabled={!puedeGestionarRecepcionistas} // Solo dueños y admins pueden cambiar a recepcionista
                >
                  <MenuItem value="FISIOTERAPEUTA">Fisioterapeuta</MenuItem>
                  {puedeGestionarRecepcionistas && (
                    <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Campos específicos para fisioterapeutas */}
            {formData.rol === 'FISIOTERAPEUTA' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Colegiado"
                    name="numeroColegiado"
                    value={formData.numeroColegiado}
                    onChange={handleFormChange}
                    error={Boolean(errors.numeroColegiado)}
                    helperText={errors.numeroColegiado}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.especialidad)}>
                    <InputLabel>Especialidad</InputLabel>
                    <Select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleFormChange}
                      label="Especialidad"
                    >
                      {ESPECIALIDADES.map((esp) => (
                        <MenuItem key={esp} value={esp}>{esp}</MenuItem>
                      ))}
                    </Select>
                    {errors.especialidad && (
                      <Typography variant="caption" color="error">
                        {errors.especialidad}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Guardar Cambios' : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sección Informativa - solo visible en las pestañas de salas y servicios */}
      {activeTab !== 0 && (
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            p: 2,
            mt: 2
          }}>
            <Typography variant="h6" gutterBottom>
              Organización de la Clínica
            </Typography>
            <Typography variant="body1" paragraph>
              En esta sección puedes gestionar los aspectos organizativos de tu clínica, incluyendo salas disponibles y servicios ofrecidos.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Room color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Gestión de Salas</Typography>
                </Box>
                <Typography variant="body2">
                  Añade, edita o elimina salas de tu clínica. Puedes especificar su capacidad, equipamiento y disponibilidad.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MedicalServices color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Gestión de Servicios</Typography>
                </Box>
                <Typography variant="body2">
                  Gestiona los servicios que ofrece tu clínica. Define precios, duración y descripción de cada servicio.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}
    </SidebarMenu>
  );
};

export default OrganizarClinica; 