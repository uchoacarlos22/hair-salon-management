// src/hooks/useResetPasswordConfirm.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useResetPasswordConfirm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extração do token da URL
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição de senha inválido.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Nota: em alguns fluxos de redefinição de senha o token é utilizado em outras chamadas,
      // porém, aqui usamos apenas supabase.auth.updateUser.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(`Erro ao redefinir senha: ${error.message}`);
      } else {
        setMessage('Senha redefinida com sucesso! Redirecionando para a tela de login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    message,
    error,
    loading,
    handleSubmit,
  };
};
