import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const NewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const [extractedToken, setExtractedToken] = useState<string | null>(null);
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [passwordLengthError, setPasswordLengthError] = useState('');

    useEffect(() => {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const urlParams = new URLSearchParams(hash);
            const tokenFromHash = urlParams.get('access_token');
            setExtractedToken(tokenFromHash);
            if (!tokenFromHash) {
                setError('Token de redefinição de senha inválido.');
            }
        } else {
            setError('Token de redefinição de senha inválido.');
        }
    }, []);

    const validatePassword = (password: string) => {
        if (password.length < 6) {
            setPasswordLengthError('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }
        setPasswordLengthError('');
        return true;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmNewPassword(e.target.value);
    };

    useEffect(() => {
        if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
            setPasswordMatchError('As senhas devem coincidir.');
        } else {
            setPasswordMatchError('');
        }
    }, [newPassword, confirmNewPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
    }

    if (!validatePassword(newPassword)) {
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(`Erro ao redefinir senha: ${error.message}`);
      } else {
        setMessage('Sua senha foi redefinida com sucesso. Você pode fazer login novamente.');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar redefinir a senha.');
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
          Redefinir Senha
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {passwordMatchError && <Alert severity="error">{passwordMatchError}</Alert>}
        {passwordLengthError && <Alert severity="error">{passwordLengthError}</Alert>}
        <TextField
          label="Nova Senha"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          required
        />
        <TextField
          label="Confirmar Nova Senha"
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || newPassword !== confirmNewPassword || newPassword.length < 6}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
        </Button>
        {message && (
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
            >
                Voltar ao Login
            </Button>
        )}
      </Box>
    </Box>
  );
};

export default NewPasswordPage;
