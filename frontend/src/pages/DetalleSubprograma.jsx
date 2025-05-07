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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
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
                onSave={handleSaveSubprograma}
                onCancel={handleCancelEdit}
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
                    label={`Ejercicios (${ejercicios.length})`} 
                    id="tab-2" 
                    aria-controls="tabpanel-2" 
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
              
              {/* Pestaña de Ejercicios */}
              <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Ejercicios asignados
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
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        No hay ejercicios asignados a este subprograma.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/programas-personalizados/subprogramas/${subprogramaId}/agregar-ejercicios`)}
                        sx={{ mt: 1 }}
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
            </>
          )}
        </Box>
      </Container>
      
      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
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