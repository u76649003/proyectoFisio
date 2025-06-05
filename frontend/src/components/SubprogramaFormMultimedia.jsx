import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  FormLabel,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { programasPersonalizadosService } from '../services/api';
import PasosViewer from './PasosViewer';
import PasoFormMultimedia from './PasoFormMultimedia';

// Estilo para la sección de drag & drop
const UploadZone = styled(Paper)(({ theme, isDragActive }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.light
  }
}));

// Componente para vista previa de video
const VideoPreview = ({ url, isExternal, onRemove }) => {
  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      {isExternal ? (
        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            src={url}
            title="Video externo"
            allowFullScreen
          />
        </Box>
      ) : (
        <CardMedia
          component="video"
          controls
          sx={{ minHeight: 200 }}
          src={url}
        />
      )}
      <CardContent sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
            {isExternal ? 'Video externo' : 'Video subido'}
          </Typography>
          <IconButton color="error" onClick={onRemove} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente de panel de pestañas
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
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const SubprogramaFormMultimedia = ({ 
  subprogramaId, 
  initialData, 
  pasos: initialPasos = [],
  onSave,
  onCancel,
  onCreatePaso,
  onEditPaso,
  onDeletePaso,
  onSavePaso,
  onCancelPaso,
  isCreatingPaso: parentIsCreatingPaso,
  editingPaso: parentEditingPaso
}) => {
  const [formData, setFormData] = useState({
    nombre: initialData ? initialData.nombre : '',
    descripcion: initialData ? initialData.descripcion : '',
    orden: initialData ? initialData.orden : (initialData ? initialData.orden : 1),
    videoReferencia: initialData ? initialData.videoReferencia : '',
    esEnlaceExterno: initialData ? initialData.esEnlaceExterno : false
  });
  
  const [videoType, setVideoType] = useState('none');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para gestión de pasos
  const [pasos, setPasos] = useState(initialPasos);
  const [isCreatingPaso, setIsCreatingPaso] = useState(parentIsCreatingPaso || false);
  const [editingPaso, setEditingPaso] = useState(parentEditingPaso || null);
  const [pasoStatusMessage, setPasoStatusMessage] = useState(null);
  
  // Limpiar mensaje de estado después de unos segundos
  useEffect(() => {
    if (pasoStatusMessage) {
      const timer = setTimeout(() => {
        setPasoStatusMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [pasoStatusMessage]);
  
  // Sincronizar estados con props
  useEffect(() => {
    if (parentIsCreatingPaso !== undefined) {
      setIsCreatingPaso(parentIsCreatingPaso);
    }
    if (parentEditingPaso !== undefined) {
      setEditingPaso(parentEditingPaso);
    }
  }, [parentIsCreatingPaso, parentEditingPaso]);
  
  // Cargar datos iniciales si se proporcionan
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        orden: initialData.orden || 1,
        videoReferencia: initialData.videoReferencia || '',
        esEnlaceExterno: initialData.esEnlaceExterno || false
      });
      
      // Configurar tipo de video
      if (initialData.videoReferencia) {
        setVideoType(initialData.esEnlaceExterno ? 'external' : 'upload');
        if (initialData.esEnlaceExterno) {
          setVideoUrl(initialData.videoReferencia);
        }
      }
    }
  }, [initialData]);

  // Actualizar pasos cuando cambian
  useEffect(() => {
    if (initialPasos && initialPasos.length > 0) {
      setPasos(initialPasos);
    }
  }, [initialPasos]);

  // Cargar pasos del subprograma si existe
  useEffect(() => {
    if (subprogramaId) {
      const cargarPasos = async () => {
        try {
          // Si se proporcionaron pasos iniciales, no es necesario cargarlos
          if (initialPasos && initialPasos.length > 0) {
            setPasos(initialPasos);
            return;
          }
          
          const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
          setPasos(pasosData);
        } catch (err) {
          console.error('Error al cargar pasos:', err);
        }
      };
      
      cargarPasos();
    }
  }, [subprogramaId, initialPasos]);
  
  // Manejar cambios en las pestañas
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejar cambio en el tipo de video
  const handleVideoTypeChange = (e) => {
    const value = e.target.value;
    setVideoType(value);
    
    // Resetear valores
    if (value === 'none') {
      setVideoFile(null);
      setVideoUrl('');
      setFormData({
        ...formData,
        videoReferencia: '',
        esEnlaceExterno: false
      });
    }
  };
  
  // Manejar cambio en la URL del video
  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };
  
  // Manejar carga de archivo de video
  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  
  // Manejar drag & drop de video
  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleVideoDragLeave = () => {
    setIsDragActive(false);
  };
  
  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('video/')) {
        setVideoFile(file);
      } else {
        setError('El archivo debe ser un video');
      }
    }
  };
  
  // Remover video
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl('');
    setFormData({
      ...formData,
      videoReferencia: '',
      esEnlaceExterno: false
    });
    setVideoType('none');
  };
  
  // Subir video al servidor
  const uploadVideo = async () => {
    if (!videoFile) return null;
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const response = await programasPersonalizadosService.uploadSubprogramaVideo(subprogramaId, formData);
      return response.videoUrl;
    } catch (error) {
      console.error('Error al subir video:', error);
      throw new Error('Error al subir el video. Inténtalo de nuevo.');
    }
  };
  
  // Manejar creación de un nuevo paso
  const handleCreatePaso = () => {
    if (onCreatePaso) {
      onCreatePaso();
    } else {
      setIsCreatingPaso(true);
      setEditingPaso(null);
    }
  };
  
  // Manejar edición de un paso existente
  const handleEditPaso = (paso) => {
    if (onEditPaso) {
      onEditPaso(paso);
    } else {
      setEditingPaso(paso);
      setIsCreatingPaso(true);
    }
  };
  
  // Cancelar creación/edición de paso
  const handleCancelPaso = () => {
    setPasoStatusMessage(null);
    if (onCancelPaso) {
      onCancelPaso();
    } else {
      setIsCreatingPaso(false);
      setEditingPaso(null);
    }
  };
  
  // Guardar un paso (nuevo o editado)
  const handleSavePaso = async (paso, closeAfterSave = false) => {
    try {
      setLoading(true);
      
      if (onSavePaso) {
        await onSavePaso(paso, closeAfterSave);
      } else {
        // Recargar los pasos
        const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
        setPasos(pasosData);
      }
      
      // Solo cerramos el formulario si se indica explícitamente
      if (closeAfterSave) {
        setIsCreatingPaso(false);
        setEditingPaso(null);
        // Mostrar mensaje de éxito
        setPasoStatusMessage({
          text: editingPaso ? 'Paso actualizado correctamente' : 'Paso creado correctamente',
          severity: 'success'
        });
      } else {
        // Limpiar el formulario para crear un nuevo paso
        setEditingPaso(null);
        // Mostrar mensaje pero mantener el formulario abierto
        setPasoStatusMessage({
          text: editingPaso ? 'Paso actualizado. Puedes seguir editando.' : 'Paso creado. Puedes añadir otro.',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error al guardar paso:', err);
      setError('Error al guardar el paso: ' + (err.message || 'Inténtalo de nuevo.'));
      setPasoStatusMessage({
        text: 'Error al guardar el paso',
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
      
      if (onDeletePaso) {
        await onDeletePaso(pasoId);
      } else {
        await programasPersonalizadosService.deletePaso(pasoId);
        
        // Recargar los pasos
        const pasosData = await programasPersonalizadosService.getPasosBySubprogramaId(subprogramaId);
        setPasos(pasosData);
      }
      
      // Mostrar mensaje de éxito
      setPasoStatusMessage({
        text: 'Paso eliminado correctamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error al eliminar paso:', err);
      setError('Error al eliminar el paso: ' + (err.message || 'Inténtalo de nuevo.'));
      setPasoStatusMessage({
        text: 'Error al eliminar el paso',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos del subprograma
      const subprogramaData = {
        ...formData
      };
      
      // Si estamos en modo de edición con ID existente
      if (subprogramaId) {
        // 1. Actualizar datos básicos
        await programasPersonalizadosService.updateSubprograma(subprogramaId, subprogramaData);
        
        // 2. Subir video si hay uno nuevo
        if (videoType === 'upload' && videoFile) {
          const videoUrl = await uploadVideo();
          if (videoUrl) {
            subprogramaData.videoReferencia = videoUrl;
            subprogramaData.esEnlaceExterno = false;
            await programasPersonalizadosService.updateSubprograma(subprogramaId, {
              videoReferencia: videoUrl,
              esEnlaceExterno: false
            });
          }
        } else if (videoType === 'external' && videoUrl) {
          subprogramaData.videoReferencia = videoUrl;
          subprogramaData.esEnlaceExterno = true;
          await programasPersonalizadosService.updateSubprograma(subprogramaId, {
            videoReferencia: videoUrl,
            esEnlaceExterno: true
          });
        }
      } else {
        // Si es un nuevo subprograma, todo se maneja en el componente padre
        if (videoType === 'external' && videoUrl) {
          subprogramaData.videoReferencia = videoUrl;
          subprogramaData.esEnlaceExterno = true;
        }
      }
      
      // Llamar al callback con los datos actualizados
      onSave(subprogramaData);
      
    } catch (err) {
      console.error('Error al guardar subprograma:', err);
      setError(err.message || 'Error al guardar el subprograma. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          aria-label="subprograma tabs"
        >
          <Tab label="Información básica" id="tab-0" />
          <Tab 
            label="Pasos" 
            id="tab-1" 
            disabled={!subprogramaId}
          />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
      {/* Sección de datos básicos */}
      <Typography variant="h6" gutterBottom>
        Información básica
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="nombre"
            label="Nombre del subprograma"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="descripcion"
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="orden"
            label="Orden"
            type="number"
            value={formData.orden}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={loading}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Sección de video */}
      <Typography variant="h6" gutterBottom>
        Video instructivo
      </Typography>
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">Tipo de video</FormLabel>
        <RadioGroup
          name="videoType"
          value={videoType}
          onChange={handleVideoTypeChange}
        >
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="Sin video"
            disabled={loading}
          />
          <FormControlLabel
            value="upload"
            control={<Radio />}
            label="Subir video"
            disabled={loading}
          />
          <FormControlLabel
            value="external"
            control={<Radio />}
            label="Enlace externo (YouTube, Vimeo, Google Drive)"
            disabled={loading}
          />
        </RadioGroup>
      </FormControl>
      
      {videoType === 'upload' && (
        <Box mt={2}>
          {videoFile ? (
            <Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {videoFile.name} ({Math.round(videoFile.size / 1024)} KB)
                </Typography>
                <IconButton color="error" onClick={() => setVideoFile(null)}>
                  <CancelIcon />
                </IconButton>
              </Box>
              {subprogramaId && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={uploadVideo}
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  Subir ahora
                </Button>
              )}
            </Box>
          ) : formData.videoReferencia && !formData.esEnlaceExterno ? (
            <VideoPreview
              url={formData.videoReferencia}
              isExternal={false}
              onRemove={handleRemoveVideo}
            />
          ) : (
            <UploadZone
              isDragActive={isDragActive}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
              onClick={() => document.getElementById('video-upload').click()}
            >
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                style={{ display: 'none' }}
              />
              <MovieIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Arrastra y suelta un video aquí o haz clic para seleccionar
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Formatos soportados: MP4, WebM, MOV (máx. 10MB)
              </Typography>
            </UploadZone>
          )}
        </Box>
      )}
      
      {videoType === 'external' && (
        <Box mt={2}>
          <TextField
            fullWidth
            label="URL del video"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="ej. https://www.youtube.com/embed/..."
            disabled={loading}
            InputProps={{
              startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
            }}
          />
          {videoUrl && (
            <Box mt={2}>
              <VideoPreview
                url={videoUrl}
                isExternal={true}
                onRemove={handleRemoveVideo}
              />
            </Box>
          )}
        </Box>
      )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {!subprogramaId ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Debes guardar el subprograma antes de poder agregar pasos
          </Alert>
        ) : isCreatingPaso ? (
          <Box>
        <Typography variant="h6" gutterBottom>
              {editingPaso ? 'Editar paso' : 'Nuevo paso'}
            </Typography>
            <PasoFormMultimedia
              pasoId={editingPaso ? editingPaso.id : null}
              subprogramaId={subprogramaId}
              initialData={editingPaso}
              onSave={handleSavePaso}
              onCancel={handleCancelPaso}
            />
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Secuencia de pasos {pasos && pasos.length > 0 ? `(${pasos.length})` : ''}
        </Typography>
        <Button
                variant="contained"
                color="primary"
          startIcon={<AddIcon />}
                onClick={handleCreatePaso}
          disabled={loading}
        >
                Añadir paso
        </Button>
      </Box>
      
            {pasoStatusMessage && (
              <Alert 
                severity={pasoStatusMessage.severity} 
                sx={{ mb: 2 }}
                onClose={() => setPasoStatusMessage(null)}
              >
                {pasoStatusMessage.text}
              </Alert>
            )}
            
            {(!pasos || pasos.length === 0) ? (
              <Box textAlign="center" py={4}>
                <ListIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" paragraph>
                  No hay pasos definidos para este subprograma.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreatePaso}
                  disabled={loading}
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
        )}
      </TabPanel>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  );
};

export default SubprogramaFormMultimedia; 