import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Error } from '@mui/icons-material';
import logoImg from '../assets/logo.svg';
import { authService } from '../services/api';

const Logo = styled('img')({
  height: '60px',
  marginRight: '15px'
});

const VerificationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '12px',
  textAlign: 'center',
  marginTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  }
}));

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || '¡Tu cuenta ha sido verificada correctamente!');
      } catch (error) {
        console.error('Error al verificar email:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'No se pudo verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.'
        );
      }
    };

    if (token) {
      verifyEmailToken();
    } else {
      setStatus('error');
      setMessage('Token de verificación no proporcionado.');
    }
  }, [token]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logoImg} alt="FisioAyuda Logo" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            FisioAyuda
          </Typography>
        </Box>
      </Box>
      
      <Container maxWidth="sm">
        <VerificationPaper elevation={3}>
          
          {status === 'loading' && (
            <>
              <CircularProgress sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Verificando tu correo electrónico
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Por favor espera mientras verificamos tu correo electrónico...
              </Typography>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle sx={{ fontSize: 70, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ¡Verificación Exitosa!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {message}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                to="/"
                size="large"
              >
                Iniciar Sesión
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <Error sx={{ fontSize: 70, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Error de Verificación
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {message}
              </Alert>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                to="/"
                size="large"
              >
                Volver al Inicio
              </Button>
            </>
          )}
          
        </VerificationPaper>
      </Container>
    </Box>
  );
};

export default VerifyEmail; 