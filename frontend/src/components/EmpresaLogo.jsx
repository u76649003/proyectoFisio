import React from 'react';
import { Box, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

/**
 * Componente para mostrar el logo de una empresa con manejo de errores
 * 
 * @param {Object} props 
 * @param {string} props.logoUrl - URL del logo a mostrar
 * @param {string} props.altText - Texto alternativo para la imagen
 * @param {number} props.size - Tamaño del avatar (en px)
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.useDefaultLogo - Si debe usar el logo por defecto en vez de icono en caso de error
 * @returns {JSX.Element} Componente de logo
 */
const EmpresaLogo = ({ logoUrl, size = 40, useDefaultLogo = false, sx = {} }) => {
  if (!logoUrl && !useDefaultLogo) {
    return null;
  }

  return logoUrl ? (
    <Box 
      component="img" 
      src={logoUrl} 
      alt="Logo empresa" 
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        ...sx
      }} 
    />
  ) : (
    <Avatar 
      sx={{ 
        width: size, 
        height: size, 
        bgcolor: 'primary.light',
        ...sx
      }}
    >
      <BusinessIcon />
    </Avatar>
  );
};

export default EmpresaLogo; 