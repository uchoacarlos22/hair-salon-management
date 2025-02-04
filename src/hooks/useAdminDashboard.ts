// src/hooks/useAdminDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export interface User {
  user_id: string;
  email: string;
  role: string;
}

export const useAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users_table').select('*');
      if (error) {
        setError(`Erro ao buscar usuários: ${error.message}`);
      } else {
        setUsers(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Ocorreu um erro ao buscar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users_table')
        .update({ role: newRole })
        .eq('user_id', userId);
      if (error) {
        setError(`Erro ao atualizar role do usuário: ${error.message}`);
      } else {
        setUsers(users.map(user =>
          user.user_id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (err) {
      setError('Ocorreu um erro ao atualizar a role do usuário.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, handleRoleChange };
};
