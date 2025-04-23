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
  Refresh as RefreshIcon
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
  
  return (
    <SidebarMenu>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3, mb: 4 }}>
          {/* Encabezado */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              color="inherit"
              onClick={() => navigate(`/programas-personalizados/${id}`)}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <ShareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Compartir Programa
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Información del programa */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Programa: {programa?.nombre}
                </Typography>
                {programa?.tipoPrograma && (
                  <Chip 
                    label={programa.tipoPrograma} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 2 }} 
                  />
                )}
                <Typography variant="body2" color="textSecondary">
                  Selecciona los pacientes a los que quieres enviar este programa personalizado.
                  Se generará un enlace único para cada paciente que podrás compartir por WhatsApp u otro medio.
                </Typography>
              </Paper>
              
              {/* Tokens existentes */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Enlaces compartidos
                  </Typography>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={handleRefreshTokens}
                    disabled={loadingExistingTokens}
                  >
                    Actualizar
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {loadingExistingTokens ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress size={30} />
                  </Box>
                ) : existingTokens.length === 0 ? (
                  <Box textAlign="center" py={3}>
                    <Typography variant="body1" color="textSecondary">
                      No hay enlaces compartidos todavía.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {existingTokens.map(token => {
                      const paciente = pacientes.find(p => p.id === token.pacienteId);
                      return (
                        <Grid item xs={12} md={6} key={token.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Avatar sx={{ mr: 1.5, bgcolor: 'primary.main' }}>
                                  {paciente?.nombre?.charAt(0) || '?'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1">
                                    {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Paciente desconocido'}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Expira: {new Date(token.fechaExpiracion).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box display="flex" mt={2} gap={1} flexWrap="wrap">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={copiedToken === token.id ? <CheckIcon /> : <CopyIcon />}
                                  onClick={() => handleCopyLink(token)}
                                >
                                  {copiedToken === token.id ? 'Copiado' : 'Copiar enlace'}
                                </Button>
                                
                                {paciente?.telefono && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    startIcon={<WhatsAppIcon />}
                                    onClick={() => handleShareWhatsApp(token)}
                                  >
                                    WhatsApp
                                  </Button>
                                )}
                                
                                <Chip
                                  label={token.usado ? 'Utilizado' : 'No utilizado'}
                                  color={token.usado ? 'default' : 'info'}
                                  size="small"
                                  variant="outlined"
                                  sx={{ ml: 'auto' }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Paper>
              
              {/* Selección de pacientes */}
              <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Seleccionar pacientes
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShareIcon />}
                    disabled={selectedPacientes.length === 0}
                    onClick={handleGenerarTokens}
                  >
                    Generar enlaces ({selectedPacientes.length})
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <TextField
                  fullWidth
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedPacientes.length === filteredPacientes.length && filteredPacientes.length > 0}
                        indeterminate={selectedPacientes.length > 0 && selectedPacientes.length < filteredPacientes.length}
                        onChange={handleSelectAll}
                        disabled={filteredPacientes.length === 0}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Seleccionar todos" 
                      secondary={`${selectedPacientes.length} de ${filteredPacientes.length} seleccionados`}
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  {filteredPacientes.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="No se encontraron pacientes" 
                        secondary={searchTerm ? "Prueba con otra búsqueda" : "No hay pacientes disponibles"} 
                      />
                    </ListItem>
                  ) : (
                    filteredPacientes.map(paciente => (
                      <ListItem key={paciente.id} button onClick={() => handleTogglePaciente(paciente.id)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedPacientes.includes(paciente.id)}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${paciente.nombre} ${paciente.apellidos}`}
                          secondary={
                            <>
                              {paciente.email}
                              {paciente.telefono && (
                                <Typography 
                                  component="span" 
                                  variant="body2" 
                                  color="textSecondary"
                                  sx={{ ml: 1 }}
                                >
                                  • {paciente.telefono}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          {existingTokens.some(t => t.pacienteId === paciente.id) && (
                            <Tooltip title="Ya tiene un enlace generado">
                              <Chip
                                label="Compartido"
                                color="info"
                                size="small"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </>
          )}
        </Box>
      </Container>
      
      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Generar enlaces de acceso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de generar enlaces de acceso para {selectedPacientes.length} pacientes.
            {existingTokens.filter(t => selectedPacientes.includes(t.pacienteId)).length > 0 && (
              <Box component="span" fontWeight="bold">
                {" "}Algunos pacientes ya tienen enlaces generados y serán actualizados.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={generatingTokens}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmGenerarTokens} 
            color="primary" 
            variant="contained"
            disabled={generatingTokens}
            startIcon={generatingTokens && <CircularProgress size={20} />}
          >
            {generatingTokens ? 'Generando...' : 'Generar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </SidebarMenu>
  );
};

export default CompartirPrograma; 