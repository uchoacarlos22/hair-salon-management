import React, { useState } from 'react';
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
    import { supabase } from '../services/supabaseClient';

    const RegisterService = () => {
      const [services, setServices] = useState([
        { name: '', value: '', observations: '' },
      ]);
      const [total, setTotal] = useState(0);
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');

      const handleAddService = () => {
        setServices([...services, { name: '', value: '', observations: '' }]);
      };

      const handleRemoveService = (index: number) => {
        const newServices = [...services];
        newServices.splice(index, 1);
        setServices(newServices);
      };

      const handleServiceChange = (
        index: number,
        field: string,
        value: string
      ) => {
        const newServices = [...services];
        newServices[index][field] = value;
        setServices(newServices);
        calculateTotal(newServices);
      };

      const calculateTotal = (services: any) => {
        let newTotal = 0;
        services.forEach((service: any) => {
          const value = parseFloat(service.value);
          if (!isNaN(value)) {
            newTotal += value;
          }
        });
        setTotal(newTotal);
      };

      const handleSubmit = async () => {
        setSuccessMessage('');
        setErrorMessage('');

        if (services.some((service) => !service.name || !service.value)) {
          setErrorMessage('Por favor, preencha todos os campos do serviço.');
          return;
        }

        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user?.id) {
            setErrorMessage('Usuário não autenticado.');
            return;
          }

          const now = new Date();
          const formattedDate = now.toISOString();

          const serviceData = {
            professional_id: user.user.id,
            date: formattedDate,
            services: services,
            total: total,
          };

          const { error } = await supabase.from('service_records').insert([serviceData]);

          if (error) {
            setErrorMessage(`Erro ao registrar serviço: ${error.message}`);
          } else {
            setSuccessMessage('Serviço registrado com sucesso!');
            setServices([{ name: '', value: '', observations: '' }]);
            setTotal(0);
          }
        } catch (err) {
          setErrorMessage('Ocorreu um erro ao tentar registrar o serviço.');
        }
      };

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
