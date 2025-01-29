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
import LoadingBackdrop from './components/LoadingBackdrop';

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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          setSession(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        setSession(true);
        const { data: user, error } = await supabase.auth.getUser();
        
        if (error || !user?.user?.id) {
          console.error('Error fetching user:', error);
          setSession(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users_table')
          .select('role')
          .eq('user_id', user.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user role:', userError);
          setSession(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        const role = userData?.role || null;
        setUserRole(role);

        const currentPath = window.location.pathname;
        const isPublicRoute = ['/login', '/signup', '/reset-password', '/reset-password/confirm', '/new-password'].includes(currentPath);

        if (!isPublicRoute) {
          if (role === 'professional' && !currentPath.includes('/professional-dashboard')) {
            navigate('/professional-dashboard');
          } else if ((role === 'gestor' || role === 'admin') && !currentPath.includes('/manager-dashboard')) {
            navigate('/manager-dashboard');
          }
        }

      } catch (error) {
        console.error('Error in checkSession:', error);
        setSession(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const ProtectedProfessionalRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) return <Navigate to="/login" replace />;
    if (userRole !== 'professional') return <Navigate to="/manager-dashboard" replace />;
    return <>{children}</>;
  };

  const ProtectedManagerRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) return <Navigate to="/login" replace />;
    if (userRole !== 'gestor' && userRole !== 'admin') return <Navigate to="/professional-dashboard" replace />;
    return <>{children}</>;
  };

  if (isLoading) {
    return <LoadingBackdrop open={true} />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={
          session ? (
            userRole === 'professional' ? 
              <Navigate to="/professional-dashboard" replace /> : 
              <Navigate to="/manager-dashboard" replace />
          ) : <LoginPage />
        } />

        <Route path="/signup" element={!session ? <SignUpPage /> : (
          userRole === 'professional' ? <Navigate to="/professional-dashboard" replace /> :
          <Navigate to="/manager-dashboard" replace />
        )} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />

        <Route path="/" element={
          !session ? <Navigate to="/login" replace /> :
          userRole === 'professional' ? <Navigate to="/professional-dashboard" replace /> :
          <Navigate to="/manager-dashboard" replace />
        } />

        <Route path="/professional-dashboard/*" element={
          <ProtectedProfessionalRoute>
            <ProfessionalDashboard />
          </ProtectedProfessionalRoute>
        } />

        <Route path="/manager-dashboard/*" element={
          <ProtectedManagerRoute>
            <ManagerDashboard />
          </ProtectedManagerRoute>
        } />

        <Route path="*" element={
          !session ? <Navigate to="/login" replace /> :
          userRole === 'professional' ? <Navigate to="/professional-dashboard" replace /> :
          <Navigate to="/manager-dashboard" replace />
        } />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
