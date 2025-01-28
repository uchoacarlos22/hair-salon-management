import React, { useState, useEffect, useCallback } from 'react';
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

interface SelectedItem {
  id: string;
  type: 'service' | 'product';
  title: string;
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

  const calculateTotal = useCallback(() => {
    const total = selectedItems.reduce((sum, item) => {
      return sum + (item.value * item.quantity);
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
      const data = await servicesService.fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsService.fetchProducts();
      setProducts(data as SetStateAction<Product[]>);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleAddService = () => {
    if (!selectedService) return;
    
    const service = services.find(s => s.service_id === selectedService);
    if (service) {
      setSelectedItems([...selectedItems, {
        id: service.service_id,
        type: 'service',
        title: service.title,
        value: service.value,
        quantity: serviceQuantity
      }]);
      setSelectedService('');
      setServiceQuantity(1);
    }
  };

  const handleAddProduct = (productId: string, productQuantity: number) => {
    const product = products.find(p => p.product_id === productId);
    if (product) {
      setSelectedItems(prev => [...prev, {
        id: product.product_id,
        type: 'product',
        title: product.name,
        value: product.value,
        quantity: productQuantity
      }]);
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Separar serviços e produtos
      const services = selectedItems
        .filter(item => item.type === 'service')
        .map(item => ({
          service_id: item.id,
          quantity: item.quantity,
          value: item.value
        }));

      const products = selectedItems
        .filter(item => item.type === 'product')
        .map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          value: item.value
        }));

      const performedService = {
        user_id: user.id,
        service: services,
        products_sold: products,
        observations,
        data: new Date().toISOString(),
        total: totalValue
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
      setError(err instanceof Error ? err.message : 'Erro ao registrar serviço');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
  };

  return (
    <Box component={Paper} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Registro de Serviços Realizados
      </Typography>

      <Grid container spacing={2}>
        {/* Seleção de Serviços */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Selecione o serviço</InputLabel>
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value as string)}
                label="Selecione o serviço"
              >
                {services.map((service) => (
                  <MenuItem key={service.service_id} value={service.service_id}>
                    {service.title} - R$ {service.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label="Qtd"
              value={serviceQuantity}
              onChange={(e) => setServiceQuantity(Number(e.target.value))}
              sx={{ width: 100 }}
              InputProps={{ inputProps: { min: 1 } }}
            />

            <IconButton
              color="primary"
              onClick={handleAddService}
              sx={{ alignSelf: 'center' }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Seleção de Produtos */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Selecione o produto</InputLabel>
              <Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value as string)}
                label="Selecione o produto"
              >
                {products.map((product) => (
                  <MenuItem key={product.product_id} value={product.product_id}>
                    {product.name} - R$ {product.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label="Qtd"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
              sx={{ width: 100 }}
              InputProps={{ inputProps: { min: 1 } }}
            />

            <IconButton
              color="primary"
              onClick={() => handleAddProduct(selectedProduct, productQuantity)}
              sx={{ alignSelf: 'center' }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Lista de itens adicionados com cabeçalho */}
        <Grid item xs={12}>
          <Box sx={{ 
            border: '1px solid #ccc', 
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            {/* Cabeçalho da tabela */}
            <Box sx={{ 
              display: 'flex', 
              bgcolor: '#f5f5f5', 
              borderBottom: '1px solid #ccc',
              p: 1
            }}>
              <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
                nome
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                minWidth: '200px'
              }}>
                <Typography sx={{ width: '70px', fontWeight: 'bold' }}>
                  Qtd
                </Typography>
                <Typography sx={{ width: '100px', textAlign: 'right', fontWeight: 'bold' }}>
                  valor
                </Typography>
                <Box sx={{ width: '40px' }} /> {/* Espaço para o botão de delete */}
              </Box>
            </Box>

            {/* Lista de itens */}
            <Box sx={{ p: 1, minHeight: '100px' }}>
              {selectedItems.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  '&:last-child': { mb: 0 }
                }}>
                  <Typography sx={{ flex: 1 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    minWidth: '200px'
                  }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...selectedItems];
                        newItems[index] = {
                          ...newItems[index],
                          quantity: Number(e.target.value)
                        };
                        setSelectedItems(newItems);
                      }}
                      InputProps={{ 
                        inputProps: { min: 1 },
                        sx: { width: '70px' }
                      }}
                    />
                    <Typography sx={{ width: '100px', textAlign: 'right' }}>
                      R$ {(item.value * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveItem(index)}
                      size="small"
                    >
                      <DeleteIcon />
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
            rows={4}
            label="Observações"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </Grid>

        {/* Valor Total */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6">
            Valor Total: R$ {totalValue.toFixed(2)}
          </Typography>
        </Grid>

        {/* Botão Registrar */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedItems.length === 0}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR'}
          </Button>
        </Grid>
      </Grid>

      {/* Feedback para o usuário */}
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
  );
};

export default RegisterPerformedServices; 