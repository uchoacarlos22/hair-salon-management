// src/hooks/useLogin.ts
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      // Realiza o login usando o método signInWithPassword do Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Credenciais inválidas. Verifique seu email e senha.');
        return false;
      }
      return true;
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading, setError };
};
