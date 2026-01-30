export interface Product {
  id: string;
  name: string;
  category: 'drinkware' | 'personalized' | 'home-decor';
  price: number;
  description: string;
  images: string[];
  videoUrl?: string;
  variants?: ProductVariant[];
  allowsPersonalization: boolean;
  inStock: boolean;
  isMadeToOrder: boolean;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CartItem {
  productId: string;
  variantOptions: Record<string, string>;
  personalization?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export type Page = 'home' | 'shop' | 'product' | 'cart' | 'admin' | 'about' | 'contact';
