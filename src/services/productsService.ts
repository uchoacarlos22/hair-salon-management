import { supabase } from './supabaseClient';
import { Product } from '../types/products';

    // Função para criar um novo produto
    export async function createProduct(product: Product): Promise<Product> {
      try {
        const { data, error } = await supabase
          .from('products_table')
          .insert([product])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar produto:', error);
          throw new Error(`Erro ao criar produto: ${error.message}`);
        }
        return data;
      } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
      }
    }

    // Função para listar todos os produtos
    export async function listProducts(): Promise<Product[]> {
      try {
        const { data, error } = await supabase
          .from('products_table')
          .select('*');

        if (error) {
          console.error('Erro ao listar produtos:', error);
          throw new Error(`Erro ao listar produtos: ${error.message}`);
        }
        return data || [];
      } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
      }
    }

    // Função para atualizar um produto existente
    export async function updateProduct(
      product_id: string,
      product: Partial<Product>
    ): Promise<Product> {
      try {
        const { data, error } = await supabase
          .from('products_table')
          .update(product)
          .eq('product_id', product_id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar produto:', error);
          throw new Error(`Erro ao atualizar produto: ${error.message}`);
        }
        return data;
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }
    }

    // Função para deletar um produto
    export async function deleteProduct(product_id: string): Promise<void> {
      try {
        const { error } = await supabase
          .from('products_table')
          .delete()
          .eq('product_id', product_id);

        if (error) {
          console.error('Erro ao deletar produto:', error);
          throw new Error(`Erro ao deletar produto: ${error.message}`);
        }
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    }

export const getProducts = listProducts;

export const productsService = {
  async fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products_table')
      .select('*');

    if (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }

    return data;
  }
};
