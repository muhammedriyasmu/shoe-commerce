export type ShoeCategory = 'sports' | 'casual' | 'formal' | 'sneakers';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ShoeCategory;
  sizes: number[];
  imageUrl: string;
  stock: number;
  inStock: boolean;
}

export interface ProductsResponse {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size: number;
  quantity: number;
  stock: number;
}
