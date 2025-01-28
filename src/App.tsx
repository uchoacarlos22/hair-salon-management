import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { fetchTestData, supabase } from './services/supabaseClient';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage';
import NewPasswordPage from './pages/NewPasswordPage';
import AdminPanel from './components/AdminPanel';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ProductsDashboard from './components/ProductsDashboard';
import ErrorBoundary from './components/ErrorBoundary';

interface TestData {
  id: string;
  name: string;
  created_at: string;
}

function Home() {
  const [data, setData] = useState<TestData[]>([]);
  const navigate = useNavigate();
  const [session, setSession] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        setSession(false);
        return;
      }
      setSession(true);
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      if (user?.user?.id) {
        const { data: userData, error: userError } = await supabase
          .from('users_table')
          .select('role')
          .eq('user_id', user.user.id)
          .single();
        if (userError) {
          console.error('Error fetching user role:', userError);
          return;
        }
        setUserRole(userData?.role || null);
      }
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
      <Typography variant="h4">Home (Visitante)</Typography>
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
  const [session, setSession] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          setSession(false);
          navigate('/login');
          return;
        }

        setSession(true);
        const { data: user, error } = await supabase.auth.getUser();
        
        if (error || !user?.user?.id) {
          console.error('Error fetching user:', error);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users_table')
          .select('role')
          .eq('user_id', user.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user role:', userError);
          return;
        }

        setUserRole(userData?.role || null);

        // Lógica de redirecionamento baseada no papel do usuário
        if (userData?.role === 'profissional') {
          navigate('/professional-dashboard');
        } else if (userData?.role === 'gestor' || userData?.role === 'admin') {
          navigate('/manager-dashboard');
        }
      } catch (error) {
        console.error('Error in checkSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []); // Removido navigate do array de dependências para evitar loop

  if (isLoading) {
    return <div>Carregando...</div>; // Ou um componente de loading mais elaborado
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/home" element={<Home />} />
        <Route 
          path="/professional-dashboard/*" 
          element={
            userRole === 'profissional' ? 
              <ProfessionalDashboard /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/manager-dashboard" 
          element={
            userRole === 'gestor' || userRole === 'admin' ? 
              <ManagerDashboard /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route path="/products-dashboard" element={<ProductsDashboard />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
