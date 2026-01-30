import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Page, Product } from '@/app/types';
import { products as initialProducts } from '@/app/data/products';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string, variantOptions: Record<string, string>) => void;
  updateCartQuantity: (productId: string, variantOptions: Record<string, string>, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingItemIndex = prev.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          JSON.stringify(i.variantOptions) === JSON.stringify(item.variantOptions) &&
          i.personalization === item.personalization
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingItemIndex].quantity += 1;
        return { items: newItems };
      }

      return { items: [...prev.items, { ...item, quantity: 1 }] };
    });
  };

  const removeFromCart = (productId: string, variantOptions: Record<string, string>) => {
    setCart((prev) => ({
      items: prev.items.filter(
        (item) =>
          !(item.productId === productId && JSON.stringify(item.variantOptions) === JSON.stringify(variantOptions))
      ),
    }));
  };

  const updateCartQuantity = (productId: string, variantOptions: Record<string, string>, quantity: number) => {
    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.productId === productId && JSON.stringify(item.variantOptions) === JSON.stringify(variantOptions)
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter((item) => item.quantity > 0),
    }));
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        setSelectedProductId,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartTotal,
        getCartCount,
        clearCart,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
