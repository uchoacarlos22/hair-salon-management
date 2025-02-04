// src/pages/ResetPasswordConfirmPage.tsx
import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useResetPasswordConfirm } from '../hooks/useResetPasswordConfirm';

const ResetPasswordConfirmPage = () => {
  const {
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    message,
    error,
    loading,
    handleSubmit,
  } = useResetPasswordConfirm();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f0f0f0"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        padding={3}
        borderRadius={2}
        bgcolor="white"
        maxWidth={400}
        width="100%"
      >
        <Typography variant="h5" align="center" gutterBottom>
          Redefinir Senha
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Nova Senha"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirmar Nova Senha"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Redefinir Senha'
          )}
        </Button>
        <Typography variant="body2" align="center">
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Voltar ao Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPasswordConfirmPage;
