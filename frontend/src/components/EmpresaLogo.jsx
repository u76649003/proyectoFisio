import React, { useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import logoImg from '../assets/logo.svg';

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
const EmpresaLogo = ({ 
  logoUrl, 
  altText = "Logo de la empresa", 
  size = 50, 
  className = '',
  useDefaultLogo = false
}) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  const styles = {
    avatar: {
      width: size,
      height: size,
      backgroundColor: error || !logoUrl ? '#f5f5f5' : 'transparent',
      '& .MuiSvgIcon-root': {
        fontSize: size * 0.6
      }
    },
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  };
  
  return (
    <Box className={`empresa-logo-container ${className}`}>
      <Avatar sx={styles.avatar}>
        {!error && logoUrl ? (
          <img 
            src={logoUrl} 
            alt={altText} 
            onError={handleError}
            style={styles.img}
          />
        ) : useDefaultLogo ? (
          <img 
            src={logoImg} 
            alt="Logo FisioAyuda" 
            style={styles.img}
          />
        ) : (
          <BusinessIcon color="primary" />
        )}
      </Avatar>
    </Box>
  );
};

export default EmpresaLogo; 