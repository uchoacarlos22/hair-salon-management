import { ChangeEvent, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, IconButton, Alert } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useProfile } from '../hooks/useProfile';

const Profile = () => {
  const { profile, loading, errorMessage, successMessage, setErrorMessage, setSuccessMessage, handleProfilePictureUpload, updateProfile } = useProfile();

  // Estados locais para os campos editáveis
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Atualiza os estados locais quando o perfil é carregado
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleProfilePictureUpload(files[0]);
    }
  };

  const handleSubmit = async () => {
    // Limpa mensagens anteriores
    setErrorMessage('');
    setSuccessMessage('');
    await updateProfile({
      name,
      phone,
      address,
      profile_pictures: profile?.profile_pictures || null,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meus Dados
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar
          src={profile?.profile_pictures || undefined}
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-picture-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-picture-upload">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCameraIcon />
          </IconButton>
        </label>
      </Box>

      <TextField
        label="Nome Completo"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={profile?.email || ''}
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Telefone"
        fullWidth
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <TextField
        label="Endereço (opcional)"
        fullWidth
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
