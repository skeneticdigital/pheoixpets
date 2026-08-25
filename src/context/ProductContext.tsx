import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { products as defaultProducts } from '../data/content';
import type { Product } from '../data/content';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  date: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addProducts: (newProducts: Omit<Product, 'id'>[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  media: MediaItem[];
  addMedia: (media: Omit<MediaItem, 'id' | 'date'>) => void;
  deleteMedia: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultCategories = [
    'Reptiles', 'Bird', 'Dog', 'Cat', 'Pigeon', 
    'Hamster', 'Rabbit', 'Guinea Pig', 'Turtle', 'Fighting Rooster', 'Mammal'
  ];

  // Initialize from localforage, with fallback migration from localStorage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // 1. Migration from localStorage to localforage
        const savedProductsStr = localStorage.getItem('phoenix_pets_products');
        if (savedProductsStr) {
          await localforage.setItem('phoenix_pets_products', JSON.parse(savedProductsStr));
          localStorage.removeItem('phoenix_pets_products');
        }
        const savedCategoriesStr = localStorage.getItem('phoenix_pets_categories');
        if (savedCategoriesStr) {
          await localforage.setItem('phoenix_pets_categories', JSON.parse(savedCategoriesStr));
          localStorage.removeItem('phoenix_pets_categories');
        }
        const savedMediaStr = localStorage.getItem('phoenix_pets_media');
        if (savedMediaStr) {
          await localforage.setItem('phoenix_pets_media', JSON.parse(savedMediaStr));
          localStorage.removeItem('phoenix_pets_media');
        }

        // 2. Load from localforage
        const savedProducts: Product[] | null = await localforage.getItem('phoenix_pets_products');
        if (savedProducts) {
          const uniqueProducts: Product[] = [];
          const seenIds = new Set<string>();
          savedProducts.forEach((p, idx) => {
            let finalId = p.id;
            if (!finalId || seenIds.has(finalId)) {
              finalId = `p${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
            }
            seenIds.add(finalId);
            uniqueProducts.push({ ...p, id: finalId });
          });
          setProducts(uniqueProducts);
        } else {
          setProducts(defaultProducts);
        }

        const savedCategories: string[] | null = await localforage.getItem('phoenix_pets_categories');
        if (savedCategories) {
          setCategories(savedCategories);
        } else {
          setCategories(defaultCategories);
        }
        
        const savedMedia: MediaItem[] | null = await localforage.getItem('phoenix_pets_media');
        if (savedMedia) {
          setMedia(savedMedia);
        }
      } catch (err) {
        console.error('Error initializing data from localforage', err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeStorage();
  }, []);

  // Save to localforage whenever products, categories, or media change
  useEffect(() => {
    if (isInitialized) {
      localforage.setItem('phoenix_pets_products', products).catch(console.error);
      localforage.setItem('phoenix_pets_categories', categories).catch(console.error);
      localforage.setItem('phoenix_pets_media', media).catch(console.error);
    }
  }, [products, categories, media, isInitialized]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const addProducts = (newProducts: Omit<Product, 'id'>[]) => {
    const productsWithIds = newProducts.map((p, index) => ({
      ...p,
      id: `p${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`
    }));
    setProducts((prev) => [...prev, ...productsWithIds]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => 
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (category: string) => {
    setCategories(prev => {
      if (!prev.includes(category)) return [...prev, category];
      return prev;
    });
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  const addMedia = (newMedia: Omit<MediaItem, 'id' | 'date'>) => {
    const item: MediaItem = {
      ...newMedia,
      id: `m${Date.now()}`,
      date: new Date().toISOString()
    };
    setMedia(prev => [item, ...prev]);
  };

  const deleteMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, addProducts, updateProduct, deleteProduct, categories, addCategory, deleteCategory, media, addMedia, deleteMedia }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
