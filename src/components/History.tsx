import React, { useEffect, useState } from 'react';
import { performedServicesService } from '../services/performedServicesService';
import { servicesService } from '../services/servicesService';
import { productsService } from '../services/productsService';
import { supabase } from '../services/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Modal,
  Chip,
  Stack
} from '@mui/material';
import { PerformedService } from '../types/performedServices';
import { Service } from '../types/services';
import { Product } from '../types/products';

interface ServiceWithDetails extends PerformedService {
  serviceDetails?: Map<string, Service>;
  productDetails?: Map<string, Product>;
}

export const History: React.FC = () => {
  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [servicesMap, setServicesMap] = useState<Map<string, Service>>(new Map());
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceWithDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Carregar serviços e produtos para referência
      const [servicesData, productsData, performedServices] = await Promise.all([
        servicesService.fetchServices(),
        productsService.fetchProducts(),
        performedServicesService.fetchPerformedServices(user.id)
      ]);

      // Criar maps para lookup rápido
      const sMap = new Map(servicesData.map(s => [s.service_id, s]));
      const pMap = new Map(productsData.map(p => [p.product_id, p]));

      setServicesMap(sMap);
      setProductsMap(pMap);
      setServices(performedServices);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatServiceItem = (serviceItem: any) => {
    const service = servicesMap.get(serviceItem.service_id);
    return service ? `${serviceItem.quantity}x ${service.title}` : '';
  };

  const formatProductItem = (productItem: any) => {
    const product = productsMap.get(productItem.product_id);
    return product ? `${productItem.quantity}x ${product.name}` : '';
  };

  const getServiceType = (service: ServiceWithDetails) => {
    if (service.service?.length > 0 && service.products_sold?.length > 0) {
      return 'Serviço e Produto';
    } else if (service.service?.length > 0) {
      return 'Serviço';
    } else if (service.products_sold?.length > 0) {
      return 'Produto';
    }
    return '';
  };

  const handleOpenDetails = (service: ServiceWithDetails) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const ServiceDetailsModal = () => {
    if (!selectedService) return null;

    return (
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Detalhes do Serviço
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Data: {new Date(selectedService.created_at!).toLocaleDateString('pt-BR')}
          </Typography>

          {selectedService.service?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Serviços:</Typography>
              {selectedService.service.map((s, index) => {
                const service = servicesMap.get(s.service_id);
                return (
                  <Box key={index} sx={{ ml: 2, mb: 1 }}>
                    <Typography variant="body2">
                      {service?.title} - {s.quantity}x
                      <Typography component="span" sx={{ float: 'right' }}>
                        R$ {(s.value * s.quantity).toFixed(2)}
                      </Typography>
                    </Typography>
                  </Box>
                );
              })}
            </>
          )}

          {selectedService.products_sold?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Produtos:</Typography>
              {selectedService.products_sold.map((p, index) => {
                const product = productsMap.get(p.product_id);
                return (
                  <Box key={index} sx={{ ml: 2, mb: 1 }}>
                    <Typography variant="body2">
                      {product?.name} - {p.quantity}x
                      <Typography component="span" sx={{ float: 'right' }}>
                        R$ {(p.value * p.quantity).toFixed(2)}
                      </Typography>
                    </Typography>
                  </Box>
                );
              })}
            </>
          )}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Observações:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {selectedService.observations || 'Nenhuma observação'}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, textAlign: 'right' }}>
            Total: R$ {selectedService.total.toFixed(2)}
          </Typography>
        </Box>
      </Modal>
    );
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Serviços
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Valor Total</TableCell>
              <TableCell align="center">Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.performed_id}>
                <TableCell>
                  {new Date(service.created_at!).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getServiceType(service)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  R$ {service.total.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDetails(service)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ServiceDetailsModal />
    </Box>
  );
};

export default History;
