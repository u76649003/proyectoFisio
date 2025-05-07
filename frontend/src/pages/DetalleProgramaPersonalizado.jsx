import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FitnessCenter,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { programasPersonalizadosService, authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import SubprogramaFormMultimedia from '../components/SubprogramaFormMultimedia';

const DetalleProgramaPersonalizado = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [programa, setPrograma] = useState(null);
  const [subprogramas, setSubprogramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el diálogo de nuevo subprograma
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [subprogramaData, setSubprogramaData] = useState({
    nombre: '',
    descripcion: '',
    orden: '',
    fechaInicio: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Estado para el diálogo de borrar subprograma
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subprogramaToDelete, setSubprogramaToDelete] = useState(null);
  
  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  
  // Estado para la notificación
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });
  
  // Verificar permisos de usuario
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
      setNotification({ open: true, message: 'No tienes permisos para acceder a esta sección.', severity: 'error' });
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }
  }, [navigate]);
  
  // Cargar datos del programa
  useEffect(() => {
    const loadPrograma = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos del programa
        const programaData = await programasPersonalizadosService.getProgramaById(id);
        setPrograma(programaData);
        
        // Obtener subprogramas
        const subprogramasData = await programasPersonalizadosService.getSubprogramasByProgramaId(id);
        setSubprogramas(subprogramasData);
        
      } catch (err) {
        console.error('Error al cargar programa:', err);
        setError('No se pudo cargar el programa. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadPrograma();
    }
  }, [id]);
  
  // Manejadores para el menú de opciones
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditPrograma = () => {
    handleMenuClose();
    navigate(`/programas-personalizados/editar/${id}`);
  };
  
  const handleCompartirPrograma = () => {
    handleMenuClose();
    navigate(`/programas-personalizados/${id}/compartir`);
  };
  
  // Manejadores para diálogo de nuevo subprograma
  const handleOpenNewDialog = () => {
    setSubprogramaData({
      nombre: '',
      descripcion: '',
      orden: subprogramas.length + 1,
    });
    setFormErrors({});
    setOpenNewDialog(true);
  };
  
  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };
  
  const handleSaveSubprograma = async (data) => {
    try {
      setSubmitting(true);
      
      // Crear subprograma
      const subprogramaToCreate = {
        ...data,
        programaPersonalizadoId: id
      };
      
      const newSubprograma = await programasPersonalizadosService.createSubprograma(id, subprogramaToCreate);
      
      // Si hay archivos para subir, necesitamos hacerlo después de crear el subprograma
      // en el componente SubprogramaFormMultimedia se manejan solo los datos básicos en la creación
      
      // Actualizar lista de subprogramas
      setSubprogramas([...subprogramas, newSubprograma]);
      
      // Cerrar diálogo
      handleCloseNewDialog();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Subprograma creado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al crear subprograma:', err);
      setError('Error al crear el subprograma. Inténtalo de nuevo más tarde.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Manejadores para diálogo de borrar subprograma
  const handleOpenDeleteDialog = (subprograma) => {
    setSubprogramaToDelete(subprograma);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSubprogramaToDelete(null);
  };
  
  const handleDeleteSubprograma = async () => {
    if (!subprogramaToDelete) return;
    
    try {
      await programasPersonalizadosService.deleteSubprograma(subprogramaToDelete.id);
      
      // Actualizar lista de subprogramas
      setSubprogramas(subprogramas.filter(s => s.id !== subprogramaToDelete.id));
      
      // Cerrar diálogo
      handleCloseDeleteDialog();
      
    } catch (err) {
      console.error('Error al eliminar subprograma:', err);
      setError('No se pudo eliminar el subprograma. Inténtalo de nuevo más tarde.');
      handleCloseDeleteDialog();
    }
  };
  
  const handleViewSubprograma = (subprogramaId) => {
    navigate(`/programas-personalizados/${id}/subprograma/${subprogramaId}`);
  };
  
  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          {/* Encabezado */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/programas-personalizados')}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box flexGrow={1}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                {loading ? 'Cargando programa...' : programa?.nombre}
              </Typography>
              {programa?.tipoPrograma && (
                <Chip 
                  label={programa.tipoPrograma} 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              )}
            </Box>
            <IconButton
              onClick={handleMenuClick}
              aria-controls={openMenu ? 'programa-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="programa-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'programa-menu-button',
              }}
            >
              <MenuItem onClick={handleEditPrograma}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Editar programa</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleCompartirPrograma}>
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Compartir con pacientes</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Subprogramas */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Subprogramas
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenNewDialog}
                  >
                    Añadir Subprograma
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {subprogramas.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      No hay subprogramas creados todavía.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Los subprogramas te permiten organizar los ejercicios por días o bloques.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleOpenNewDialog}
                      sx={{ mt: 1 }}
                    >
                      Crear primer subprograma
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {subprogramas.map((subprograma) => (
                      <ListItem
                        key={subprograma.id}
                        disablePadding
                        sx={{
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          }
                        }}
                      >
                        <ListItemButton onClick={() => handleViewSubprograma(subprograma.id)}>
                          <ListItemIcon>
                            <PlayArrowIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={subprograma.nombre}
                            secondary={
                              <Box component="span">
                                {subprograma.descripcion}
                                <Box component="span" sx={{ ml: 1 }}>
                                  <Chip
                                    label={`${subprograma.ejercicios?.length || 0} ejercicios`}
                                    size="small"
                                    color={subprograma.ejercicios?.length ? 'primary' : 'default'}
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            }
                          />
                        </ListItemButton>
                        <ListItemSecondaryAction>
                          <Tooltip title="Eliminar">
                            <IconButton
                              edge="end"
                              onClick={() => handleOpenDeleteDialog(subprograma)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
              
              {/* Sección de acciones rápidas */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Acciones rápidas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={handleCompartirPrograma}
                      sx={{ p: 2, justifyContent: 'flex-start' }}
                    >
                      Compartir con pacientes
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEditPrograma}
                      sx={{ p: 2, justifyContent: 'flex-start' }}
                    >
                      Editar programa
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </Box>
      </Container>
      
      {/* Diálogo para crear nuevo subprograma */}
      <Dialog 
        open={openNewDialog} 
        onClose={handleCloseNewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Añadir nuevo subprograma</DialogTitle>
        <DialogContent>
          <SubprogramaFormMultimedia
            initialData={{
              nombre: '',
              descripcion: '',
              orden: subprogramas.length + 1,
              videoReferencia: '',
              esEnlaceExterno: false,
              imagenesUrls: []
            }}
            onSave={handleSaveSubprograma}
            onCancel={handleCloseNewDialog}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el subprograma "{subprogramaToDelete?.nombre}"?
            Esta acción no se puede deshacer y se eliminarán todos los ejercicios asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteSubprograma} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default DetalleProgramaPersonalizado; 