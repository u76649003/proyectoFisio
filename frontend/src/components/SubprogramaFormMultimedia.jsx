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
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Movie as MovieIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { programasPersonalizadosService } from '../services/api';

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

// Componente para vista previa de imágenes
const ImagePreview = ({ url, onRemove }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={url}
        alt="Imagen del ejercicio"
      />
      <CardActions sx={{ justifyContent: 'flex-end', py: 0 }}>
        <IconButton color="error" onClick={onRemove} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const SubprogramaFormMultimedia = ({ subprogramaId, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: initialData ? initialData.nombre : '',
    descripcion: initialData ? initialData.descripcion : '',
    orden: initialData ? initialData.orden : (initialData ? initialData.orden : 1),
    videoReferencia: initialData ? initialData.videoReferencia : '',
    esEnlaceExterno: initialData ? initialData.esEnlaceExterno : false,
    imagenesUrls: initialData ? initialData.imagenesUrls : []
  });
  
  const [videoType, setVideoType] = useState('none');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Cargar datos iniciales si se proporcionan
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        orden: initialData.orden || 1,
        videoReferencia: initialData.videoReferencia || '',
        esEnlaceExterno: initialData.esEnlaceExterno || false,
        imagenesUrls: initialData.imagenesUrls || []
      });
      
      // Configurar tipo de video
      if (initialData.videoReferencia) {
        setVideoType(initialData.esEnlaceExterno ? 'external' : 'upload');
        if (initialData.esEnlaceExterno) {
          setVideoUrl(initialData.videoReferencia);
        }
      }
      
      // Configurar imágenes
      if (initialData.imagenesUrls && initialData.imagenesUrls.length > 0) {
        setImageUrls(initialData.imagenesUrls);
      }
    }
  }, [initialData]);
  
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
  
  // Manejar carga de imágenes
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...newFiles]);
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
  
  // Remover una imagen del array de archivos
  const handleRemoveImageFile = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };
  
  // Remover una imagen URL existente
  const handleRemoveImageUrl = (index) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
    setFormData({
      ...formData,
      imagenesUrls: newUrls
    });
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
  
  // Subir imágenes al servidor
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('imagenes', file);
      });
      
      const response = await programasPersonalizadosService.uploadSubprogramaImagenes(subprogramaId, formData);
      return response;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw new Error('Error al subir las imágenes. Inténtalo de nuevo.');
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
        
        // 3. Subir imágenes si hay nuevas
        if (imageFiles.length > 0) {
          const newImageUrls = await uploadImages();
          const allImageUrls = [...imageUrls, ...newImageUrls];
          subprogramaData.imagenesUrls = allImageUrls;
          await programasPersonalizadosService.updateSubprograma(subprogramaId, {
            imagenesUrls: allImageUrls
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
      
      <Divider sx={{ my: 3 }} />
      
      {/* Sección de imágenes */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Imágenes de referencia
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          component="label"
          disabled={loading}
        >
          Añadir imágenes
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
      
      <Grid container spacing={2} mt={1}>
        {/* Imágenes ya subidas */}
        {imageUrls.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} key={`url-${index}`}>
            <ImagePreview
              url={url}
              onRemove={() => handleRemoveImageUrl(index)}
            />
          </Grid>
        ))}
        
        {/* Imágenes seleccionadas pero aún no subidas */}
        {imageFiles.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={`file-${index}`}>
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={URL.createObjectURL(file)}
                alt={`Imagen ${index + 1}`}
              />
              <CardContent sx={{ py: 1 }}>
                <Typography variant="caption" noWrap>
                  {file.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', py: 0 }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveImageFile(index)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
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