import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FitnessCenter,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { programasPersonalizadosService } from '../services/api';

const VisualizarPrograma = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [programa, setPrograma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Verificar token y cargar programa
  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar token
        const tokenData = await programasPersonalizadosService.verificarToken(token);
        if (!tokenData || !tokenData.programaId) {
          throw new Error('Token inválido o expirado');
        }
        
        // Cargar programa
        const data = await programasPersonalizadosService.getProgramaPorToken(token);
        setPrograma(data);
        
      } catch (error) {
        console.error('Error al verificar acceso:', error);
        setError('El enlace no es válido o ha expirado. Contacte con su fisioterapeuta.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchPrograma();
    }
  }, [token]);
  
  const handleVolver = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            FisioAyuda
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVolver}
              startIcon={<ArrowBackIcon />}
            >
              Volver al inicio
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              Página en desarrollo
            </Typography>
            <Typography paragraph>
              Esta funcionalidad está siendo implementada. Pronto podrás visualizar tus programas personalizados aquí.
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Token: {token}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVolver}
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Volver al inicio
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VisualizarPrograma; 