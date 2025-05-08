import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Paper,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ImageOutlined as ImageIcon,
  MovieOutlined as MovieIcon
} from '@mui/icons-material';

/**
 * Componente para visualizar el contenido multimedia de un subprograma
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.subprograma - Objeto con datos del subprograma
 * @param {boolean} props.compact - Si es true, muestra una vista compacta
 */
const SubprogramaMultimediaViewer = ({ subprograma, compact = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [openGallery, setOpenGallery] = useState(false);
  
  const hasVideo = subprograma?.videoReferencia;
  const hasImages = subprograma?.imagenesUrls && subprograma.imagenesUrls.length > 0;
  const hasContent = hasVideo || hasImages;
  
  // Manejar vista previa de imagen ampliada
  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenGallery(true);
  };
  
  // Determinar si es un enlace de YouTube/Vimeo
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com/embed') || url.includes('youtu.be'));
  };
  
  const isVimeoUrl = (url) => {
    return url && url.includes('vimeo.com');
  };
  
  // Adaptar URL de YouTube si es necesario
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Vimeo
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // Google Drive
    if (url.includes('drive.google.com/file') && !url.includes('preview')) {
      const fileId = url.match(/\/d\/([^/]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    return url;
  };
  
  // Obtener URL completa para archivos multimedia (videos e imágenes)
  const getFullMediaUrl = (url) => {
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
  
  // Renderizar contenido en modo compacto
  if (compact) {
    return (
      <Box mt={2}>
        {hasContent ? (
          <Grid container spacing={1}>
            {hasVideo && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 1 }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    p={1} 
                    onClick={() => !compact && handleOpenVideo()}
                    sx={{ cursor: !compact && hasVideo ? 'pointer' : 'default' }}
                  >
                    <MovieIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {subprograma.esEnlaceExterno ? 'Video externo' : 'Video del ejercicio'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )}
            
            {hasImages && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    p={1}
                    onClick={() => !compact && setOpenGallery(true)}
                    sx={{ cursor: !compact && hasImages ? 'pointer' : 'default' }}
                  >
                    <ImageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {subprograma.imagenesUrls.length} imágenes disponibles
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Sin contenido multimedia
          </Typography>
        )}
      </Box>
    );
  }
  
  // Renderizar contenido completo
  return (
    <Box>
      {hasContent ? (
        <Grid container spacing={2}>
          {/* Video */}
          {hasVideo && (
            <Grid item xs={12}>
              <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <MovieIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Video instructivo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {subprograma.esEnlaceExterno ? (
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                    <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      src={getEmbedUrl(subprograma.videoReferencia)}
                      title="Video del ejercicio"
                      allowFullScreen
                    />
                  </Box>
                ) : (
                  <Box>
                    <CardMedia
                      component="video"
                      controls
                      src={getFullMediaUrl(subprograma.videoReferencia)}
                      sx={{ width: '100%', borderRadius: 1 }}
                    />
                  </Box>
                )}
                {subprograma.descripcion && (
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {subprograma.descripcion}
                    </Typography>
                  </CardContent>
                )}
              </Paper>
            </Grid>
          )}
          
          {/* Imágenes */}
          {hasImages && (
            <Grid item xs={12}>
              <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <ImageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Imágenes de referencia ({subprograma.imagenesUrls.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <ImageList
                  cols={isMobile ? 2 : 3}
                  gap={8}
                >
                  {subprograma.imagenesUrls.map((img, index) => (
                    <ImageListItem 
                      key={index}
                      onClick={() => handleOpenImage(img)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9,
                          '& .MuiBox-root': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <img
                        src={getFullMediaUrl(img)}
                        alt={`Imagen ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 4 }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0,0,0,0.4)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          borderRadius: 1
                        }}
                      >
                        <ZoomInIcon sx={{ color: 'white', fontSize: 40 }} />
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box py={2} textAlign="center">
          <Typography color="text.secondary">
            Este subprograma no tiene contenido multimedia
          </Typography>
        </Box>
      )}
      
      {/* Diálogo de vista ampliada de imágenes */}
      <Dialog
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setOpenGallery(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ position: 'relative', textAlign: 'center', bgcolor: 'black', height: 'calc(100vh - 100px)' }}>
            {selectedImage ? (
              <img
                src={getFullMediaUrl(selectedImage)}
                alt="Imagen ampliada"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block',
                  height: '100%'
                }}
              />
            ) : subprograma?.imagenesUrls?.length > 0 && (
              <img
                src={getFullMediaUrl(subprograma.imagenesUrls[0])}
                alt="Imagen ampliada"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block',
                  height: '100%'
                }}
              />
            )}
            
            {/* Miniaturas abajo */}
            {subprograma?.imagenesUrls?.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  p: 1,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                {subprograma.imagenesUrls.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={getFullMediaUrl(img)}
                    alt={`Miniatura ${idx + 1}`}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      height: 60,
                      width: 'auto',
                      mr: 1,
                      cursor: 'pointer',
                      border: img === selectedImage ? `2px solid ${theme.palette.primary.main}` : 'none',
                      borderRadius: 1,
                      opacity: img === selectedImage ? 1 : 0.7,
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SubprogramaMultimediaViewer; 