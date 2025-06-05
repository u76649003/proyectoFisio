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
  Movie as MovieIcon,
  Download as DownloadIcon
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

// Componente para vista previa de imagen
const ImagePreview = ({ url, onRemove }) => {
  // Obtener URL completa para imagen
  const getFullImageUrl = (url) => {
    if (!url) return '';
    
    // Si ya es una URL completa (comienza con http), devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una ruta relativa, añadirle la URL base de la API
    const baseUrl = process.env.REACT_APP_API_URL || 'https://proyectofisio.onrender.com';
    // Asegurarnos de que la URL no tenga doble barra
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={getFullImageUrl(url)}
        alt="Imagen"
      />
      <CardActions sx={{ justifyContent: 'space-between', py: 0.5 }}>
        <Tooltip title="Descargar imagen">
          <IconButton
            color="primary"
            component="a"
            href={getFullImageUrl(url)}
            target="_blank"
            download
            size="small"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar imagen">
          <IconButton
            color="error"
            onClick={onRemove}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

// Componente para vista previa de video
const VideoPreview = ({ url, onRemove, esEnlaceExterno }) => {
  // Obtener URL completa para video
  const getFullVideoUrl = (url) => {
    if (!url) return '';
    
    // Si ya es una URL completa o es un enlace externo, devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una ruta relativa, añadirle la URL base de la API
    const baseUrl = process.env.REACT_APP_API_URL || 'https://proyectofisio.onrender.com';
    // Asegurarnos de que la URL no tenga doble barra
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  // Adaptar URL de YouTube si es necesario
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed')) return url;
    
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };
  
  // URL para videos de YouTube o embebidos
  const embedUrl = esEnlaceExterno ? getYouTubeEmbedUrl(url) : getFullVideoUrl(url);
  
  return (
    <Card sx={{ mb: 2, maxWidth: '100%' }}>
      {esEnlaceExterno ? (
        <CardMedia
          component="iframe"
          height="200"
          src={embedUrl}
          alt="Video"
          sx={{ border: 'none' }}
        />
      ) : (
        <CardMedia
          component="video"
          height="200"
          src={embedUrl}
          alt="Video"
          controls
        />
      )}
      <CardActions sx={{ justifyContent: 'flex-end', py: 0.5 }}>
        <IconButton
          color="error"
          onClick={onRemove}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const PasoFormMultimedia = ({ pasoId, subprogramaId, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    descripcion: initialData ? initialData.descripcion : '',
    videoReferencia: initialData ? initialData.videoReferencia : '',
    esEnlaceExterno: initialData ? initialData.esEnlaceExterno : false,
    imagenesUrls: initialData ? initialData.imagenesUrls : []
  });
  
  const [numeroPaso, setNumeroPaso] = useState(initialData ? initialData.numeroPaso : null);
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
        descripcion: initialData.descripcion || '',
        videoReferencia: initialData.videoReferencia || '',
        esEnlaceExterno: initialData.esEnlaceExterno || false,
        imagenesUrls: initialData.imagenesUrls || []
      });
      
      setNumeroPaso(initialData.numeroPaso || null);
      
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
  
  // Resetear el formulario para añadir un nuevo paso
  const resetForm = () => {
    setFormData({
      descripcion: '',
      videoReferencia: '',
      esEnlaceExterno: false,
      imagenesUrls: []
    });
    setVideoType('none');
    setVideoFile(null);
    setVideoUrl('');
    setImageFiles([]);
    setImageUrls([]);
    setError(null);
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
      
      const response = await programasPersonalizadosService.uploadPasoVideo(pasoId, formData);
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
      
      const response = await programasPersonalizadosService.uploadPasoImagenes(pasoId, formData);
      return response;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw new Error('Error al subir las imágenes. Inténtalo de nuevo.');
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e, continueEditing = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos del paso
      const pasoData = {
        ...formData
      };
      
      // Si estamos en modo de edición con ID existente
      if (pasoId) {
        // 1. Actualizar datos básicos
        await programasPersonalizadosService.updatePaso(pasoId, pasoData);
        
        // 2. Subir video si hay uno nuevo
        if (videoType === 'upload' && videoFile) {
          const videoUrl = await uploadVideo();
          if (videoUrl) {
            pasoData.videoReferencia = videoUrl;
            pasoData.esEnlaceExterno = false;
            await programasPersonalizadosService.updatePaso(pasoId, {
              videoReferencia: videoUrl,
              esEnlaceExterno: false
            });
          }
        } else if (videoType === 'external' && videoUrl) {
          pasoData.videoReferencia = videoUrl;
          pasoData.esEnlaceExterno = true;
          await programasPersonalizadosService.updatePaso(pasoId, {
            videoReferencia: videoUrl,
            esEnlaceExterno: true
          });
        }
        
        // 3. Subir imágenes si hay nuevas
        if (imageFiles.length > 0) {
          const newImageUrls = await uploadImages();
          const allImageUrls = [...imageUrls, ...newImageUrls];
          pasoData.imagenesUrls = allImageUrls;
          await programasPersonalizadosService.updatePaso(pasoId, {
            imagenesUrls: allImageUrls
          });
        }
        
        // 4. Llamar al callback con los datos actualizados
        // Pasamos explícitamente si queremos cerrar el formulario o no
        console.log("Paso actualizado, closeAfterSave=", !continueEditing);
        onSave({
          ...initialData,
          ...pasoData,
          numeroPaso: numeroPaso,
          imagenesUrls: imageFiles.length > 0 ? [...imageUrls, ...(await uploadImages())] : imageUrls
        }, !continueEditing);
      } else {
        // Es un nuevo paso
        if (videoType === 'external' && videoUrl) {
          pasoData.videoReferencia = videoUrl;
          pasoData.esEnlaceExterno = true;
        }
        
        // 1. Crear el paso
        const createdPaso = await programasPersonalizadosService.createPaso(subprogramaId, pasoData);
        
        // 2. Subir video si hay uno
        if (videoType === 'upload' && videoFile) {
          const formData = new FormData();
          formData.append('video', videoFile);
          await programasPersonalizadosService.uploadPasoVideo(createdPaso.id, formData);
        }
        
        // 3. Subir imágenes si hay
        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach(file => {
            formData.append('imagenes', file);
          });
          await programasPersonalizadosService.uploadPasoImagenes(createdPaso.id, formData);
        }
        
        // 4. Llamar al callback con los datos creados
        // Pasamos explícitamente si queremos cerrar el formulario o no, igual que en actualizar
        onSave(createdPaso, !continueEditing);
        
        // 5. Si vamos a continuar añadiendo, resetear el formulario
        if (continueEditing) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error al guardar paso:', error);
      setError('Error al guardar el paso: ' + (error.message || 'Inténtalo de nuevo.'));
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar actualizar paso sin cerrar formulario
  const handleUpdatePaso = (e) => {
    e.preventDefault();
    
    // Bloquear formulario durante la carga
    setLoading(true);
    
    // Explícitamente indicamos que queremos mantener el formulario abierto
    // El valor false para closeAfterSave indica que no debe cerrar el formulario
    handleSubmit(e, false);
  };
  
  // Manejar crear nuevo paso sin cerrar formulario
  const handleCreatePaso = (e) => {
    e.preventDefault();
    
    // Bloquear formulario durante la carga
    setLoading(true);
    
    // Explícitamente indicamos que queremos mantener el formulario abierto
    // El valor false para closeAfterSave indica que no debe cerrar el formulario
    handleSubmit(e, false);
  };
  
  // Manejar guardar y crear otro paso
  const handleSaveAndAddAnother = (e) => {
    handleSubmit(e, true);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="subtitle1" gutterBottom>
        {pasoId ? `Editando Paso ${numeroPaso}` : 'Nuevo Paso'}
      </Typography>
      
      <TextField
        name="descripcion"
        label="Descripción del paso"
        fullWidth
        multiline
        rows={4}
        value={formData.descripcion}
        onChange={handleChange}
        margin="normal"
        required
        disabled={loading}
        placeholder="Explica de manera clara y sencilla qué debe hacer el paciente en este paso..."
      />
      
      <Divider sx={{ my: 3 }} />
      
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Video de referencia</FormLabel>
        <RadioGroup value={videoType} onChange={handleVideoTypeChange} row>
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
            label="Enlace externo (YouTube)"
            disabled={loading}
          />
        </RadioGroup>
      </FormControl>
      
      {videoType === 'upload' && (
        <Box mt={2}>
          {videoFile ? (
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="video"
                height="200"
                src={URL.createObjectURL(videoFile)}
                alt="Video Preview"
                controls
              />
              <CardContent sx={{ py: 1 }}>
                <Typography variant="caption" noWrap>
                  {videoFile.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', py: 0 }}>
                <IconButton
                  color="error"
                  onClick={handleRemoveVideo}
                  size="small"
                  disabled={loading}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ) : (
            <UploadZone
              isDragActive={isDragActive}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
              component="label"
            >
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoFileChange}
                disabled={loading}
              />
              <Box display="flex" flexDirection="column" alignItems="center">
                <MovieIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Arrastra un video aquí o haz clic para seleccionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Formatos recomendados: MP4, WebM (máx. 100MB)
                </Typography>
              </Box>
            </UploadZone>
          )}
        </Box>
      )}
      
      {videoType === 'external' && (
        <Box mt={2}>
          {videoUrl ? (
            <Box mb={2}>
              <VideoPreview
                url={videoUrl}
                onRemove={handleRemoveVideo}
                esEnlaceExterno={true}
              />
            </Box>
          ) : null}
          
          <TextField
            label="URL del video (YouTube)"
            placeholder="https://www.youtube.com/watch?v=..."
            fullWidth
            value={videoUrl}
            onChange={handleVideoUrlChange}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: videoUrl && (
                <IconButton onClick={handleRemoveVideo} size="small" disabled={loading}>
                  <CancelIcon />
                </IconButton>
              )
            }}
            disabled={loading}
          />
        </Box>
      )}
      
      {formData.videoReferencia && !videoFile && videoType !== 'external' && (
        <Box mt={2} mb={3}>
          <VideoPreview
            url={formData.videoReferencia}
            onRemove={handleRemoveVideo}
            esEnlaceExterno={formData.esEnlaceExterno}
          />
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
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
                  disabled={loading}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        {!pasoId && (
          <Button
            type="button"
            variant="contained"
            color="info"
            onClick={handleSaveAndAddAnother}
            disabled={loading || !formData.descripcion}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Guardar y añadir otro
          </Button>
        )}
        <Button
          type="button"
          onClick={pasoId ? handleUpdatePaso : handleCreatePaso}
          variant="contained"
          color="primary"
          disabled={loading || !formData.descripcion}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {pasoId ? 'Actualizar Paso' : 'Crear Paso'}
        </Button>
      </Box>
    </Box>
  );
};

export default PasoFormMultimedia; 