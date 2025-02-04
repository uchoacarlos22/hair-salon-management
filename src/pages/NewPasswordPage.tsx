import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNewPassword } from '../hooks/useNewPassword';

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const {
    newPassword,
    confirmNewPassword,
    message,
    error,
    loading,
    passwordMatchError,
    passwordLengthError,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useNewPassword();

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
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
        />
        <TextField
          label="Confirmar Nova Senha"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
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
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Voltar ao Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NewPasswordPage;
