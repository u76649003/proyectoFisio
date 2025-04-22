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
  Tooltip
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
  BarChart
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { authService, empresaService, usuarioService } from '../services/api';
import { EmpresaLogo } from '../components';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    dni: '',
    numeroColegiado: '',
    especialidad: '',
    rol: 'FISIOTERAPEUTA'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

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
    setLoading(true);
    try {
      // En un escenario real, deberíamos filtrar por rol = FISIOTERAPEUTA
      // Por ahora, simulamos que obtenemos los profesionales
      const profesionalesData = await usuarioService.getUsuariosByEmpresa(empresaId);
      
      // Filtramos solo los fisioterapeutas
      const fisioterapeutas = profesionalesData.filter(
        prof => prof.rol === 'FISIOTERAPEUTA'
      );
      
      console.log("Profesionales obtenidos:", fisioterapeutas);
      setProfesionales(fisioterapeutas);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
      // En un escenario de desarrollo, podemos usar datos de ejemplo
      setProfesionales([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar profesionales según término de búsqueda
  const filteredProfesionales = profesionales.filter(prof => 
    prof.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setFormData({
        nombre: profesional.nombre || '',
        apellidos: profesional.apellidos || '',
        email: profesional.email || '',
        password: '', // No mostrar contraseña por seguridad
        telefono: profesional.telefono || '',
        dni: profesional.dni || '',
        numeroColegiado: profesional.numeroColegiado || '',
        especialidad: profesional.especialidad || '',
        rol: 'FISIOTERAPEUTA'
      });
      setSelectedProfesional(profesional);
      setIsEditing(true);
    } else {
      // Creación de un nuevo profesional
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        telefono: '',
        dni: '',
        numeroColegiado: '',
        especialidad: '',
        rol: 'FISIOTERAPEUTA'
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
    
    if (!formData.numeroColegiado.trim()) {
      newErrors.numeroColegiado = "El número de colegiado es obligatorio";
    }
    
    if (!formData.especialidad) {
      newErrors.especialidad = "La especialidad es obligatoria";
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

  const handleDeleteProfesional = async (id) => {
    // Confirmar antes de eliminar (en una implementación real debería haber un diálogo de confirmación)
    if (window.confirm("¿Está seguro que desea eliminar este profesional?")) {
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

  // Si no hay datos de usuario, mostrar mensaje de carga
  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Cargando...</Typography>
      </Box>
    );
  }

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
            onClick={handleToggleSidebar}
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
          
          <MenuListItem button component={Link} to="/citas">
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <Event />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Citas" />}
          </MenuListItem>
          
          {/* Nueva opción: Organizar Clínica (seleccionada) */}
          <MenuListItem button component={Link} to="/organizar-clinica" selected={true}>
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
        {/* Cabecera */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Organizar Clínica
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
            <SearchInput
              placeholder="Buscar profesionales..."
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                borderRadius: '30px',
                whiteSpace: 'nowrap'
              }}
            >
              Añadir Fisioterapeuta
            </Button>
          </Box>
        </Box>
        
        {/* Contenido principal - Lista de fisioterapeutas */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ py: 4 }}>Cargando profesionales...</Typography>
            </Grid>
          ) : filteredProfesionales.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                <LocalHospital sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No hay fisioterapeutas registrados
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Comienza añadiendo nuevos profesionales a tu clínica
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Añadir Fisioterapeuta
                </Button>
              </Paper>
            </Grid>
          ) : (
            // Mostrar tarjetas de fisioterapeutas
            filteredProfesionales.map(profesional => (
              <Grid item xs={12} sm={6} md={4} key={profesional.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}>
                  <CardHeader
                    avatar={
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          width: 60,
                          height: 60
                        }}
                      >
                        {profesional.nombre?.charAt(0)}{profesional.apellidos?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {`${profesional.nombre} ${profesional.apellidos}`}
                      </Typography>
                    }
                    subheader={profesional.especialidad || 'Fisioterapia General'}
                    action={
                      <Box>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleOpenDialog(profesional)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => handleDeleteProfesional(profesional.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Número de colegiado
                      </Typography>
                      <Typography variant="body1">
                        {profesional.numeroColegiado || 'No especificado'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Contacto
                      </Typography>
                      <Typography variant="body1">
                        {profesional.email}
                      </Typography>
                      <Typography variant="body1">
                        {profesional.telefono || 'No especificado'}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge 
                        color="primary" 
                        badgeContent={0} 
                        showZero
                        sx={{ mr: 2 }}
                      >
                        <CalendarMonth color="action" />
                      </Badge>
                      <Typography variant="body2">
                        Citas programadas
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </ContentArea>
      
      {/* Diálogo para crear/editar fisioterapeuta */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing ? 'Editar Fisioterapeuta' : 'Añadir Nuevo Fisioterapeuta'}
        </DialogTitle>
        <DialogContent>
          {errors.general && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errors.general}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleFormChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                required
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
                error={!!errors.email}
                helperText={errors.email}
                required
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
                  error={!!errors.password}
                  helperText={errors.password}
                  required
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
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleFormChange}
                error={!!errors.dni}
                helperText={errors.dni}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de colegiado"
                name="numeroColegiado"
                value={formData.numeroColegiado}
                onChange={handleFormChange}
                error={!!errors.numeroColegiado}
                helperText={errors.numeroColegiado}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.especialidad} required>
                <InputLabel id="especialidad-label">Especialidad</InputLabel>
                <Select
                  labelId="especialidad-label"
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleFormChange}
                  label="Especialidad"
                >
                  {ESPECIALIDADES.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
                </Select>
                {errors.especialidad && (
                  <Typography variant="caption" color="error">
                    {errors.especialidad}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
          >
            {isEditing ? 'Actualizar' : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizarClinica; 