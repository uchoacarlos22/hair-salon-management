// src/hooks/usePerformedServices.ts

import { useState, useEffect } from 'react';
import { performedServicesService } from '../services/performedServicesService';
import { servicesService } from '../services/servicesService';
import { productsService } from '../services/productsService';
import { supabase } from '../services/supabaseClient';
import { PerformedService } from '../types/performedServices';
import { Service } from '../types/services';
import { Product } from '../types/products';

export interface ServiceWithDetails extends PerformedService {
  serviceDetails?: Map<string, Service>;
  productDetails?: Map<string, Product>;
}

/**
 * Hook que gerencia a busca dos serviços prestados,
 * integrando com os serviços do Supabase, dos serviços e dos produtos.
 */
export const usePerformedServices = () => {
  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [servicesMap, setServicesMap] = useState<Map<string, Service>>(new Map());
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [professionalId, setProfessionalId] = useState<string | undefined>(undefined);
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Obtém o usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Busca os dados: serviços, produtos e serviços prestados
      const [servicesData, productsData, performedServices] = await Promise.all([
        servicesService.fetchServices(),
        productsService.fetchProducts(),
        performedServicesService.fetchPerformedServices(
          user.id,
          startDate,
          endDate,
          professionalId,
        ),
      ]);

      // Cria maps para acesso rápido aos dados
      const sMap = new Map(servicesData.map((s) => [s.service_id, s]));
      const pMap = new Map(productsData.map((p) => [p.product_id, p]));

      setServicesMap(sMap);
      setProductsMap(pMap);

      let filteredServices = performedServices;

      if (serviceType) {
        filteredServices = performedServices.filter((service: PerformedService) => {
          if (serviceType === 'Serviço e Produto') {
            return service.service?.length > 0 && service.products_sold?.length > 0;
          } else if (serviceType === 'Serviço') {
            return service.service?.length > 0 && (!service.products_sold || service.products_sold.length === 0);
          } else if (serviceType === 'Produto') {
            return service.products_sold?.length > 0 && (!service.service || service.service.length === 0);
          }
          return true;
        });
      }

      setServices(filteredServices);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [startDate, endDate, professionalId, serviceType]);

  return {
    services,
    servicesMap,
    productsMap,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    professionalId,
    setProfessionalId,
    serviceType,
    setServiceType,
    reload: loadAllData,
  };
};
