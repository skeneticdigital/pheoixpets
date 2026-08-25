import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  customerDetails: CustomerDetails;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (customerDetails: CustomerDetails, items: OrderItem[], totalAmount: number) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeOrders = async () => {
      try {
        // Migration
        const savedOrdersStr = localStorage.getItem('phoenix_pets_orders');
        if (savedOrdersStr) {
          await localforage.setItem('phoenix_pets_orders', JSON.parse(savedOrdersStr));
          localStorage.removeItem('phoenix_pets_orders');
        }

        const savedOrders = await localforage.getItem<Order[]>('phoenix_pets_orders');
        if (savedOrders) {
          setOrders(savedOrders);
        }
      } catch (err) {
        console.error('Failed to init orders from localforage', err);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeOrders();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localforage.setItem('phoenix_pets_orders', orders).catch(console.error);
    }
  }, [orders, isInitialized]);

  const addOrder = (customerDetails: CustomerDetails, items: OrderItem[], totalAmount: number) => {
    // Find the highest existing order number, ignoring old 6-digit random IDs
    const maxId = orders.reduce((max, order) => {
      const numMatch = order.id.match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0], 10) : 0;
      if (num >= 100000) return max; // Skip old random IDs
      return num > max ? num : max;
    }, 0);
    const nextId = maxId + 1;

    const newOrder: Order = {
      id: `ORD-${String(nextId).padStart(3, '0')}`,
      date: new Date().toISOString(),
      customerDetails,
      items,
      totalAmount,
      status: 'Pending'
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
