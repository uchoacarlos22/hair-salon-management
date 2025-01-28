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

    const SignUpPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password || !confirmPassword) {
          setError('Por favor, preencha todos os campos.');
          return;
        }

        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          return;
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: "profissional", // Role padrão
              },
            },
          });

          if (error) {
            setError(`Erro ao cadastrar: ${error.message}`);
          } else {
            // Insert user data into the users_table
            const { error: userError } = await supabase
              .from('users_table')
              .insert([{ user_id: data.user?.id, email: email, role: 'profissional' }]);

            if (userError) {
              setError(`Erro ao inserir dados do usuário: ${userError.message}`);
            } else {
              setSuccess('Cadastro realizado com sucesso! Redirecionando para a tela de login...');
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            }
          }
        } catch (err) {
          setError('Ocorreu um erro ao tentar cadastrar.');
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
              Cadastro
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
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
            <TextField
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
            <Typography variant="body2" align="center">
              Já tem uma conta?{' '}
              <Link href="/login" underline="hover">
                Faça login aqui!
              </Link>
            </Typography>
          </Box>
        </Box>
      );
    };

    export default SignUpPage;
