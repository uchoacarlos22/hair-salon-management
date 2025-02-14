interface ServiceItem {
  service_id: string;
  name: string;
  quantity: number;
  value: number;
}

interface ProductItem {
  product_id: string;
  name: string;
  quantity: number;
  value: number;
}

export interface PerformedService {
  performed_id?: string;
  user_id: string;
  professional_id: string;
  service: ServiceItem[]; // Array de serviços em JSONB
  products_sold: ProductItem[]; // Array de produtos em JSONB
  observations: string;
  data: string;
  total: number;
  created_at?: string;
  users_table: {
    name: string;
  } | null;
  professional_name?: string | null;
  service_type?: string;
}
