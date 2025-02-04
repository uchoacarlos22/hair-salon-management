// src/hooks/usePasswordReset.ts
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const usePasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email) {
      setError('Por favor, insira seu email.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`,
      });

      if (error) {
        throw error;
      }

      setMessage('Verifique seu email para o link de recuperação de senha');
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    sendResetEmail,
  };
};
