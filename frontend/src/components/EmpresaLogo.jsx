import React, { useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
  
  // Verificar y preparar URL
  const processedLogoUrl = logoUrl && !logoUrl.includes('logo192.png') 
    ? (logoUrl.startsWith('http') || logoUrl.startsWith('/') ? logoUrl : `${process.env.REACT_APP_API_URL}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`)
    : null;
  
  // Si no hay logo y no usamos logo por defecto, no mostrar nada
  if (!processedLogoUrl && !useDefaultLogo) {
    return null;
  }

  // Manejar errores en la carga de la imagen
  const handleError = () => {
    console.warn('Error al cargar el logo:', processedLogoUrl);
    setHasError(true);
  };

  return !hasError && processedLogoUrl ? (
    <Box 
      component="img" 
      src={processedLogoUrl} 
      alt="Logo empresa" 
      onError={handleError}
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