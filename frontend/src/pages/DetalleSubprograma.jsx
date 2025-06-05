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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FitnessCenter,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import SidebarMenu from '../components/SidebarMenu';
import SubprogramaMultimediaViewer from '../components/SubprogramaMultimediaViewer';
import SubprogramaFormMultimedia from '../components/SubprogramaFormMultimedia';
import PasosViewer from '../components/PasosViewer';
import PasoFormMultimedia from '../components/PasoFormMultimedia';
import { programasPersonalizadosService, authService } from '../services/api';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DetalleSubprograma = () => {
  const { programaId, subprogramaId } = useParams();
  const navigate = useNavigate();
  
  const [programa, setPrograma] = useState(null);
  const [subprograma, setSubprograma] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingPaso, setIsCreatingPaso] = useState(false);
  const [editingPaso, setEditingPaso] = useState(null);
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar programa
        const programaData = await programasPersonalizadosService.getProgramaById(programaId);
        setPrograma(programaData);
        
        // Cargar subprograma
        const subprogramaData = await programasPersonalizadosService.getSubprogramaById(subprogramaId);
        setSubprograma(subprogramaData);
        
        // Establecer ejercicios
        if (subprogramaData && subprogramaData.ejercicios) {
          setEjercicios(subprogramaData.ejercicios);
        }
        
        // Cargar pasos del subprograma
        console.log("Cargando pasos del subprograma ID:", subprogramaId);
        const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
        console.log("Pasos cargados:", pasosData);
        setPasos(pasosData);
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (programaId && subprogramaId) {
      cargarDatos();
    }
  }, [programaId, subprogramaId]);
  
  // Cambiar de pestaña
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Iniciar edición
  const handleStartEdit = () => {
    setIsEditing(true);
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // Guardar cambios en el subprograma
  const handleSaveSubprograma = async (data) => {
    try {
      setLoading(true);
      
      // No se necesita establecer programaPersonalizadoId aquí porque 
      // ya está en el subprograma existente
      const updatedSubprograma = await programasPersonalizadosService.updateSubprograma(
        subprogramaId, 
        data
      );
      
      setSubprograma(updatedSubprograma);
      setIsEditing(false);
      
      setNotification({
        open: true,
        message: 'Subprograma actualizado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al actualizar subprograma:', err);
      setNotification({
        open: true,
        message: 'Error al actualizar el subprograma',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Regresar a la vista de programa
  const handleBack = () => {
    navigate(`/programas-personalizados/${programaId}`);
  };
  
  // Manejar creación de un nuevo paso
  const handleCreatePaso = () => {
    setIsCreatingPaso(true);
    setEditingPaso(null);
  };
  
  // Manejar edición de un paso existente
  const handleEditPaso = (paso) => {
    setEditingPaso(paso);
    setIsCreatingPaso(true);
  };
  
  // Cancelar creación/edición de paso
  const handleCancelPaso = () => {
    setIsCreatingPaso(false);
    setEditingPaso(null);
  };
  
  // Guardar un paso (nuevo o editado)
  const handleSavePaso = async (paso, closeAfterSave = true) => {
    try {
      setLoading(true);
      
      // Guardar el paso
      if (editingPaso) {
        // Actualizar paso existente
        await programasPersonalizadosService.updatePaso(paso.id, paso);
      } else {
        // Crear nuevo paso
        await programasPersonalizadosService.createPaso(subprogramaId, paso);
      }
      
      // Recargar los pasos después de guardar
      const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
      setPasos(pasosData);
      
      // Solo cerramos el formulario si se indica explícitamente
      if (closeAfterSave) {
        setIsCreatingPaso(false);
        setEditingPaso(null);
      } else {
        // Si estamos editando un paso, mantenemos el estado de edición
        if (editingPaso) {
          // No hacemos nada, mantenemos el editingPaso actual
          console.log("Manteniendo formulario abierto después de actualizar paso:", paso.id);
        } else {
          // Si es un paso nuevo, limpiamos el estado
          setEditingPaso(null);
        }
        
        // Mostrar una notificación más visible y con duración más larga
        setNotification({
          open: true,
          message: editingPaso ? 'Paso actualizado correctamente. Lista de pasos actualizada.' : 'Paso creado correctamente.',
          severity: 'success',
          autoHideDuration: 4000
        });
        
        return; // No mostrar la notificación normal
      }
      
      setNotification({
        open: true,
        message: editingPaso ? 'Paso actualizado correctamente' : 'Paso creado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al guardar paso:', err);
      setNotification({
        open: true,
        message: 'Error al guardar el paso',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar un paso
  const handleDeletePaso = async (pasoId) => {
    try {
      setLoading(true);
      
      await programasPersonalizadosService.deletePaso(pasoId);
      
      // Recargar los pasos después de eliminar
      const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
      setPasos(pasosData);
      
      setNotification({
        open: true,
        message: 'Paso eliminado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al eliminar paso:', err);
      setNotification({
        open: true,
        message: 'Error al eliminar el paso',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          {/* Encabezado */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box flexGrow={1}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                {loading ? 'Cargando subprograma...' : subprograma?.nombre}
              </Typography>
              {!loading && programa && (
                <Typography variant="subtitle1" color="text.secondary">
                  Programa: {programa.nombre}
                </Typography>
              )}
            </Box>
            
            {!loading && !isEditing && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleStartEdit}
              >
                Editar
              </Button>
            )}
          </Box>
          
          {/* Contenido */}
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : isEditing ? (
            <Paper sx={{ p: 3 }}>
              <SubprogramaFormMultimedia
                subprogramaId={subprogramaId}
                initialData={subprograma}
                pasos={pasos}
                onSave={handleSaveSubprograma}
                onCancel={handleCancelEdit}
                onCreatePaso={handleCreatePaso}
                onEditPaso={handleEditPaso}
                onDeletePaso={handleDeletePaso}
                onSavePaso={handleSavePaso}
                onCancelPaso={handleCancelPaso}
                isCreatingPaso={isCreatingPaso}
                editingPaso={editingPaso}
              />
            </Paper>
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleChangeTab}
                  aria-label="subprograma tabs"
                >
                  <Tab label="Información" id="tab-0" aria-controls="tabpanel-0" />
                  <Tab label="Contenido multimedia" id="tab-1" aria-controls="tabpanel-1" />
                  <Tab 
                    label={`Pasos y Ejercicios (${pasos.length + ejercicios.length})`} 
                    id="tab-2" 
                    aria-controls="tabpanel-2" 
                  />
                  <Tab 
                    label={`Gestión de Pasos (${pasos.length})`} 
                    id="tab-3" 
                    aria-controls="tabpanel-3" 
                  />
                </Tabs>
              </Box>
              
              {/* Pestaña de Información */}
              <TabPanel value={tabValue} index={0}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Detalles del subprograma
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {subprograma.nombre}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Orden
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {subprograma.orden}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Descripción
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {subprograma.descripcion || 'Sin descripción'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>
              
              {/* Pestaña de Contenido Multimedia */}
              <TabPanel value={tabValue} index={1}>
                <SubprogramaMultimediaViewer subprograma={subprograma} />
              </TabPanel>
              
              {/* Pestaña de Pasos y Ejercicios */}
              <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 3 }}>
                  {/* Sección de pasos del ejercicio */}
                  <Box mb={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        Pasos a seguir {pasos && pasos.length > 0 ? `(${pasos.length})` : ''}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePaso}
                      >
                        Añadir paso
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {(!pasos || pasos.length === 0) ? (
                      <Box textAlign="center" py={3}>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          No hay pasos definidos para este subprograma.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={handleCreatePaso}
                        >
                          Crear el primer paso
                        </Button>
                      </Box>
                    ) : (
                      <PasosViewer 
                        pasos={pasos} 
                        onEdit={handleEditPaso}
                        onDelete={handleDeletePaso}
                      />
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  {/* Sección de ejercicios */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Ejercicios asignados {ejercicios && ejercicios.length > 0 ? `(${ejercicios.length})` : ''}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => navigate(`/programas-personalizados/subprogramas/${subprogramaId}/agregar-ejercicios`)}
                    >
                      Agregar ejercicios
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {ejercicios.length === 0 ? (
                    <Box textAlign="center" py={3}>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        No hay ejercicios asignados a este subprograma.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/programas-personalizados/subprogramas/${subprogramaId}/agregar-ejercicios`)}
                      >
                        Agregar el primer ejercicio
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {ejercicios.map((ejercicio, index) => (
                        <ListItem
                          key={ejercicio.id}
                          sx={{
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          <ListItemIcon>
                            <Chip 
                              label={index + 1} 
                              color="primary" 
                              sx={{ width: 32, height: 32 }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={ejercicio.nombre}
                            secondary={
                              <>
                                {ejercicio.descripcion && (
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {ejercicio.descripcion}
                                  </Typography>
                                )}
                                <Box mt={0.5}>
                                  {ejercicio.repeticiones && (
                                    <Chip 
                                      label={`${ejercicio.repeticiones} repeticiones`} 
                                      size="small" 
                                      sx={{ mr: 0.5, mb: 0.5 }} 
                                    />
                                  )}
                                  {ejercicio.duracionSegundos && (
                                    <Chip 
                                      label={`${ejercicio.duracionSegundos}s`} 
                                      size="small" 
                                      sx={{ mr: 0.5, mb: 0.5 }} 
                                    />
                                  )}
                                </Box>
                              </>
                            }
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              // Aquí iría la lógica para remover el ejercicio del subprograma
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </TabPanel>
              
              {/* Pestaña de Gestión de Pasos */}
              <TabPanel value={tabValue} index={3}>
                {isCreatingPaso ? (
                  <Paper sx={{ p: 3 }}>
                    <PasoFormMultimedia
                      pasoId={editingPaso ? editingPaso.id : null}
                      subprogramaId={subprogramaId}
                      initialData={editingPaso}
                      onSave={handleSavePaso}
                      onCancel={handleCancelPaso}
                    />
                  </Paper>
                ) : (
                  <Paper sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        Secuencia de pasos {pasos && pasos.length > 0 ? `(${pasos.length})` : ''}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePaso}
                      >
                        Añadir paso
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {(!pasos || pasos.length === 0) ? (
                      <Box textAlign="center" py={4}>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          No hay pasos definidos para este subprograma.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={handleCreatePaso}
                          sx={{ mt: 1 }}
                        >
                          Crear el primer paso
                        </Button>
                      </Box>
                    ) : (
                      <PasosViewer 
                        pasos={pasos} 
                        onEdit={handleEditPaso}
                        onDelete={handleDeletePaso}
                      />
                    )}
                  </Paper>
                )}
              </TabPanel>
            </>
          )}
        </Box>
      </Container>
      
      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration || 2000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </SidebarMenu>
  );
};

export default DetalleSubprograma; 