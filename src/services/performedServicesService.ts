import { supabase } from './supabaseClient';
import { PerformedService } from '../types/performedServices';

export const performedServicesService = {
  async createPerformedService(performedService: Omit<PerformedService, 'performed_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('services_performed_table')
      .insert([performedService])
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao registrar serviço: ' + error.message);
    }

    return data;
  },

  async fetchPerformedServices(userId: string) {
    const { data, error } = await supabase
      .from('services_performed_table')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar serviços realizados: ' + error.message);
    }

    return data as PerformedService[];
  },

  // Método para buscar serviços de um profissional específico
  async fetchProfessionalServices(professionalId: string) {
    const { data, error } = await supabase
      .from('services_performed_table')
      .select(`
        *,
        service:service(*),
        products_sold:products_sold(*)
      `)
      .eq('user_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar serviços do profissional: ' + error.message);
    }

    return data as PerformedService[];
  }
}; 