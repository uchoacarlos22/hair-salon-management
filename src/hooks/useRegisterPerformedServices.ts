// src/hooks/useRegisterPerformedServices.ts

import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Service } from '../types/services';
import { Product } from '../types/products';
import { servicesService } from '../services/servicesService';
import { productsService } from '../services/productsService';
import { performedServicesService } from '../services/performedServicesService';

/**
 * Hook que gerencia a integração para registro de serviços realizados.
 * Ele expõe funções para carregar serviços, carregar produtos e enviar o registro.
 */
export const useRegisterPerformedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.fetchServices();
      setServices(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar serviços:', err);
      if (err instanceof Error) {
        setError(err.message || 'Erro ao carregar serviços');
      } else {
        setError('Erro ao carregar serviços');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar produtos:', err);
      if (err instanceof Error) {
        setError(err.message || 'Erro ao carregar produtos');
      } else {
        setError('Erro ao carregar produtos');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Envia o registro do serviço realizado.
   * @param performedServiceData Objeto contendo service, products_sold, observations e total.
   */
  const submitPerformedService = async (performedServiceData: {
    service: Array<{
      service_id: string;
      name: string;
      quantity: number;
      value: number;
    }>;
    products_sold: Array<{
      product_id: string;
      name: string;
      quantity: number;
      value: number;
    }>;
    observations: string;
    total: number;
  }) => {
    try {
      setLoading(true);
      // Buscar o usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const performedService = {
        user_id: user.id,
        ...performedServiceData,
        data: new Date().toISOString(),
      };

      await performedServicesService.createPerformedService(performedService);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao registrar serviço:', err);
      if (err instanceof Error) {
        setError(err.message || 'Erro ao registrar serviço');
      } else {
        setError('Erro ao registrar serviço');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    products,
    loading,
    error,
    loadServices,
    loadProducts,
    submitPerformedService,
  };
};
