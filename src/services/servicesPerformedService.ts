import { supabase } from './supabaseClient';

    interface ServicePerformed {
      id: string;
      user_id: string;
      services: { service_id: string; name: string; price: number }[];
      products_sold: { product_id: string; name: string; price: number; quantity: number }[];
      date: string;
      observations?: string;
      total: number;
      created_at?: string;
      updated_at?: string;
    }

    // Função para registrar um novo serviço prestado
    export async function registerServicePerformed(
      servicePerformed: ServicePerformed
    ): Promise<ServicePerformed> {
      try {
        const { data, error } = await supabase
          .from('services_performed_table')
          .insert([servicePerformed])
          .select()
          .single();

        if (error) {
          console.error('Erro ao registrar serviço prestado:', error);
          throw new Error(`Erro ao registrar serviço prestado: ${error.message}`);
        }
        return data;
      } catch (error) {
        console.error('Erro ao registrar serviço prestado:', error);
        throw error;
      }
    }

    // Função para listar serviços prestados com filtros opcionais
    export async function listServicesPerformed(filters?: {
      user_id?: string;
      date?: string;
    }): Promise<ServicePerformed[]> {
      try {
        let query = supabase.from('services_performed_table').select('*');

        if (filters?.user_id) {
          query = query.eq('user_id', filters.user_id);
        }
        if (filters?.date) {
          query = query.eq('date', filters.date);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao listar serviços prestados:', error);
          throw new Error(`Erro ao listar serviços prestados: ${error.message}`);
        }
        return data || [];
      } catch (error) {
        console.error('Erro ao listar serviços prestados:', error);
        throw error;
      }
    }

    // Função para obter detalhes de um serviço prestado específico
    export async function getServicePerformedDetails(
      id: string
    ): Promise<ServicePerformed> {
      try {
        const { data, error } = await supabase
          .from('services_performed_table')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao obter detalhes do serviço prestado:', error);
          throw new Error(
            `Erro ao obter detalhes do serviço prestado: ${error.message}`
          );
        }
        return data;
      } catch (error) {
        console.error('Erro ao obter detalhes do serviço prestado:', error);
        throw error;
      }
    }
