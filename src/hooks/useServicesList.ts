// src/hooks/useServicesList.ts
import { useState, useEffect } from 'react';
import { Service } from '../types/services';
import { servicesService } from '../services/servicesService';

export const useServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.fetchServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return { services, loading, error, reload: loadServices };
};
