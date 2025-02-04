// src/components/RegisterService.tsx
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useRegisterService } from '../hooks/useRegisterService';

const RegisterService = () => {
  const {
    services,
    total,
    successMessage,
    errorMessage,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    handleSubmit,
  } = useRegisterService();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Registrar Serviço
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {services.map((service, index) => (
        <Box key={index} mb={2} border={1} p={2} borderRadius={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nome do Serviço"
                fullWidth
                value={service.name}
                onChange={(e) =>
                  handleServiceChange(index, 'name', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Valor do Serviço!!!!!!!!!!!!!"
                fullWidth
                type="number"
                value={service.value}
                onChange={(e) =>
                  handleServiceChange(index, 'value', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Observações"
                fullWidth
                multiline
                rows={2}
                value={service.observations}
                onChange={(e) =>
                  handleServiceChange(index, 'observations', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={1} textAlign="right">
              <IconButton
                onClick={() => handleRemoveService(index)}
                aria-label="remove service"
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddService}
          startIcon={<AddIcon />}
        >
          Adicionar Serviço
        </Button>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Total: R$ {total.toFixed(2)}</Typography>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Registrar Serviço
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterService;
