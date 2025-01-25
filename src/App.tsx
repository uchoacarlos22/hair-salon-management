import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { fetchTestData } from './services/supabaseClient';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage';
import NewPasswordPage from './pages/NewPasswordPage';
import { supabase } from './services/supabaseClient';

interface TestData {
  id: string;
  name: string;
  created_at: string;
}

function Home() {
  const [data, setData] = useState<TestData[]>([]);
  const navigate = useNavigate();
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
      setSession(!!session);
    };

    checkSession();
    getData();
  }, [navigate]);

  const getData = async () => {
    try {
      const result = await fetchTestData();
      setData(result || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  if (session === false) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Home</Typography>
      <h1>Dados da Tabela: test_table</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            ID: {item.id}, Nome: {item.name}, Criado em:{' '}
            {item.created_at}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </Box>
  );
}

function About() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">About</Typography>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
