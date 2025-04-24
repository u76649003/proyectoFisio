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
  Toolbar,
  Snackbar
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
import { authService, empresaService, usuarioService, salaService } from '../services/api';
import { EmpresaLogo } from '../components';
import SidebarMenu from '../components/SidebarMenu';
import { CircularProgress } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

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

// Datos dummy para salas
const SALAS_DUMMY = [
  { id: 1, nombre: 'Sala 1', capacidad: 2 },
  { id: 2, nombre: 'Sala 2', capacidad: 1 },
  { id: 3, nombre: 'Sala 3', capacidad: 3 }
];

// Datos dummy para servicios
const SERVICIOS_DUMMY = [
  { id: 1, nombre: 'Fisioterapia General', duracion: 60, precio: 50 },
  { id: 2, nombre: 'Fisioterapia Deportiva', duracion: 45, precio: 60 },
  { id: 3, nombre: 'Masaje Terapéutico', duracion: 30, precio: 40 }
];

const OrganizarClinica = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(new Date());
  const [selectedSala, setSelectedSala] = useState('');
  const [salas, setSalas] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [filteredProfesionales, setFilteredProfesionales] = useState([]);
  const [loading, setLoading] = useState(false);
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
    especialidad: '',
    disponibilidadHoraria: [],
    activo: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Estados para los diferentes tipos de datos
  const [servicios, setServicios] = useState([]);

  // Verificar si el usuario puede gestionar personal
  const puedeGestionarPersonal = 
    userData?.rol === 'ADMINISTRADOR' || 
    userData?.rol === 'DUEÑO';
  
  // Verificar si el usuario puede gestionar recepcionistas
  const puedeGestionarRecepcionistas = 
    userData?.rol === 'DUEÑO';

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  // Cargar profesionales al iniciar
  useEffect(() => {
    if (userData && userData.empresaId) {
      loadProfesionales();
      loadSalas();
    }
  }, [userData]);

  // Función para cargar profesionales
  const loadProfesionales = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getUsuariosByEmpresa(userData.empresaId);
      const profesionalesFiltrados = response.filter(user => 
        user.rol === 'FISIOTERAPEUTA' || user.rol === 'RECEPCIONISTA'
      );
      setProfesionales(profesionalesFiltrados);
      setFilteredProfesionales(profesionalesFiltrados);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
      showSnackbar('Error al cargar profesionales', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar salas
  const loadSalas = async () => {
    try {
      setLoading(true);
      const response = await salaService.getSalasByEmpresa(userData.empresaId);
      setSalas(response);
    } catch (error) {
      console.error('Error al cargar salas:', error);
      showSnackbar('Error al cargar salas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros de búsqueda y rol
  const applyFilters = (data, term, rol) => {
    let filtered = data;
    
    // Filtrar por término de búsqueda
    if (term.trim()) {
      const searchTermLower = term.toLowerCase();
      filtered = filtered.filter(
        prof => 
          prof.nombre?.toLowerCase().includes(searchTermLower) ||
          prof.apellidos?.toLowerCase().includes(searchTermLower) ||
          prof.email?.toLowerCase().includes(searchTermLower) ||
          prof.numeroColegiado?.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filtrar por rol
    if (rol !== 'TODOS') {
      filtered = filtered.filter(prof => prof.rol === rol);
    }
    
    setFilteredProfesionales(filtered);
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    applyFilters(profesionales, newSearchTerm, filtroRol);
  };

  // Manejar cambios en el filtro de rol
  const handleRolFilterChange = (e) => {
    const newRol = e.target.value;
    setFiltroRol(newRol);
    applyFilters(profesionales, searchTerm, newRol);
  };

  // Mostrar snackbar con mensaje
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Cambiar de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abrir diálogo para nuevo profesional
  const handleOpenNewDialog = () => {
    setFormData({
      id: null,
      nombre: '',
      apellidos: '',
      email: '',
      password: '',
      telefono: '',
      dni: '',
      rol: 'FISIOTERAPEUTA',
      numeroColegiado: '',
      especialidad: '',
      disponibilidadHoraria: [],
      activo: true
    });
    setErrors({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar profesional
  const handleOpenEditDialog = (profesional) => {
    setFormData({
      id: profesional.id,
      nombre: profesional.nombre || '',
      apellidos: profesional.apellidos || '',
      email: profesional.email || '',
      password: '', // No mostramos la contraseña existente
      telefono: profesional.telefono || '',
      dni: profesional.dni || '',
      rol: profesional.rol || 'FISIOTERAPEUTA',
      numeroColegiado: profesional.numeroColegiado || '',
      especialidad: profesional.especialidad || '',
      disponibilidadHoraria: profesional.disponibilidadHoraria || [],
      activo: profesional.activo !== false // true por defecto si no viene especificado
    });
    setSelectedProfesional(profesional);
    setErrors({});
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error si el usuario está corrigiendo el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria para nuevos usuarios';
    }
    
    if (!formData.rol) {
      newErrors.rol = 'El rol es obligatorio';
    } else if (formData.rol === 'FISIOTERAPEUTA' && !formData.numeroColegiado.trim()) {
      newErrors.numeroColegiado = 'El número de colegiado es obligatorio para fisioterapeutas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const usuarioData = {
        ...formData,
        empresaId: userData.empresaId
      };
      
      // Si estamos editando, no enviamos la contraseña a menos que se haya cambiado
      if (isEditing && !formData.password) {
        delete usuarioData.password;
      }
      
      if (isEditing) {
        await usuarioService.updateUsuario(formData.id, usuarioData);
        setProfesionales(prev => 
          prev.map(p => p.id === formData.id ? { ...p, ...usuarioData } : p)
        );
        showSnackbar('Profesional actualizado correctamente');
      } else {
        const newUser = await usuarioService.createUsuario(usuarioData);
        setProfesionales(prev => [...prev, newUser]);
        showSnackbar('Profesional creado correctamente');
      }
      
      handleCloseDialog();
      // Aplicar filtros después de actualizar la lista
      applyFilters(profesionales, searchTerm, filtroRol);
    } catch (error) {
      console.error('Error al guardar el profesional:', error);
      showSnackbar('Error al guardar el profesional', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar profesional
  const handleDeleteProfesional = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este profesional?')) {
      try {
        setLoading(true);
        await usuarioService.deleteUsuario(id);
        setProfesionales(prev => prev.filter(p => p.id !== id));
        // Aplicar filtros después de actualizar la lista
        applyFilters(profesionales.filter(p => p.id !== id), searchTerm, filtroRol);
        showSnackbar('Profesional eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar el profesional:', error);
        showSnackbar('Error al eliminar el profesional', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

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
              onClick={handleOpenNewDialog}
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
            variant={tabValue === 0 ? 'contained' : 'text'} 
            onClick={() => setTabValue(0)}
            startIcon={<People />}
          >
            Personal
          </Button>
          <Button 
            variant={tabValue === 1 ? 'contained' : 'text'} 
            onClick={() => setTabValue(1)}
            startIcon={<Room />}
          >
            Salas
          </Button>
          <Button 
            variant={tabValue === 2 ? 'contained' : 'text'} 
            onClick={() => setTabValue(2)}
            startIcon={<MedicalServices />}
          >
            Servicios
          </Button>
        </Stack>
      </Box>
      
      {/* Contenido de las pestañas */}
      <Box sx={{ mt: 3 }}>
        {/* Pestaña: PERSONAL */}
        {tabValue === 0 && (
          <>
            {/* Filtros y búsqueda */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Buscar por nombre, email, nº colegiado..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, minWidth: '250px' }}
              />
              <FormControl sx={{ minWidth: '200px' }}>
                <InputLabel>Filtrar por rol</InputLabel>
                <Select
                  value={filtroRol}
                  onChange={handleRolFilterChange}
                  label="Filtrar por rol"
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="FISIOTERAPEUTA">Fisioterapeutas</MenuItem>
                  <MenuItem value="RECEPCIONISTA">Recepcionistas</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {/* Lista de profesionales */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Nº Colegiado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProfesionales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No se encontraron profesionales
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfesionales.map((prof) => (
                        <TableRow key={prof.id}>
                          <TableCell>
                            {prof.nombre} {prof.apellidos}
                          </TableCell>
                          <TableCell>{prof.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={prof.rol === 'FISIOTERAPEUTA' ? 'Fisioterapeuta' : 'Recepcionista'} 
                              color={prof.rol === 'FISIOTERAPEUTA' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{prof.numeroColegiado || '-'}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenEditDialog(prof)}
                              title="Editar"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteProfesional(prof.id)}
                              title="Eliminar"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        
        {/* Pestaña: SALAS */}
        {tabValue === 1 && (
          <Box>
            {/* Aquí iría el contenido de la pestaña de salas */}
            <Typography variant="h6">Gestión de Salas</Typography>
            
            {/* Lista de salas */}
            {salas.length > 0 ? (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {salas.map(sala => (
                  <Grid item xs={12} sm={6} md={4} key={sala.id}>
                    <Card>
                      <CardHeader 
                        title={sala.nombre}
                        subheader={`Capacidad: ${sala.capacidad || 1} personas`}
                        action={
                          <IconButton onClick={() => navigate(`/organizar-clinica/salas/editar/${sala.id}`)}>
                            <EditIcon />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {sala.descripcion || 'Sin descripción'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay salas configuradas. Crea una nueva sala para empezar.
              </Alert>
            )}
          </Box>
        )}
        
        {/* Pestaña: SERVICIOS */}
        {tabValue === 2 && (
          <Box>
            {/* Aquí iría el contenido de la pestaña de servicios */}
            <Typography variant="h6">Gestión de Servicios</Typography>
            
            {servicios.length > 0 ? (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Mapeo de servicios */}
              </Grid>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay servicios configurados. Crea un nuevo servicio para empezar.
              </Alert>
            )}
          </Box>
        )}
      </Box>
      
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI/NIE"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
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

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default OrganizarClinica; 