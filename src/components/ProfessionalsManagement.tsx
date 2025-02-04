// src/pages/ProfessionalsManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  AlertColor,
  useMediaQuery,
  useTheme,
  TablePagination,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useProfessionals } from '../hooks/useProfessionals';
import { User } from '../types/users';

const ProfessionalsManagement = () => {
  const { professionals, loading, error, changeProfessionalStatus, changeProfessionalRole } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const professionalsPerPage = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [professionalsToDisplay, setProfessionalsToDisplay] = useState<User[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Filtragem dos profissionais
  const filteredProfessionals = professionals.filter((professional) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const searchMatch =
      searchRegex.test(professional.name) || searchRegex.test(professional.email);
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'active' && professional.status) ||
      (statusFilter === 'inactive' && !professional.status);
    return searchMatch && statusMatch;
  });

  // Atualiza a paginação sempre que os filtros ou os profissionais mudarem
  useEffect(() => {
    const startIndex = currentPage * professionalsPerPage;
    const endIndex = startIndex + professionalsPerPage;
    setProfessionalsToDisplay(filteredProfessionals.slice(startIndex, endIndex));
  }, [professionals, currentPage, searchTerm, statusFilter, filteredProfessionals]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: 'all' | 'active' | 'inactive',
  ) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      setCurrentPage(0); // reseta a paginação ao alterar o filtro
    }
  };

  const handleOpenModal = (professional: User) => {
    setSelectedProfessional({ ...professional, user_id: professional.user_id });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await changeProfessionalStatus(id, newStatus);
      setAlert({
        open: true,
        message: 'Status atualizado com sucesso!',
        severity: 'success',
      });
      if (selectedProfessional) {
        setSelectedProfessional({ ...selectedProfessional, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating professional status:', error);
      setAlert({
        open: true,
        message: 'Erro ao atualizar status.',
        severity: 'error',
      });
    }
  };

  const handleRoleChange = async (id: string, newRole: 'professional' | 'manager') => {
    try {
      await changeProfessionalRole(id, newRole);
      setAlert({
        open: true,
        message: 'Role atualizada com sucesso!',
        severity: 'success',
      });
      if (selectedProfessional) {
        setSelectedProfessional({ ...selectedProfessional, role: newRole });
      }
    } catch (error) {
      console.error('Error updating professional role:', error);
      setAlert({
        open: true,
        message: 'Erro ao atualizar role.',
        severity: 'error',
      });
    }
  };

  const handleSaveModal = async () => {
    if (selectedProfessional && selectedProfessional.user_id) {
      await handleRoleChange(selectedProfessional.user_id, selectedProfessional.role);
      handleCloseModal();
    }
  };

  const renderModal = () => {
    if (!selectedProfessional) return null;
    return (
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80%' : 400,
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Detalhes do Profissional
          </Typography>
          <Typography>Nome: {selectedProfessional.name}</Typography>
          <Typography>Email: {selectedProfessional.email}</Typography>
          <Typography>
            Telefone: {selectedProfessional.phone || 'Não informado'}
          </Typography>
          <Typography>
            Endereço: {selectedProfessional.address || 'Não informado'}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={selectedProfessional.status}
                onChange={(e) =>
                  setSelectedProfessional({
                    ...selectedProfessional,
                    status: e.target.checked,
                  })
                }
                name="status"
              />
            }
            label="Ativo"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedProfessional.role}
              label="Role"
              onChange={(e) =>
                setSelectedProfessional({
                  ...selectedProfessional,
                  role: e.target.value as 'professional' | 'manager',
                })
              }
            >
              <MenuItem value="professional">Profissional</MenuItem>
              <MenuItem value="manager">Gestor</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveModal}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Gerenciar Profissionais
      </Typography>
      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={handleStatusFilterChange}
        aria-label="status filter"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all">Todos</ToggleButton>
        <ToggleButton value="active">Ativos</ToggleButton>
        <ToggleButton value="inactive">Inativos</ToggleButton>
      </ToggleButtonGroup>
      {loading ? (
        <Typography>Carregando profissionais...</Typography>
      ) : (
        <>
          <TextField
            label="Buscar por nome ou email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professionalsToDisplay.map((professional, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {isMobile
                        ? `${professional.name.split(' ')[0]}...`
                        : professional.name}
                    </TableCell>
                    {!isMobile && <TableCell>{professional.email}</TableCell>}
                    <TableCell>
                      <Switch
                        checked={professional.status}
                        onChange={(e) =>
                          handleStatusChange(professional.user_id || '', e.target.checked)
                        }
                        name="status"
                      />
                    </TableCell>
                    <TableCell>{professional.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(professional)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredProfessionals.length}
              page={currentPage}
              onPageChange={(event, newPage) => setCurrentPage(newPage)}
              rowsPerPage={professionalsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              labelRowsPerPage=""
              sx={{
                width: '100%',
                borderTop: '1px solid #eee',
                alignItems: 'center',
              }}
            />
          </TableContainer>
          {renderModal()}
          {alert.open && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
            >
              {alert.message}
            </Alert>
          )}
        </>
      )}
    </>
  );
};

export default ProfessionalsManagement;
