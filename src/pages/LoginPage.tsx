// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Utiliza o hook de login para obter a função login, bem como os estados de erro e loading
  const { login, error, loading, setError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro anteriores

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/home');
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
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Entrar
        </Button>
        <Typography variant="body2" align="center">
          Não tem uma conta?{' '}
          <Link href="/signup" underline="hover">
            Cadastre-se aqui!
          </Link>
        </Typography>
        <Typography variant="body2" align="center">
          Esqueceu sua senha?{' '}
          <Link href="/reset-password" underline="hover">
            Recupere aqui!
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
