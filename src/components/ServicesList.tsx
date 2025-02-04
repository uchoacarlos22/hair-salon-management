// src/components/ServicesList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LoadingBackdrop from './LoadingBackdrop';
import { useServicesList } from '../hooks/useServicesList';

export const ServicesList: React.FC = () => {
  const { services, loading, error } = useServicesList();

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
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>
                  {new Date(service.date_time).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  {service.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
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

export default ServicesList;
