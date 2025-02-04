// src/services/professionalsService.ts

import { supabase } from './supabaseClient';
import { User } from '../types/users';

/**
 * Busca os profissionais cadastrados.
 */
export const fetchProfessionals = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users_table')
    .select('user_id, name, email, phone, address, role, status');
  if (error) {
    throw error;
  }
  return data as User[];
};

/**
 * Atualiza o status de um profissional.
 */
export const updateProfessionalStatus = async (id: string, newStatus: boolean): Promise<void> => {
  const { error } = await supabase
    .from('users_table')
    .update({ status: newStatus })
    .eq('user_id', id);
  if (error) {
    throw error;
  }
};

/**
 * Atualiza a role de um profissional.
 */
export const updateProfessionalRole = async (
  id: string,
  newRole: 'professional' | 'manager',
): Promise<void> => {
  const { error } = await supabase
    .from('users_table')
    .update({ role: newRole })
    .eq('user_id', id);
  if (error) {
    throw error;
  }
};
