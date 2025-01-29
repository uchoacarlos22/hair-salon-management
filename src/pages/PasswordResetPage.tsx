import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email) {
      setError('Por favor, insira seu email.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`,
      });
      
      if (error) throw error;
      
      setMessage('Verifique seu email para o link de recuperação de senha');
    } catch (error) {
      setError('Erro ao enviar email de recuperação');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          Recuperação de Senha
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
        </Button>
        <Typography variant="body2" align="center">
          <Link href="/login" underline="hover">
            Voltar ao Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordResetPage;
