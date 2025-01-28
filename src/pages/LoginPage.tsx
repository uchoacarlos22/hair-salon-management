import React, { useState } from 'react';
    import {
      TextField,
      Button,
      Box,
      Typography,
      Link,
      Alert,
    } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '../services/supabaseClient';

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
          setError('Por favor, preencha todos os campos.');
          return;
        }

        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setError('Credenciais inválidas. Verifique seu email e senha.');
          } else {
            navigate('/home');
          }
        } catch (err) {
          setError('Ocorreu um erro ao tentar fazer login.');
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
            <Button type="submit" variant="contained" color="primary">
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
