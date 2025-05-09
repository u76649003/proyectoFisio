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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Checkbox,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
  FileCopy as CopyIcon,
  Check as CheckIcon,
  FitnessCenter,
  Refresh as RefreshIcon,
  Mail as MailIcon
} from '@mui/icons-material';
import { programasPersonalizadosService, pacienteService, authService } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import { useAuth } from '../contexts/AuthContext';

const CompartirPrograma = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Estados para programa y pacientes
  const [programa, setPrograma] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPacientes, setSelectedPacientes] = useState([]);
  
  // Estados para tokens generados
  const [tokens, setTokens] = useState([]);
  const [existingTokens, setExistingTokens] = useState([]);
  const [generatingTokens, setGeneratingTokens] = useState(false);
  
  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [loadingExistingTokens, setLoadingExistingTokens] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Estado para el diálogo de enlaces generados
  const [showLinksDialog, setShowLinksDialog] = useState(false);
  
  // Cargar datos del usuario
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Verificar permisos
    if (currentUser.rol !== 'DUENO' && currentUser.rol !== 'FISIOTERAPEUTA') {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Cargar datos del programa y pacientes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos del programa
        const programaData = await programasPersonalizadosService.getProgramaById(id);
        setPrograma(programaData);
        
        // Obtener pacientes de la empresa
        const currentUser = authService.getCurrentUser();
        const pacientesData = await pacienteService.getPacientesByEmpresa(currentUser.empresaId);
        setPacientes(pacientesData);
        setFilteredPacientes(pacientesData);
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    const loadExistingTokens = async () => {
      try {
        setLoadingExistingTokens(true);
        
        // Obtener tokens existentes
        const tokensData = await programasPersonalizadosService.getTokensByProgramaId(id);
        setExistingTokens(tokensData);
        
      } catch (err) {
        console.error('Error al cargar tokens existentes:', err);
      } finally {
        setLoadingExistingTokens(false);
      }
    };
    
    if (id) {
      loadData();
      loadExistingTokens();
    }
  }, [id, navigate]);
  
  // Filtrar pacientes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPacientes(pacientes);
    } else {
      const filtered = pacientes.filter(paciente => {
        const fullName = `${paciente.nombre} ${paciente.apellidos}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
               (paciente.email && paciente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (paciente.telefono && paciente.telefono.includes(searchTerm));
      });
      setFilteredPacientes(filtered);
    }
  }, [searchTerm, pacientes]);
  
  // Manejadores para búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Manejadores para selección
  const handleSelectAll = () => {
    if (selectedPacientes.length === filteredPacientes.length) {
      setSelectedPacientes([]);
    } else {
      setSelectedPacientes(filteredPacientes.map(p => p.id));
    }
  };
  
  const handleTogglePaciente = (pacienteId) => {
    setSelectedPacientes(prev => {
      if (prev.includes(pacienteId)) {
        return prev.filter(id => id !== pacienteId);
      } else {
        return [...prev, pacienteId];
      }
    });
  };
  
  // Manejadores para generación de tokens
  const handleGenerarTokens = () => {
    if (selectedPacientes.length === 0) {
      setSnackbarMessage('Selecciona al menos un paciente');
      setSnackbarOpen(true);
      return;
    }
    
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleConfirmGenerarTokens = async () => {
    try {
      setGeneratingTokens(true);
      
      // Generar tokens para los pacientes seleccionados
      const generatedTokens = await programasPersonalizadosService.generarTokensAcceso(id, selectedPacientes);
      
      // Actualizar tokens
      setTokens(generatedTokens);
      setExistingTokens(prev => {
        // Filtrar tokens antiguos de los mismos pacientes
        const filteredPrev = prev.filter(t => !selectedPacientes.includes(t.pacienteId));
        // Añadir los nuevos tokens
        return [...filteredPrev, ...generatedTokens];
      });
      
      // Limpiar selección
      setSelectedPacientes([]);
      
      // Cerrar diálogo
      setOpenDialog(false);
      
      // Mostrar mensaje
      setSnackbarMessage(`Tokens generados correctamente para ${generatedTokens.length} pacientes`);
      setSnackbarOpen(true);
      
    } catch (err) {
      console.error('Error al generar tokens:', err);
      setError('No se pudieron generar los tokens. Inténtalo de nuevo más tarde.');
      setOpenDialog(false);
    } finally {
      setGeneratingTokens(false);
    }
  };
  
  // Manejador para copiar enlace
  const handleCopyLink = (token) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/acceso-programa?token=${token.token}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedToken(token.id);
        setTimeout(() => setCopiedToken(null), 2000);
        
        setSnackbarMessage('Enlace copiado al portapapeles');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage('Error al copiar. Inténtalo de nuevo.');
        setSnackbarOpen(true);
      });
  };
  
  // Manejador para compartir por WhatsApp
  const handleShareWhatsApp = (token) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/acceso-programa?token=${token.token}`;
    
    const message = encodeURIComponent(
      `Hola ${token.paciente?.nombre || ''},\n\n` +
      `Te comparto tu programa personalizado "${programa?.nombre}".\n\n` +
      `Accede a través de este enlace: ${link}\n\n` +
      `El enlace expira el ${new Date(token.fechaExpiracion).toLocaleDateString()}.`
    );
    
    window.open(`https://wa.me/${token.paciente?.telefono?.replace(/\D/g, '')}?text=${message}`, '_blank');
  };
  
  const handleRefreshTokens = async () => {
    try {
      setLoadingExistingTokens(true);
      const data = await programasPersonalizadosService.getTokensByProgramaId(id);
      setExistingTokens(data || []);
      setSnackbarMessage('Tokens actualizados');
      setSnackbarOpen(true);
      setLoadingExistingTokens(false);
    } catch (error) {
      console.error('Error al recargar tokens:', error);
      setError('Error al recargar tokens');
      setSnackbarMessage('Error al recargar tokens');
      setSnackbarOpen(true);
      setLoadingExistingTokens(false);
    }
  };
  
  // Generar tokens para los pacientes seleccionados
  const handleGenerateTokens = async () => {
    if (selectedPacientes.length === 0) {
      setNotification({
        open: true,
        message: 'Selecciona al menos un paciente',
        severity: 'warning'
      });
      return;
    }
    
    try {
      setGeneratingTokens(true);
      
      // Llamar al servicio para generar tokens
      const tokens = await programasPersonalizadosService.generarTokensParaPacientes(
        id, 
        selectedPacientes
      );
      
      // Enriquecer los tokens con nombres de pacientes para mejor visualización
      const tokensEnriquecidos = tokens.map(token => {
        const paciente = pacientes.find(p => p.id === token.pacienteId);
        return {
          ...token,
          pacienteNombre: paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Paciente'
        };
      });
      
      setTokens(tokensEnriquecidos);
      setShowLinksDialog(true);
      
      // Limpiar selección después de generar tokens
      setSelectedPacientes([]);
      
    } catch (error) {
      console.error('Error al generar tokens:', error);
      setNotification({
        open: true,
        message: 'Error al generar enlaces de acceso',
        severity: 'error'
      });
    } finally {
      setGeneratingTokens(false);
    }
  };
  
  // Compartir por Email
  const handleShareEmail = (url, pacienteNombre) => {
    const subject = encodeURIComponent('Tu programa personalizado de fisioterapia');
    const body = encodeURIComponent(
      `Hola ${pacienteNombre},\n\nAquí tienes el enlace a tu programa personalizado: ${url}\n\nSaludos,\nTu fisioterapeuta`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
  // Copiar todos los enlaces
  const handleCopyAllLinks = () => {
    const linksText = tokens
      .map(token => `${token.pacienteNombre}: ${token.enlaceAcceso}`)
      .join('\n');
    
    navigator.clipboard.writeText(linksText)
      .then(() => {
        setNotification({
          open: true,
          message: 'Todos los enlaces copiados al portapapeles',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Error al copiar enlaces:', err);
        setNotification({
          open: true,
          message: 'No se pudieron copiar los enlaces',
          severity: 'error'
        });
      });
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  // Volver a la página anterior
  const handleBack = () => {
    navigate(`/programas-personalizados/${id}`);
  };
  
  if (loading) {
    return (
      <SidebarMenu>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </SidebarMenu>
    );
  }
  
  if (error) {
    return (
      <SidebarMenu>
        <Container maxWidth="lg">
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/programas-personalizados')}
              sx={{ mb: 3 }}
            >
              Volver a Programas
            </Button>
            
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          </Box>
        </Container>
      </SidebarMenu>
    );
  }
  
  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3 }}>
          {/* Cabecera */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              Volver
            </Button>
            
            <Typography variant="h4" component="h1" fontWeight="bold">
              Compartir Programa
            </Typography>
          </Box>
          
          {/* Información del programa */}
          <Paper sx={{ p: 3, mb: 4 }}>
            {programa && (
              <>
                <Typography variant="h5" gutterBottom>
                  {programa.nombre}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  {programa.descripcion || 'Sin descripción'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Chip 
                    label={programa.tipoPrograma || 'General'} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    {programa.subprogramas?.length || 0} subprogramas
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
          
          {/* Selección de pacientes */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Seleccionar Pacientes
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar pacientes por nombre, email o teléfono..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
                disabled={filteredPacientes.length === 0}
              >
                {selectedPacientes.length === filteredPacientes.length && filteredPacientes.length > 0
                  ? 'Deseleccionar Todos'
                  : 'Seleccionar Todos'
                }
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                {selectedPacientes.length} paciente(s) seleccionado(s)
              </Typography>
            </Box>
            
            <Card variant="outlined">
              {filteredPacientes.length === 0 ? (
                <CardContent>
                  <Typography variant="body2" color="text.secondary" align="center">
                    No se encontraron pacientes {searchTerm ? 'con ese criterio de búsqueda' : ''}
                  </Typography>
                </CardContent>
              ) : (
                <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                  {filteredPacientes.map((paciente) => (
                    <ListItem 
                      key={paciente.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={() => handleTogglePaciente(paciente.id)}
                          checked={selectedPacientes.includes(paciente.id)}
                          inputProps={{ 'aria-labelledby': `paciente-${paciente.id}` }}
                        />
                      }
                      divider
                    >
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        id={`paciente-${paciente.id}`}
                        primary={`${paciente.nombre} ${paciente.apellidos}`}
                        secondary={paciente.email || paciente.telefono || 'Sin contacto'}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>
          </Paper>
          
          {/* Botón de generar enlaces */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShareIcon />}
              disabled={selectedPacientes.length === 0 || generatingTokens}
              onClick={handleGenerateTokens}
              sx={{ px: 4, py: 1.5 }}
            >
              {generatingTokens ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Generando Enlaces...
                </>
              ) : (
                `Compartir con ${selectedPacientes.length} paciente(s)`
              )}
            </Button>
          </Box>
          
          {/* Historial de enlaces compartidos - podría implementarse en una versión futura */}
        </Box>
        
        {/* Diálogo de enlaces generados */}
        <Dialog
          open={showLinksDialog}
          onClose={() => setShowLinksDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Enlaces Generados ({tokens.length})
            <IconButton
              aria-label="close"
              onClick={() => setShowLinksDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Alert severity="success" sx={{ mb: 2 }}>
              Se han generado correctamente {tokens.length} enlaces de acceso.
              Estos enlaces funcionan sin necesidad de iniciar sesión.
            </Alert>
            
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={handleCopyAllLinks}
              sx={{ mb: 3 }}
            >
              Copiar Todos los Enlaces
            </Button>
            
            <List>
              {tokens.map((token) => (
                <ListItem 
                  key={token.id}
                  sx={{ 
                    bgcolor: 'background.default', 
                    mb: 1, 
                    borderRadius: 1
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={token.pacienteNombre}
                    secondary={token.enlaceAcceso}
                    secondaryTypographyProps={{ 
                      sx: { 
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem'
                      } 
                    }}
                  />
                  <Box>
                    <Tooltip title="Copiar enlace">
                      <IconButton 
                        onClick={() => handleCopyLink(token)}
                        edge="end"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Compartir por WhatsApp">
                      <IconButton 
                        onClick={() => handleShareWhatsApp(token)}
                        edge="end"
                        color="success"
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Compartir por Email">
                      <IconButton 
                        onClick={() => handleShareEmail(token.enlaceAcceso, token.pacienteNombre)}
                        edge="end"
                        color="primary"
                      >
                        <MailIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setShowLinksDialog(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        
        {/* Notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
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

export default CompartirPrograma; 