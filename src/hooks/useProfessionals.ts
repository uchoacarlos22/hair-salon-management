// src/hooks/useProfessionals.ts

import { useState, useEffect } from 'react';
import { User } from '../types/users';
import {
  fetchProfessionals,
  updateProfessionalStatus,
  updateProfessionalRole,
} from '../services/professionalsService';

/**
 * Hook que gerencia o estado e as operações com profissionais.
 */
export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfessionals = async () => {
    setLoading(true);
    try {
      const data = await fetchProfessionals();
      setProfessionals(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza o status de um profissional e atualiza o estado local.
   */
  const changeProfessionalStatus = async (id: string, newStatus: boolean) => {
    await updateProfessionalStatus(id, newStatus);
    setProfessionals((prev) =>
      prev.map((professional) =>
        professional.user_id === id ? { ...professional, status: newStatus } : professional,
      ),
    );
  };

  /**
   * Atualiza a role de um profissional e atualiza o estado local.
   */
  const changeProfessionalRole = async (id: string, newRole: 'professional' | 'manager') => {
    await updateProfessionalRole(id, newRole);
    setProfessionals((prev) =>
      prev.map((professional) =>
        professional.user_id === id ? { ...professional, role: newRole } : professional,
      ),
    );
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  return { professionals, loading, error, reload: loadProfessionals, changeProfessionalStatus, changeProfessionalRole };
};
