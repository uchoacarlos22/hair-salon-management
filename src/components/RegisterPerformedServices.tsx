import React, { useState, useEffect, useCallback, SetStateAction } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Service } from '../types/services';
import { Product } from '../types/products';
import { servicesService } from '../services/servicesService';
import { productsService } from '../services/productsService';
import { performedServicesService } from '../services/performedServicesService';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import LoadingBackdrop from './LoadingBackdrop';

interface SelectedItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  value: number;
  quantity: number;
}

export const RegisterPerformedServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [productQuantity, setProductQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);

  const calculateTotal = useCallback(() => {
    const total = selectedItems.reduce((sum, item) => {
      return sum + item.value * item.quantity;
    }, 0);
    setTotalValue(total);
  }, [selectedItems]);

  useEffect(() => {
    calculateTotal();
  }, [selectedItems, calculateTotal]);

  useEffect(() => {
    loadServices();
    loadProducts();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.fetchProducts();
      setProducts(data as SetStateAction<Product[]>);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (!selectedService) return;

    const service = services.find((s) => s.service_id === selectedService);
    if (service) {
      setSelectedItems([
        ...selectedItems,
        {
          id: service.service_id,
          type: 'service',
          name: service.name,
          value: service.value,
          quantity: serviceQuantity,
        },
      ]);
      setSelectedService('');
      setServiceQuantity(1);
    }
  };

  const handleAddProduct = (productId: string, productQuantity: number) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      setSelectedItems((prev) => [
        ...prev,
        {
          id: product.product_id,
          type: 'product',
          name: product.name,
          value: product.value,
          quantity: productQuantity,
        },
      ]);
      // Limpar os campos após adicionar
      setSelectedProduct('');
      setProductQuantity(1);
    }
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError('Adicione pelo menos um item para registrar');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Buscar o usuário atual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Separar serviços e produtos
      const services = selectedItems
        .filter((item) => item.type === 'service')
        .map((item) => ({
          service_id: item.id,
          name: item.name,
          quantity: item.quantity,
          value: item.value,
        }));

      const products = selectedItems
        .filter((item) => item.type === 'product')
        .map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          value: item.value,
        }));

      const performedService = {
        user_id: user.id,
        service: services,
        products_sold: products,
        observations,
        data: new Date().toISOString(),
        total: totalValue,
      };

      await performedServicesService.createPerformedService(performedService);

      setSuccess(true);
      // Limpar o formulário
      setSelectedItems([]);
      setObservations('');
      setTotalValue(0);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/professional-dashboard/history');
      }, 2000);
    } catch (err) {
      console.error('Erro ao registrar serviço:', err);
      setError(
        err instanceof Error ? err.message : 'Erro ao registrar serviço',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
  };

  return (
    <>
      <LoadingBackdrop open={loading} />
      <Box
        component={Paper}
        sx={{
          p: { xs: 1.5, sm: 3 },
          maxWidth: '100%',
          mx: 'auto',
          mt: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Registro de Serviços Realizados
        </Typography>

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {/* Seleção de Serviços */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormControl size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Selecione o serviço</InputLabel>
                <Select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as string)}
                  label="Selecione o serviço"
                >
                  {services.map((service) => (
                    <MenuItem
                      key={service.service_id}
                      value={service.service_id}
                    >
                      {service.name} - R$ {service.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <TextField
                  type="number"
                  label="Qtd"
                  value={serviceQuantity}
                  onChange={(e) => setServiceQuantity(Number(e.target.value))}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ width: '80px' }}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddService}
                  size={isMobile ? 'small' : 'medium'}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Seleção de Produtos */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormControl size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Selecione o produto</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value as string)}
                  label="Selecione o produto"
                >
                  {products.map((product) => (
                    <MenuItem
                      key={product.product_id}
                      value={product.product_id}
                    >
                      {product.name} - R$ {product.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <TextField
                  type="number"
                  label="Qtd"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(Number(e.target.value))}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ width: '80px' }}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddProduct(selectedProduct, productQuantity)
                  }
                  size={isMobile ? 'small' : 'medium'}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Lista de itens */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 1,
                overflow: 'auto',
                mt: 1,
              }}
            >
              {/* Cabeçalho da tabela */}
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: '#f5f5f5',
                  borderBottom: '1px solid #ccc',
                  p: { xs: 1, sm: 1.5 },
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Nome
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 1, sm: 2 },
                    minWidth: 'auto',
                  }}
                >
                  <Typography
                    sx={{
                      width: '50px',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    Qtd
                  </Typography>
                  <Typography
                    sx={{
                      width: '80px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    Valor
                  </Typography>
                  <Box sx={{ width: '40px' }} />
                </Box>
              </Box>

              {/* Lista de itens */}
              <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                {selectedItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 2 },
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...selectedItems];
                          newItems[index] = {
                            ...newItems[index],
                            quantity: Number(e.target.value),
                          };
                          setSelectedItems(newItems);
                        }}
                        InputProps={{
                          inputProps: { min: 1 },
                          sx: { width: '50px' },
                        }}
                      />
                      <Typography
                        sx={{
                          width: '80px',
                          textAlign: 'right',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        R$ {(item.value * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(index)}
                        size="small"
                      >
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Observações"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
          </Grid>

          {/* Total e Botão */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  textAlign: 'right',
                }}
              >
                Valor Total: R$ {totalValue.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedItems.length === 0}
                size={isMobile ? 'medium' : 'large'}
                fullWidth
              >
                {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Serviço registrado com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default RegisterPerformedServices;
