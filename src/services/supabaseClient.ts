import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchTestData = async () => {
  const { data, error } = await supabase.from('test_table').select('id, name, created_at');
  if (error) {
    throw new Error(`Erro ao buscar dados: ${error.message}`);
  }
  return data;
};
