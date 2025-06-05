import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Grid,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  YouTube as YouTubeIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

/**
 * Componente para visualizar los pasos de un subprograma
 * @param {Object} props
 * @param {Array} props.pasos - Lista de pasos del subprograma
 * @param {Function} props.onEdit - Función para editar un paso (opcional)
 * @param {Function} props.onDelete - Función para eliminar un paso (opcional)
 */
const PasosViewer = ({ pasos = [], onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pasoToDelete, setPasoToDelete] = useState(null);
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  // Manejar solicitud de eliminar paso
  const handleDeleteRequest = (paso, event) => {
    // Detener la propagación para que no se expanda/colapse el acordeón
    event.stopPropagation();
    setPasoToDelete(paso);
    setDeleteConfirmOpen(true);
  };
  
  // Confirmar eliminación de paso
  const handleConfirmDelete = () => {
    if (pasoToDelete && onDelete) {
      onDelete(pasoToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setPasoToDelete(null);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setPasoToDelete(null);
  };
  
  // Manejar edición de paso
  const handleEdit = (paso, event) => {
    // Detener la propagación para que no se expanda/colapse el acordeón
    event.stopPropagation();
    if (onEdit) {
      onEdit(paso);
    }
  };
  
  // Determinar si es un enlace de YouTube/Vimeo
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com/embed') || url.includes('youtu.be'));
  };
  
  const isVimeoUrl = (url) => {
    return url && url.includes('vimeo.com');
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
  
  if (!pasos || pasos.length === 0) {
    return (
      <Box py={3} textAlign="center">
        <Typography color="text.secondary">
          Este subprograma no tiene pasos definidos.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
        Secuencia de pasos
      </Typography>
      
      {pasos.map((paso, index) => (
        <Accordion 
          key={paso.id || index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          sx={{
            mb: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[50],
              borderRadius: expanded === `panel${index}` ? '4px 4px 0 0' : 4
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  mr: 2,
                  flexShrink: 0
                }}
              >
                {paso.numeroPaso}
              </Box>
              
              <Typography sx={{ flexGrow: 1 }}>
                {paso.descripcion?.substring(0, 100)}{paso.descripcion?.length > 100 ? '...' : ''}
              </Typography>
              
              {/* Indicadores de video o imágenes */}
              <Box sx={{ display: 'flex', ml: 1, mr: 1 }}>
                {paso.videoReferencia && (
                  <Tooltip title="Incluye video">
                    <Box sx={{ 
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      mr: 1
                    }}>
                      {paso.esEnlaceExterno ? <YouTubeIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </Box>
                  </Tooltip>
                )}
                
                {paso.imagenesUrls && paso.imagenesUrls.length > 0 && (
                  <Tooltip title={`${paso.imagenesUrls.length} ${paso.imagenesUrls.length === 1 ? 'imagen' : 'imágenes'}`}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {paso.imagenesUrls.length}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
              
              {/* Botones de acción */}
              {(onEdit || onDelete) && (
                <Box sx={{ display: 'flex', ml: 1 }}>
                  {onEdit && (
                    <Tooltip title="Editar paso">
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={(e) => handleEdit(paso, e)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {onDelete && (
                    <Tooltip title="Eliminar paso">
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={(e) => handleDeleteRequest(paso, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 3 }}>
            {/* Descripción completa */}
            <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
              {paso.descripcion}
            </Typography>
            
            {/* Video si existe */}
            {paso.videoReferencia && (
              <Box mt={3} mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Video de referencia:
                </Typography>
                
                <Card sx={{ maxWidth: '100%', mb: 1 }}>
                  {paso.esEnlaceExterno ? (
                    <CardMedia
                      component="iframe"
                      height={isMobile ? 200 : 400}
                      src={getYouTubeEmbedUrl(paso.videoReferencia)}
                      sx={{ border: 'none' }}
                    />
                  ) : (
                    <CardMedia
                      component="video"
                      height={isMobile ? 200 : 400}
                      src={getFullMediaUrl(paso.videoReferencia)}
                      controls
                    />
                  )}
                </Card>
              </Box>
            )}
            
            {/* Imágenes si existen */}
            {paso.imagenesUrls && paso.imagenesUrls.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Imágenes de referencia:
                </Typography>
                
                <Grid container spacing={2} mt={1}>
                  {paso.imagenesUrls.map((url, imgIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={imgIndex}>
                      <Card sx={{ mb: 2 }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={getFullMediaUrl(url)}
                          alt={`Imagen ${imgIndex + 1}`}
                        />
                        <CardActions sx={{ justifyContent: 'flex-end', py: 0.5 }}>
                          <Tooltip title="Descargar imagen">
                            <IconButton
                              color="primary"
                              component="a"
                              href={getFullMediaUrl(url)}
                              target="_blank"
                              download
                              size="small"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el paso {pasoToDelete?.numeroPaso}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PasosViewer; 