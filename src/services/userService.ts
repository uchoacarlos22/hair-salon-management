import { supabase } from './supabaseClient';

export const userService = {
  async uploadProfilePhoto(file: File) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `profile_pictures/${fileName}`;

      const { data: existingFiles } = await supabase.storage
        .from('bucket_1')
        .list('profile_pictures');

      const existingFile = existingFiles?.find(f => f.name.startsWith(user.id));
      if (existingFile) {
        await supabase.storage
          .from('bucket_1')
          .remove([`profile_pictures/${existingFile.name}`]);
      }

      const { data, error: uploadError } = await supabase.storage
        .from('bucket_1')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro de upload:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('bucket_1')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users_table')
        .update({ profile_pictures: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error('Erro ao fazer upload da foto: ' + (error as Error).message);
    }
  },

  async getProfilePhoto(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users_table')
        .select('profile_pictures')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return data?.profile_pictures;
    } catch (error) {
      console.error('Erro ao buscar foto:', error);
      return null;
    }
  }
}; 