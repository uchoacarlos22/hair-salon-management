import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { supabase } from '../services/supabaseClient';
import { 
  Alert, 
  IconButton, 
  Avatar, 
  Box, 
  TextField, 
  Button,
  CircularProgress
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface UserData {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profile_pictures?: string;
}

export const UserProfile: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const photoUrl = await userService.getProfilePhoto(user.id);
        setAvatarUrl(photoUrl);
        
        const { data, error } = await supabase
          .from('users_table')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        setUserData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const url = await userService.uploadProfilePhoto(file);
      setAvatarUrl(url);
      setSuccess(true);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro ao fazer upload da foto: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!userData) return;

      const { error } = await supabase
        .from('users_table')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        })
        .eq('user_id', userData.user_id);

      if (error) throw error;
      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setError('Erro ao salvar alterações: ' + (error as Error).message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={avatarUrl || undefined}
          sx={{ width: 100, height: 100 }}
        />
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
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : <PhotoCamera />}
          </IconButton>
        </label>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)}>
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
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                >
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