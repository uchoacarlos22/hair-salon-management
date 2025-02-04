// src/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { userService } from '../services/userService';

export interface UserData {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profile_pictures?: string;
}

/**
 * Hook que gerencia a lógica do perfil do usuário:
 * - Carrega os dados do perfil (incluindo foto);
 * - Realiza o upload da foto de perfil;
 * - Atualiza os dados do perfil.
 */
export const useUserProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validação do tamanho (máx 5MB)
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
    } catch (err) {
      console.error('Erro no upload:', err);
      setError('Erro ao fazer upload da foto: ' + (err as Error).message);
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
          address: userData.address,
        })
        .eq('user_id', userData.user_id);

      if (error) throw error;
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar alterações: ' + (err as Error).message);
    }
  };

  return {
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
  };
};
