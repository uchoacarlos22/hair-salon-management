// src/components/UserProfile.tsx
import React from 'react';
import {
  Alert,
  IconButton,
  Avatar,
  Box,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useUserProfile } from '../hooks/useUserProfile';

export const UserProfile: React.FC = () => {
  const {
    error,
    loading,
    success,
    avatarUrl,
    userData,
    isEditing,
    setIsEditing,
    setUserData,
    handlePhotoUpload,
    handleSave,
  } = useUserProfile();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={avatarUrl || undefined} sx={{ width: 100, height: 100 }} />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handlePhotoUpload}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            disabled={loading}
            sx={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            {loading ? <CircularProgress size={24} /> : <PhotoCamera />}
          </IconButton>
        </label>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => {}}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => {}}>
          Foto atualizada com sucesso!
        </Alert>
      )}

      {userData && (
        <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            value={userData.name || ''}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Email"
            value={userData.email || ''}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Telefone"
            value={userData.phone || ''}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Endereço"
            value={userData.address || ''}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            margin="normal"
            disabled={!isEditing}
          />

          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!isEditing ? (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            ) : (
              <>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Salvar
                </Button>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
