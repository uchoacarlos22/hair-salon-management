import React, { useState, useEffect } from 'react';
    import {
      TextField,
      Button,
      Box,
      Typography,
      Avatar,
      IconButton,
      Alert,
    } from '@mui/material';
    import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
    import { supabase } from '../services/supabaseClient';

    const Profile = () => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [address, setAddress] = useState('');
      const [profilePictures, setProfilePicture] = useState<string | null>(null);
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        const fetchProfileData = async () => {
          setLoading(true);
          try {
            const { data: user } = await supabase.auth.getUser();
            if (!user?.user?.id) {
              setErrorMessage('Usuário não autenticado.');
              return;
            }

            const { data, error } = await supabase
              .from('users_table')
              .select('*')
              .eq('user_id', user.user.id)
              .single();

            if (error) {
              setErrorMessage(`Erro ao buscar dados do perfil: ${error.message}`);
            } else if (data) {
              setName(data.name || '');
              setEmail(data.email || '');
              setPhone(data.phone || '');
              setAddress(data.address || '');
              setProfilePicture(data.profile_pictures || null);
            }
          } catch (err) {
            setErrorMessage('Ocorreu um erro ao buscar os dados do perfil.');
          } finally {
            setLoading(false);
          }
        };

        fetchProfileData();
      }, []);

      const handleProfilePictureUpload = async (event: any) => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        const file = event.target.files[0];

        if (!file) {
          setLoading(false);
          return;
        }

        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user?.id) {
            setErrorMessage('Usuário não autenticado.');
            setLoading(false);
            return;
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${user.user.id}-${Date.now()}.${fileExt}`;
          const filePath = `profile_pictures/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('bucket_1')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            setErrorMessage(`Erro ao fazer upload da foto: ${uploadError.message}`);
            setLoading(false);
            return;
          }

          const { data: imageUrl } = supabase.storage
            .from('bucket_1')
            .getPublicUrl(filePath);

          setProfilePicture(imageUrl.publicUrl);
          setSuccessMessage('Foto de perfil atualizada com sucesso!');
        } catch (err) {
          setErrorMessage('Ocorreu um erro ao fazer upload da foto.');
        } finally {
          setLoading(false);
        }
      };

      const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user?.id) {
            setErrorMessage('Usuário não autenticado.');
            setLoading(false);
            return;
          }

          const { error } = await supabase
            .from('users_table')
            .update({
              name: name,
              phone: phone,
              address: address,
              profile_pictures: profilePictures,
            })
            .eq('user_id', user.user.id);

          if (error) {
            setErrorMessage(`Erro ao salvar alterações: ${error.message}`);
          } else {
            setSuccessMessage('Dados pessoais atualizados com sucesso!');
          }
        } catch (err) {
          setErrorMessage('Ocorreu um erro ao tentar salvar as alterações.');
        } finally {
          setLoading(false);
        }
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
              src={profilePictures || undefined}
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureUpload}
            />
            <label htmlFor="profile-picture-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
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
            value={email}
            InputProps={{
              readOnly: true,
            }}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Salvar Alterações
            </Button>
          </Box>
        </Box>
      );
    };

    export default Profile;
