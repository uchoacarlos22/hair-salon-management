import { useState, useEffect } from 'react';
    import {
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      Paper,
      Button,
      Select,
      MenuItem,
      FormControl,
      InputLabel,
    } from '@mui/material';
    import { supabase } from '../services/supabaseClient';

    interface User {
      user_id: string;
      email: string;
      role: string;
    }

    const AdminDashboard = () => {
      const [users, setUsers] = useState<User[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchUsers = async () => {
          setLoading(true);
          try {
            const { data, error } = await supabase
              .from('users_table')
              .select('*');
            if (error) {
              setError(`Erro ao buscar usuários: ${error.message}`);
            } else {
              setUsers(data || []);
            }
          } catch (err) {
            setError('Ocorreu um erro ao buscar os usuários.');
          } finally {
            setLoading(false);
          }
        };

        fetchUsers();
      }, []);

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

      if (loading) {
        return <p>Carregando usuários...</p>;
      }

      if (error) {
        return <p>Erro: {error}</p>;
      }

      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID do Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id={`role-select-label-${user.user_id}`}>
                        Role
                      </InputLabel>
                      <Select
                        labelId={`role-select-label-${user.user_id}`}
                        id={`role-select-${user.user_id}`}
                        value={user.role}
                        label="Role"
                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      >
                        <MenuItem value="profissional">Profissional</MenuItem>
                        <MenuItem value="gestor">Gestor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRoleChange(user.user_id, user.role === 'profissional' ? 'gestor' : 'profissional')}
                    >
                      {user.role === 'profissional' ? 'Tornar Gestor' : 'Tornar Profissional'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };

    export default AdminDashboard;
