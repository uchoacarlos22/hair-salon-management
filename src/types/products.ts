export interface Product {
  product_id: string;
  name: string;
  description: string;
  value: number;
  quantity: number;
  created_at?: string;
  min_quantity: number;
  image?: string;
}

export type ProductWithoutId = Omit<Product, 'product_id'>;
