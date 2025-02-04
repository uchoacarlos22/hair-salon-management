import { useState, useEffect } from 'react';
import { fetchProfileData, uploadProfilePicture, updateProfileData } from '../services/profileService';
import { User } from '../types/users';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchProfileData();
      setProfile(data);
      setErrorMessage('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Erro ao buscar dados do perfil.');
      } else {
        setErrorMessage('Erro ao buscar dados do perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    setLoading(true);
    try {
      const publicUrl = await uploadProfilePicture(file);
      setProfile((prev) => (prev ? { ...prev, profile_pictures: publicUrl } : prev));
      setSuccessMessage('Foto de perfil atualizada com sucesso!');
      setErrorMessage('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Ocorreu um erro ao fazer upload da foto.');
      } else {
        setErrorMessage('Ocorreu um erro ao fazer upload da foto.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setLoading(true);
    try {
      await updateProfileData(updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
      setSuccessMessage('Dados pessoais atualizados com sucesso!');
      setErrorMessage('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Erro ao salvar alterações.');
      } else {
        setErrorMessage('Erro ao salvar alterações.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { profile, loading, errorMessage, successMessage, setErrorMessage, setSuccessMessage, handleProfilePictureUpload, updateProfile };
};
