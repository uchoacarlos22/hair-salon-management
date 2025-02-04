// src/hooks/useSignUp.ts
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      // Cadastro do usuário via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "profissional", // Role padrão
          },
        },
      });

      if (error) {
        setError(`Erro ao cadastrar: ${error.message}`);
      } else {
        // Inserção dos dados do usuário na tabela "users_table"
        const { error: userError } = await supabase
          .from('users_table')
          .insert([{ user_id: data.user?.id, email: email, role: 'profissional' }]);

        if (userError) {
          setError(`Erro ao inserir dados do usuário: ${userError.message}`);
        } else {
          setSuccess('Cadastro realizado com sucesso! Redirecionando para a tela de login...');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar cadastrar.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit,
  };
};
