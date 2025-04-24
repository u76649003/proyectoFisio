import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import logoImg from '../assets/logo.svg';

const Logo = styled('img')({
  height: '50px',
  marginRight: '10px'
});

const PolicyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '12px',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  }
}));

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      {/* Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logoImg} alt="FisioAyuda Logo" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            FisioAyuda
          </Typography>
        </Box>
        <Button 
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Volver
        </Button>
      </Box>
      
      <Container maxWidth="md">
        <PolicyPaper elevation={3}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Política de Privacidad
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1. Introducción
          </Typography>
          <Typography paragraph>
            En FisioAyuda, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando utiliza nuestra plataforma.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Datos que recopilamos
          </Typography>
          <Typography paragraph>
            Recopilamos información personal como su nombre, dirección de correo electrónico, número de teléfono, y datos relacionados con su práctica profesional. También podemos recopilar información sobre cómo utiliza nuestra plataforma para mejorar nuestros servicios.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Cómo utilizamos sus datos
          </Typography>
          <Typography paragraph>
            Utilizamos sus datos personales para:
          </Typography>
          <ul>
            <li>
              <Typography>Proporcionar y mantener nuestros servicios</Typography>
            </li>
            <li>
              <Typography>Mejorar y personalizar su experiencia</Typography>
            </li>
            <li>
              <Typography>Comunicarnos con usted sobre su cuenta y nuestros servicios</Typography>
            </li>
            <li>
              <Typography>Procesar pagos</Typography>
            </li>
            <li>
              <Typography>Cumplir con obligaciones legales</Typography>
            </li>
          </ul>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. Seguridad de los datos
          </Typography>
          <Typography paragraph>
            Implementamos medidas de seguridad adecuadas para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción. Todos los datos de pacientes se almacenan con encriptación de extremo a extremo.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Sus derechos
          </Typography>
          <Typography paragraph>
            Usted tiene derecho a acceder, rectificar o eliminar sus datos personales. También puede oponerse al procesamiento de sus datos o solicitar la portabilidad de los mismos. Para ejercer estos derechos, póngase en contacto con nosotros a través de info@fisioayuda.com.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Cambios en esta política
          </Typography>
          <Typography paragraph>
            Podemos actualizar nuestra política de privacidad ocasionalmente. Le notificaremos cualquier cambio publicando la nueva política de privacidad en esta página y, si los cambios son significativos, le enviaremos un correo electrónico.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. Contacto
          </Typography>
          <Typography paragraph>
            Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos en info@fisioayuda.com o a través de nuestro formulario de contacto.
          </Typography>
          
          <Typography sx={{ mt: 4, fontStyle: 'italic' }}>
            Última actualización: Junio 2024
          </Typography>
        </PolicyPaper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 