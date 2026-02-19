import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Cart, CartItem, Page, Product } from '@/app/types';
import type { User } from 'firebase/auth';
import { getIdTokenResult, onIdTokenChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { auth, callFunction, db, STORE_ID } from '@/app/firebase';

type AuthClaims = {
  storeId?: string;
  role?: string;
};

interface AppContextType {
  authReady: boolean;
  user: User | null;
  claims: AuthClaims | null;
  storeId: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
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
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeId = useMemo(() => STORE_ID, []);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<AuthClaims | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [products, setProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);

      if (!nextUser) {
        setClaims(null);
        return;
      }

      const tokenResult = await getIdTokenResult(nextUser);
      const tokenClaims = tokenResult && tokenResult.claims ? tokenResult.claims : {};
      const nextClaims: AuthClaims = {};
      if (typeof tokenClaims.storeId === 'string') nextClaims.storeId = tokenClaims.storeId;
      if (typeof tokenClaims.role === 'string') nextClaims.role = tokenClaims.role;
      setClaims(nextClaims);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const productsRef = collection(db, 'stores', storeId, 'products');
    const q = query(productsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextProducts: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Record<string, unknown>;

          const id = typeof data.id === 'string' ? data.id : doc.id;
          const name = typeof data.name === 'string' ? data.name : '';
          const category =
            data.category === 'drinkware' || data.category === 'personalized' || data.category === 'home-decor'
              ? data.category
              : 'drinkware';
          const price = typeof data.price === 'number' ? data.price : Number(data.price ?? 0) || 0;
          const description = typeof data.description === 'string' ? data.description : '';
          const images = Array.isArray(data.images) ? data.images.filter((x) => typeof x === 'string') : [];
          const tags = Array.isArray(data.tags) ? data.tags.filter((x) => typeof x === 'string') : [];

          return {
            id,
            name,
            category,
            price,
            description,
            images,
            allowsPersonalization: data.allowsPersonalization === true,
            inStock: data.inStock !== false,
            isMadeToOrder: data.isMadeToOrder === true,
            tags,
            variants: Array.isArray(data.variants) ? (data.variants as Product['variants']) : undefined,
            videoUrl: typeof data.videoUrl === 'string' ? data.videoUrl : undefined,
          };
        });

        setProducts(nextProducts);
      },
      () => {
        setProducts([]);
      },
    );

    return unsubscribe;
  }, [storeId]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    const current = auth.currentUser;
    if (current) {
      await current.getIdToken(true);
    }
  };

  const refreshToken = async () => {
    const current = auth.currentUser;
    if (current) {
      await current.getIdToken(true);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

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

  const productToData = (product: Product) => {
    const data: Record<string, unknown> = {
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      images: product.images,
      allowsPersonalization: product.allowsPersonalization,
      inStock: product.inStock,
      isMadeToOrder: product.isMadeToOrder,
      tags: product.tags,
    };

    if (product.variants) data.variants = product.variants;
    if (product.videoUrl) data.videoUrl = product.videoUrl;

    return data;
  };

  const addProduct = async (product: Product) => {
    await callFunction('addProduct', { productData: productToData(product) }, storeId);
  };

  const updateProduct = async (product: Product) => {
    await callFunction('updateProduct', { productId: product.id, updates: productToData(product) }, storeId);
  };

  const deleteProduct = async (id: string) => {
    await callFunction('deleteProduct', { productId: id }, storeId);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        authReady,
        user,
        claims,
        storeId,
        login,
        logout,
        refreshToken,
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
