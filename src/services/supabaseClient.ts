import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: sessionStorage,
  },
});

function persistSession() {
  const session = sessionStorage.getItem('supabase.auth.session');
  if (session) {
    window.name = session;
  }
}

function restoreSession() {
  if (!sessionStorage.getItem('supabase.auth.session')) {
    const session = window.name;
    if (session) {
      sessionStorage.setItem('supabase.auth.session', session);
      window.name = '';
    }
  }
}

window.addEventListener('beforeunload', persistSession);
window.addEventListener('load', restoreSession);

export const fetchTestData = async () => {
  const { data, error } = await supabase.from('test_table').select('id, name, created_at');
  if (error) {
    throw new Error(`Erro ao buscar dados: ${error.message}`);
  }
  return data;
};
