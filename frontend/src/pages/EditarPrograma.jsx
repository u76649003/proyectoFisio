import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Divider,
  FormControl,
  Autocomplete,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  FitnessCenter,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { programasPersonalizadosService, authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import SubprogramaFormMultimedia from '../components/SubprogramaFormMultimedia';
import SubprogramaMultimediaViewer from '../components/SubprogramaMultimediaViewer';

// Tipos de programas predefinidos
const TIPOS_PROGRAMA = [
  'ATM',
  'Bruxismo',
  'Cervicalgia',
  'Lumbalgia',
  'Hombro',
  'Cadera',
  'Rodilla',
  'Tobillo',
  'Hipopresivos',
  'Suelo Pélvico',
  'Post-parto',
  'Otro'
];

const EditarPrograma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [programaData, setProgramaData] = useState({
    nombre: '',
    tipoPrograma: '',
    descripcion: ''
  });
  
  const [subprogramas, setSubprogramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });

  // Estados para subprogramas
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subprogramaToDelete, setSubprogramaToDelete] = useState(null);
  const [selectedSubprograma, setSelectedSubprograma] = useState(null);
  const [openSubprogramaDetail, setOpenSubprogramaDetail] = useState(false);
  const [editingSubprograma, setEditingSubprograma] = useState(false);
  const [subprogramaData, setSubprogramaData] = useState({
    nombre: '',
    descripcion: '',
    orden: 0
  });

  // Verificar permisos
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

  // Cargar datos del programa y subprogramas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programaData, subprogramasData] = await Promise.all([
          programasPersonalizadosService.getProgramaById(id),
          programasPersonalizadosService.getSubprogramasByProgramaId(id)
        ]);
        
        setProgramaData({
          nombre: programaData.nombre || '',
          tipoPrograma: programaData.tipoPrograma || '',
          descripcion: programaData.descripcion || ''
        });
        
        setSubprogramas(subprogramasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
        setNotification({ open: true, message: 'Error al cargar los datos', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgramaData({
      ...programaData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!programaData.nombre.trim()) {
      newErrors.nombre = 'El nombre del programa es obligatorio';
    }
    
    if (!programaData.tipoPrograma.trim()) {
      newErrors.tipoPrograma = 'El tipo de programa es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await programasPersonalizadosService.updatePrograma(id, programaData);
      
      setSuccess(true);
      setNotification({
        open: true,
        message: 'Programa actualizado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al actualizar programa:', err);
      setError('No se pudo actualizar el programa. Inténtalo de nuevo más tarde.');
      setNotification({
        open: true,
        message: 'Error al actualizar el programa',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Manejadores para subprogramas
  const handleOpenNewDialog = () => {
    setSubprogramaData({
      nombre: '',
      descripcion: '',
      orden: subprogramas.length + 1
    });
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  const handleSaveSubprograma = async (data) => {
    try {
      const subprogramaToCreate = {
        ...data,
        programaPersonalizadoId: id
      };
      
      const newSubprograma = await programasPersonalizadosService.createSubprograma(id, subprogramaToCreate);
      setSubprogramas([...subprogramas, newSubprograma]);
      
      handleCloseNewDialog();
      setNotification({
        open: true,
        message: 'Subprograma creado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al crear subprograma:', err);
      setNotification({
        open: true,
        message: 'Error al crear el subprograma',
        severity: 'error'
      });
    }
  };

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
      setSubprogramas(subprogramas.filter(s => s.id !== subprogramaToDelete.id));
      handleCloseDeleteDialog();
      setNotification({
        open: true,
        message: 'Subprograma eliminado correctamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error al eliminar subprograma:', err);
      setNotification({
        open: true,
        message: 'Error al eliminar el subprograma',
        severity: 'error'
      });
    }
  };

  const handleViewSubprograma = (subprograma) => {
    setSelectedSubprograma(subprograma);
    setOpenSubprogramaDetail(true);
  };

  const handleEditSubprograma = (subprograma) => {
    setSelectedSubprograma(subprograma);
    setEditingSubprograma(true);
    setOpenSubprogramaDetail(true);
  };

  const handleCloseSubprogramaDetail = () => {
    setOpenSubprogramaDetail(false);
    setSelectedSubprograma(null);
    setEditingSubprograma(false);
  };

  const handleSaveSubprogramaEdit = async (data) => {
    try {
      const updatedSubprograma = await programasPersonalizadosService.updateSubprograma(selectedSubprograma.id, data);
      setSubprogramas(subprogramas.map(sp => 
        sp.id === selectedSubprograma.id ? updatedSubprograma : sp
      ));
      setNotification({
        open: true,
        message: 'Subprograma actualizado correctamente',
        severity: 'success'
      });
      handleCloseSubprogramaDetail();
    } catch (err) {
      console.error('Error al actualizar subprograma:', err);
      setNotification({
        open: true,
        message: 'Error al actualizar el subprograma',
        severity: 'error'
      });
    }
  };

  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
              {loading ? 'Cargando...' : programaData.nombre}
            </Typography>
          </Box>

          <Paper sx={{ p: 3, mb: 3 }}>
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
                  onClick={() => navigate(`/programas-personalizados/${id}/compartir`)}
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
                  disabled
                  sx={{ p: 2, justifyContent: 'flex-start' }}
                >
                  Editar programa
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Programa actualizado correctamente
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Información del programa
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre del programa"
                      name="nombre"
                      value={programaData.nombre}
                      onChange={handleChange}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      required
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.tipoPrograma}>
                      <Autocomplete
                        options={TIPOS_PROGRAMA}
                        value={programaData.tipoPrograma}
                        onChange={(event, newValue) => {
                          setProgramaData({
                            ...programaData,
                            tipoPrograma: newValue || ''
                          });
                          if (errors.tipoPrograma) {
                            setErrors({
                              ...errors,
                              tipoPrograma: null
                            });
                          }
                        }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tipo de programa"
                            error={!!errors.tipoPrograma}
                            helperText={errors.tipoPrograma}
                            required
                            disabled={saving}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      name="descripcion"
                      value={programaData.descripcion}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Describe en qué consiste este programa y para qué tipo de pacientes está indicado"
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={saving}
                        startIcon={<SaveIcon />}
                      >
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
        </Box>

        {/* --- GESTIÓN DE SUBPROGRAMAS --- */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Subprogramas</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenNewDialog}
            >
              Añadir Subprograma
            </Button>
          </Box>
          {subprogramas.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
              No hay subprogramas añadidos aún.
            </Typography>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {subprogramas.map((subprograma, index) => (
                <ListItem
                  key={subprograma.id}
                  disablePadding
                  sx={{
                    mb: 1.5,
                    borderRadius: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    bgcolor: theme.palette.background.paper,
                    position: 'relative'
                  }}
                >
                  <ListItemButton
                    onClick={() => handleViewSubprograma(subprograma)}
                    sx={{ borderRadius: 1, pr: '100px' }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          mr: 1
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {subprograma.nombre}
                        </Typography>
                      }
                      secondary={
                        subprograma.descripcion ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {subprograma.descripcion}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Sin descripción
                          </Typography>
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={e => {
                            e.stopPropagation();
                            handleViewSubprograma(subprograma);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditSubprograma(subprograma);
                          }}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenDeleteDialog(subprograma);
                          }}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Diálogo para nuevo subprograma */}
        <Dialog
          open={openNewDialog}
          onClose={handleCloseNewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Nuevo Subprograma</DialogTitle>
          <DialogContent>
            <SubprogramaFormMultimedia
              onSubmit={handleSaveSubprograma}
              onCancel={handleCloseNewDialog}
              programaId={id}
              subprogramaData={subprogramaData}
              onSubprogramaDataChange={(data) => setSubprogramaData(data)}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo para ver/editar subprograma */}
        <Dialog
          open={openSubprogramaDetail}
          onClose={handleCloseSubprogramaDetail}
          maxWidth="md"
          fullWidth
        >
          {selectedSubprograma && (
            <>
              <DialogTitle>
                {editingSubprograma ? 'Editar Subprograma' : selectedSubprograma.titulo}
              </DialogTitle>
              <DialogContent>
                {editingSubprograma ? (
                  <SubprogramaFormMultimedia
                    onSubmit={handleSaveSubprogramaEdit}
                    onCancel={handleCloseSubprogramaDetail}
                    programaId={id}
                    subprograma={selectedSubprograma}
                  />
                ) : (
                  <SubprogramaMultimediaViewer
                    subprograma={selectedSubprograma}
                    onClose={handleCloseSubprogramaDetail}
                    onEdit={() => setEditingSubprograma(true)}
                    onDelete={() => {
                      handleCloseSubprogramaDetail();
                      handleOpenDeleteDialog(selectedSubprograma);
                    }}
                  />
                )}
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Diálogo de confirmación para eliminar subprograma */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar este subprograma? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button onClick={handleDeleteSubprograma} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </SidebarMenu>
  );
};

export default EditarPrograma; 