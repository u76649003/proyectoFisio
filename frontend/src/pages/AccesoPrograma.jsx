import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  FitnessCenter,
  Description as DescriptionIcon,
  PlayArrow as PlayArrowIcon,
  Image as ImageIcon,
  Timer as TimerIcon,
  Repeat as RepeatIcon,
  Comment as CommentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { programasPersonalizadosService } from '../services/api';
import SubprogramaMultimediaViewer from '../components/SubprogramaMultimediaViewer';

// Componente para visualizar cada panel de contenido del subprograma
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

// Componente para visualizar detalles de un ejercicio
const EjercicioDetalle = ({ ejercicio }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {ejercicio.nombre}
        </Typography>
        
        {ejercicio.descripcion && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {ejercicio.descripcion}
          </Typography>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {ejercicio.repeticiones && (
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center">
                <RepeatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {ejercicio.repeticiones} repeticiones
                </Typography>
              </Box>
            </Grid>
          )}
          
          {ejercicio.duracionSegundos && (
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center">
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {ejercicio.duracionSegundos} segundos
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
        
        {ejercicio.instrucciones && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Instrucciones:
            </Typography>
            <Typography variant="body2" paragraph>
              {ejercicio.instrucciones}
            </Typography>
          </Box>
        )}
        
        {ejercicio.urlVideo && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Video de referencia:
            </Typography>
            {ejercicio.esVideoExterno ? (
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
                  src={ejercicio.urlVideo}
                  title={`Video de ${ejercicio.nombre}`}
                  allowFullScreen
                />
              </Box>
            ) : (
              <CardMedia
                component="video"
                controls
                sx={{ borderRadius: 1 }}
                src={ejercicio.urlVideo}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para visualizar un subprograma completo
const SubprogramaAcceso = ({ subprograma, expanded, onChange }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={onChange}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{subprograma.nombre}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {subprograma.descripcion && (
          <Typography variant="body1" paragraph>
            {subprograma.descripcion}
          </Typography>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleChangeTab}
            aria-label="subprograma tabs"
          >
            <Tab 
              icon={<DescriptionIcon />} 
              iconPosition="start" 
              label="Detalles" 
              id="tab-0" 
            />
            <Tab 
              icon={<ImageIcon />} 
              iconPosition="start" 
              label="Multimedia" 
              id="tab-1" 
              disabled={!(subprograma.videoReferencia || (subprograma.imagenesUrls && subprograma.imagenesUrls.length > 0))}
            />
            <Tab 
              icon={<PlayArrowIcon />} 
              iconPosition="start" 
              label={`Ejercicios (${subprograma.ejercicios?.length || 0})`} 
              id="tab-2" 
              disabled={!subprograma.ejercicios || subprograma.ejercicios.length === 0} 
            />
          </Tabs>
        </Box>
        
        {/* Panel de detalles */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Orden en el programa
              </Typography>
              <Typography variant="body1" paragraph>
                {subprograma.orden}
              </Typography>
            </Grid>
            
            {/* Más detalles si hay necesidad */}
          </Grid>
        </TabPanel>
        
        {/* Panel de multimedia */}
        <TabPanel value={tabValue} index={1}>
          <SubprogramaMultimediaViewer subprograma={subprograma} />
        </TabPanel>
        
        {/* Panel de ejercicios */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" gutterBottom>
            Ejercicios a realizar
          </Typography>
          
          {subprograma.ejercicios && subprograma.ejercicios.map((ejercicio, index) => (
            <EjercicioDetalle key={ejercicio.id} ejercicio={ejercicio} />
          ))}
        </TabPanel>
      </AccordionDetails>
    </Accordion>
  );
};

// Componente principal de acceso a programa para pacientes
const AccesoPrograma = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [token, setToken] = useState('');
  const [programa, setPrograma] = useState(null);
  const [subprogramas, setSubprogramas] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  
  const [expanded, setExpanded] = useState(false);
  const [openComentario, setOpenComentario] = useState(false);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Extraer token de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('No se ha proporcionado un token de acceso válido');
      setLoading(false);
    }
  }, [location]);
  
  // Cargar datos del programa cuando se tenga el token
  useEffect(() => {
    const cargarPrograma = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        const data = await programasPersonalizadosService.validarTokenPrograma(token);
        
        if (data) {
          setPrograma(data.programa);
          setSubprogramas(data.subprogramas || []);
          setPacienteId(data.pacienteId);
          setComentarios(data.comentarios || []);
          
          // Expandir el primer subprograma por defecto si hay alguno
          if (data.subprogramas && data.subprogramas.length > 0) {
            setExpanded(data.subprogramas[0].id);
          }
        }
      } catch (err) {
        console.error('Error al validar acceso:', err);
        setError('El enlace no es válido o ha expirado. Contacte con su fisioterapeuta.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      cargarPrograma();
    }
  }, [token]);
  
  // Manejar expansión de acordeones
  const handleAccordionChange = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };
  
  // Abrir y cerrar diálogo de comentario
  const handleOpenComentario = () => {
    setOpenComentario(true);
  };
  
  const handleCloseComentario = () => {
    setOpenComentario(false);
  };
  
  // Enviar comentario
  const handleEnviarComentario = async () => {
    if (!comentarioTexto.trim()) return;
    
    try {
      setEnviandoComentario(true);
      
      const nuevoComentario = await programasPersonalizadosService.enviarComentario({
        programaPersonalizadoId: programa.id,
        pacienteId: pacienteId,
        contenido: comentarioTexto
      });
      
      setComentarios([...comentarios, nuevoComentario]);
      setComentarioTexto('');
      setOpenComentario(false);
      
      setNotification({
        open: true,
        message: 'Comentario enviado correctamente',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      setNotification({
        open: true,
        message: 'Error al enviar el comentario',
        severity: 'error'
      });
    } finally {
      setEnviandoComentario(false);
    }
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom textAlign="center">
          <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
          Programa de ejercicios
        </Typography>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {programa.nombre}
            </Typography>
            
            {programa.tipoPrograma && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Tipo: {programa.tipoPrograma}
              </Typography>
            )}
            
            {programa.descripcion && (
              <Box mt={2}>
                <Typography variant="body1">
                  {programa.descripcion}
                </Typography>
              </Box>
            )}
          </Paper>
          
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Subprogramas
            </Typography>
            
            {subprogramas.length === 0 ? (
              <Alert severity="info">
                No hay subprogramas disponibles para este programa.
              </Alert>
            ) : (
              <Box>
                {subprogramas.map((subprograma) => (
                  <SubprogramaAcceso
                    key={subprograma.id}
                    subprograma={subprograma}
                    expanded={expanded === subprograma.id}
                    onChange={handleAccordionChange(subprograma.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Comentarios y preguntas
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CommentIcon />}
                onClick={handleOpenComentario}
              >
                Enviar comentario
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {comentarios.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={2}>
                No has enviado ningún comentario todavía
              </Typography>
            ) : (
              <List>
                {comentarios.map((comentario) => (
                  <ListItem
                    key={comentario.id}
                    alignItems="flex-start"
                    sx={{ 
                      mb: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {comentario.contenido.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={comentario.contenido}
                      secondary={`Enviado el ${new Date(comentario.fechaCreacion).toLocaleDateString()} - ${comentario.leido ? 'Leído' : 'No leído'}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </>
      )}
      
      {/* Diálogo para enviar comentario */}
      <Dialog
        open={openComentario}
        onClose={handleCloseComentario}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Enviar comentario o pregunta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comentario"
            label="Escribe tu comentario o pregunta"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comentarioTexto}
            onChange={(e) => setComentarioTexto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComentario} disabled={enviandoComentario}>
            Cancelar
          </Button>
          <Button
            onClick={handleEnviarComentario}
            variant="contained"
            color="primary"
            startIcon={enviandoComentario ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={!comentarioTexto.trim() || enviandoComentario}
          >
            {enviandoComentario ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificación */}
      <Alert
        severity={notification.severity}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          left: '50%', 
          transform: 'translateX(-50%)',
          maxWidth: '90%',
          display: notification.open ? 'flex' : 'none',
          boxShadow: 3
        }}
        onClose={handleCloseNotification}
      >
        {notification.message}
      </Alert>
    </Container>
  );
};

export default AccesoPrograma; 