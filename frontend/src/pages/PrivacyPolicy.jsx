import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logoImg from '../assets/logo.svg';

const Logo = styled('img')({
  height: '50px',
  marginRight: '10px'
});

const PolicyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '12px',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const SubsectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const PrivacyPolicy = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      {/* Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, mb: 4 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo src={logoImg} alt="FisioAyuda Logo" />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              FisioAyuda
            </Typography>
          </Box>
        </Link>
      </Box>
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <img src={logoImg} alt="FisioAyuda Logo" style={{ height: '80px', marginBottom: '20px' }} />
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
              Política de Privacidad
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="body1" paragraph>
              Última actualización: {new Date().toLocaleDateString()}
            </Typography>
            
            <Typography variant="body1" paragraph>
              FisioAyuda ("nosotros", "nuestro" o "nos") está comprometido con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestra aplicación y servicios.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              1. Información que recopilamos
            </Typography>
            <Typography variant="body1" paragraph>
              Podemos recopilar los siguientes tipos de información:
            </Typography>
            <ul>
              <Typography component="li" variant="body1">Información de identificación personal (nombre, correo electrónico, teléfono)</Typography>
              <Typography component="li" variant="body1">Información médica y de salud relevante para el tratamiento fisioterapéutico</Typography>
              <Typography component="li" variant="body1">Información del dispositivo y uso de la aplicación</Typography>
              <Typography component="li" variant="body1">Comunicaciones con nosotros</Typography>
            </ul>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              2. Cómo utilizamos su información
            </Typography>
            <Typography variant="body1" paragraph>
              Utilizamos su información para:
            </Typography>
            <ul>
              <Typography component="li" variant="body1">Proporcionar, mantener y mejorar nuestros servicios</Typography>
              <Typography component="li" variant="body1">Personalizar su experiencia de tratamiento</Typography>
              <Typography component="li" variant="body1">Comunicarnos con usted sobre citas, tratamientos y actualizaciones del servicio</Typography>
              <Typography component="li" variant="body1">Cumplir con requisitos legales y regulatorios</Typography>
              <Typography component="li" variant="body1">Prevenir fraudes y mejorar la seguridad</Typography>
            </ul>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              3. Base legal para el procesamiento
            </Typography>
            <Typography variant="body1" paragraph>
              Procesamos su información personal con las siguientes bases legales:
            </Typography>
            <ul>
              <Typography component="li" variant="body1">Su consentimiento</Typography>
              <Typography component="li" variant="body1">Necesidad contractual para proporcionar nuestros servicios</Typography>
              <Typography component="li" variant="body1">Nuestros intereses legítimos, siempre que no prevalezcan sobre sus derechos</Typography>
              <Typography component="li" variant="body1">Cumplimiento de obligaciones legales</Typography>
            </ul>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              4. Retención de datos
            </Typography>
            <Typography variant="body1" paragraph>
              Conservamos su información personal durante el tiempo necesario para los fines establecidos en esta política, o según lo requiera la ley, especialmente la normativa sanitaria que exige la conservación de historiales médicos durante un período determinado.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              5. Transferencia de datos
            </Typography>
            <Typography variant="body1" paragraph>
              No transferimos sus datos personales fuera del Espacio Económico Europeo (EEE) sin garantías adecuadas y su consentimiento, cuando sea necesario. Cualquier transferencia cumplirá con las leyes de protección de datos aplicables.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              6. Divulgación de su información
            </Typography>
            <Typography variant="body1" paragraph>
              Podemos compartir su información con:
            </Typography>
            <ul>
              <Typography component="li" variant="body1">Profesionales sanitarios involucrados en su tratamiento</Typography>
              <Typography component="li" variant="body1">Proveedores de servicios que nos asisten en la operación de nuestra plataforma</Typography>
              <Typography component="li" variant="body1">Autoridades cuando sea requerido por ley</Typography>
            </ul>
            <Typography variant="body1" paragraph>
              No vendemos ni alquilamos su información personal a terceros.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              7. Seguridad de datos
            </Typography>
            <Typography variant="body1" paragraph>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la divulgación, alteración y destrucción.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              8. Sus derechos
            </Typography>
            <Typography variant="body1" paragraph>
              Según las leyes de protección de datos aplicables, puede tener los siguientes derechos:
            </Typography>
            <ul>
              <Typography component="li" variant="body1">Acceder a su información personal</Typography>
              <Typography component="li" variant="body1">Rectificar datos inexactos</Typography>
              <Typography component="li" variant="body1">Eliminar sus datos (con ciertas limitaciones debido a requisitos médicos/legales)</Typography>
              <Typography component="li" variant="body1">Limitar u oponerse al procesamiento</Typography>
              <Typography component="li" variant="body1">Portabilidad de datos</Typography>
              <Typography component="li" variant="body1">Retirar el consentimiento</Typography>
              <Typography component="li" variant="body1">Presentar una reclamación ante una autoridad de control</Typography>
            </ul>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              9. Política de cookies
            </Typography>
            <Typography variant="body1" paragraph>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso y personalizar contenido. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              10. Proveedores de servicios
            </Typography>
            <Typography variant="body1" paragraph>
              Trabajamos con proveedores de servicios externos que nos ayudan a operar nuestra plataforma. Estos proveedores tienen acceso limitado a su información y están obligados contractualmente a protegerla de acuerdo con esta política.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              11. Cambios a esta política
            </Typography>
            <Typography variant="body1" paragraph>
              Podemos actualizar esta política periódicamente para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o regulatorios. Le notificaremos cualquier cambio material publicando la nueva Política de Privacidad y, cuando sea apropiado, mediante notificación directa.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              12. Contacto
            </Typography>
            <Typography variant="body1" paragraph>
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos en:
            </Typography>
            <Typography variant="body1" paragraph>
              Email: contacto@fisioayuda.com
            </Typography>
            <Typography variant="body1" paragraph>
              Dirección: [Dirección física de la clínica]
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} FisioAyuda - Todos los derechos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy; 