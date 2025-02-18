import { supabase } from './supabaseClient';
import { PerformedService } from '../types/performedServices';

export const performedServicesService = {
  async createPerformedService(performedService: Omit<PerformedService, 'performed_id' | 'created_at' | 'professional_name' | 'service_type'>) {
    const { data: professional, error: professionalError } = await supabase
      .from('users_table')
      .select('name')
      .eq('user_id', performedService.user_id)
      .single();

    if (professionalError) {
      throw new Error('Erro ao buscar nome do profissional: ' + professionalError.message);
    }

    let serviceType = '';
    if (performedService.products_sold && performedService.products_sold.length > 0) {
      serviceType = 'Produto';
    }

    const { data, error } = await supabase
      .from('services_performed_table')
      .insert([{ ...performedService, professional_name: professional?.name, service_type: serviceType }])
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao registrar serviço: ' + error.message);
    }

    return data;
  },

  async fetchPerformedServices(
    userId: string,
    startDate?: string,
    endDate?: string,
    professionalId?: string,
  ): Promise<PerformedService[]> {
    const query = supabase
      .from('services_performed_table')
      .select(`*, users_table ( name )`)
      .order('created_at', { ascending: false });

    // Fetch the user's role
    const { data: userProfile, error: profileError } = await supabase
      .from('users_table')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      throw new Error('Erro ao buscar perfil do usuário: ' + profileError.message);
    }

    console.log('User role:', userProfile?.role);

    // Conditionally apply the user_id filter based on the user's role
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'manager') {
      query.eq('user_id', userId);
    }

    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.gte('created_at', startDate).lt('created_at', endOfDay.toISOString().split('T')[0]);
    }

    if (professionalId) {
      query.eq('user_id', professionalId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Erro ao buscar serviços realizados: ' + error.message);
    }

    console.log('Number of services returned:', data?.length);

    return data as PerformedService[];
  },

  // Método para buscar serviços de um profissional específico
  async fetchProfessionalServices(professionalId: string): Promise<PerformedService[]> {
    const { data, error } = await supabase
      .from('services_performed_table')
      .select(`*, users_table ( name )`)
      .eq('user_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar serviços do profissional: ' + error.message);
    }

    return data as PerformedService[];
  }
};
