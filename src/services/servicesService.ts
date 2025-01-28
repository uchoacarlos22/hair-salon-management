import { supabase } from './supabaseClient';
import { Service } from '../types/services';

export const servicesService = {
  async fetchServices() {
    const { data, error } = await supabase
      .from('services_table')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar serviços: ' + error.message);
    }

    return data as Service[];
  },

  async createService(service: Omit<Service, 'service_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('services_table')
      .insert([service])
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao criar serviço: ' + error.message);
    }

    return data as Service;
  },

  async updateService(service_id: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from('services_table')
      .update(updates)
      .eq('service_id', service_id)
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao atualizar serviço: ' + error.message);
    }

    return data as Service;
  },

  async deleteService(service_id: string) {
    const { error } = await supabase
      .from('services_table')
      .delete()
      .eq('service_id', service_id);

    if (error) {
      throw new Error('Erro ao deletar serviço: ' + error.message);
    }
  }
};
