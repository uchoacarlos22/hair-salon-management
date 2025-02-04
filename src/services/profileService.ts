// src/services/profileService.ts

import { supabase } from './supabaseClient';
import { User } from '../types/users';

/**
 * Busca os dados do perfil do usuário autenticado.
 */
export const fetchProfileData = async (): Promise<User> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user?.id) {
    throw new Error('Usuário não autenticado.');
  }

  const { data, error } = await supabase
    .from('users_table')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as User;
};

/**
 * Faz o upload da foto de perfil e retorna a URL pública.
 */
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user?.id) {
    throw new Error('Usuário não autenticado.');
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
    throw new Error(`Erro ao fazer upload da foto: ${uploadError.message}`);
  }

  const { data: imageUrl } = supabase.storage
    .from('bucket_1')
    .getPublicUrl(filePath);

  return imageUrl.publicUrl;
};

/**
 * Atualiza os dados do perfil do usuário.
 */
export const updateProfileData = async (profile: Partial<User>): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user?.id) {
    throw new Error('Usuário não autenticado.');
  }

  const { error } = await supabase
    .from('users_table')
    .update(profile)
    .eq('user_id', user.user.id);

  if (error) {
    throw error;
  }
};
