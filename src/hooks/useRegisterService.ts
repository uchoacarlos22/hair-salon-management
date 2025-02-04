// src/hooks/useRegisterService.ts
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export interface ServiceItem {
  name: string;
  value: string;
  observations: string;
}

export const useRegisterService = () => {
  const [services, setServices] = useState<ServiceItem[]>([
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
    calculateTotal(newServices);
  };

  type ServiceField = 'name' | 'value' | 'observations';

  const handleServiceChange = (
    index: number,
    field: ServiceField,
    value: string
  ) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
    calculateTotal(newServices);
  };

  const calculateTotal = (services: ServiceItem[]) => {
    let newTotal = 0;
    services.forEach((service) => {
      const value = parseFloat(service.value);
      if (!isNaN(value)) {
        newTotal += value;
      }
    });
    setTotal(newTotal);
  };

  const handleSubmit = async () => {
    // Limpa mensagens anteriores
    setSuccessMessage('');
    setErrorMessage('');

    // Validação dos campos
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
        // Reinicia o formulário
        setServices([{ name: '', value: '', observations: '' }]);
        setTotal(0);
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao tentar registrar o serviço.');
    }
  };

  return {
    services,
    total,
    successMessage,
    errorMessage,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    handleSubmit,
    setServices, // se necessário para manipulações externas
  };
};
