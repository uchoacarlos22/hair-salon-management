// src/pages/PasswordResetPage.tsx
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
import { usePasswordReset } from '../hooks/usePasswordReset';

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    message,
    error,
    loading,
    sendResetEmail,
  } = usePasswordReset();

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
        onSubmit={sendResetEmail}
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
