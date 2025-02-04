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
import { useAdminDashboard, User } from '../hooks/useAdminDashboard';

const AdminDashboard = () => {
  const { users, loading, error, handleRoleChange } = useAdminDashboard();

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
          {users.map((user: User) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel id={`role-select-label-${user.user_id}`}>Role</InputLabel>
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
                  onClick={() =>
                    handleRoleChange(
                      user.user_id,
                      user.role === 'profissional' ? 'gestor' : 'profissional'
                    )
                  }
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
