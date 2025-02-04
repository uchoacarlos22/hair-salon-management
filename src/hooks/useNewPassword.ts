// src/hooks/useNewPassword.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedToken, setExtractedToken] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordLengthError, setPasswordLengthError] = useState('');

  // Extrai o token da URL (hash)
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const urlParams = new URLSearchParams(hash);
      const tokenFromHash = urlParams.get('access_token');
      setExtractedToken(tokenFromHash);
      if (!tokenFromHash) {
        setError('Token de redefinição de senha inválido.');
      }
    } else {
      setError('Token de redefinição de senha inválido.');
    }
  }, []);

  // Validação de tamanho da senha
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordLengthError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    setPasswordLengthError('');
    return true;
  };

  // Quando o usuário digita a nova senha, realiza a validação
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    validatePassword(value);
  };

  // Atualiza o estado da confirmação de senha
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmNewPassword(value);
  };

  // Verifica se as senhas coincidem
  useEffect(() => {
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setPasswordMatchError('As senhas devem coincidir.');
    } else {
      setPasswordMatchError('');
    }
  }, [newPassword, confirmNewPassword]);

  // Envia a atualização da senha para o Supabase
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

    if (!validatePassword(newPassword)) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(`Erro ao redefinir senha: ${error.message}`);
      } else {
        setMessage('Sua senha foi redefinida com sucesso. Você pode fazer login novamente.');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    confirmNewPassword,
    message,
    error,
    loading,
    extractedToken,
    passwordMatchError,
    passwordLengthError,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
};
