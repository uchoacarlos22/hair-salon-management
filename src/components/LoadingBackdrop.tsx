import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

interface LoadingBackdropProps {
  open: boolean;
}

export const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <Typography sx={{ 
        color: 'white',
        fontSize: { xs: '1rem', sm: '1.1rem' }
      }}>
        Carregando...
      </Typography>
    </Backdrop>
  );
};

export default LoadingBackdrop; 