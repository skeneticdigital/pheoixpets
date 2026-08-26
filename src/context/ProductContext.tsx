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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addProducts: (newProducts: Omit<Product, 'id'>[]) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch products from API
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const apiProducts = await res.json();
            setProducts(apiProducts.length > 0 ? apiProducts : defaultProducts);
          } else {
            setProducts(defaultProducts);
          }
        } catch (e) {
          console.error('Error fetching products from API:', e);
          setProducts(defaultProducts);
        }

        // Initialize categories & media from localforage
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
        console.error('Error initializing data', err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeData();
  }, []);

  // Save localforage specific data when changed
  useEffect(() => {
    if (isInitialized) {
      localforage.setItem('phoenix_pets_categories', categories).catch(console.error);
      localforage.setItem('phoenix_pets_media', media).catch(console.error);
    }
  }, [categories, media, isInitialized]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setProducts((prev) => [newProduct, ...prev]);
      }
    } catch (e) {
      console.error('Failed to add product to API', e);
    }
  };

  const addProducts = async (newProducts: Omit<Product, 'id'>[]) => {
    const productsWithIds = newProducts.map((p, index) => ({
      ...p,
      id: `p${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`
    }));
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productsWithIds)
      });
      if (res.ok) {
        setProducts((prev) => [...productsWithIds, ...prev]);
      }
    } catch (e) {
      console.error('Failed to bulk add products to API', e);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        setProducts((prev) => 
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      }
    } catch (e) {
      console.error('Failed to update product in API', e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete product from API', e);
    }
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
