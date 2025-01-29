import React, { useEffect, useState } from 'react';
import { Service } from '../types/services';
import { servicesService } from '../services/servicesService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import LoadingBackdrop from './LoadingBackdrop';

export const ServicesList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.fetchServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <LoadingBackdrop open={loading} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell align="right">Valor (R$)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.service_id}>
                <TableCell>{service.title}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>
                  {new Date(service.date_time).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  {service.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}; 