import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addOrder: (customerDetails: CustomerDetails, items: OrderItem[], totalAmount: number) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const apiOrders = await res.json();
          setOrders(apiOrders);
        }
      } catch (err) {
        console.error('Failed to fetch orders from API', err);
      }
    };
    fetchOrders();
  }, []);

  const addOrder = async (customerDetails: CustomerDetails, items: OrderItem[], totalAmount: number) => {
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

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        setOrders((prev) => [newOrder, ...prev]);
      }
    } catch (e) {
      console.error('Failed to place order in API', e);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete order from API', e);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      }
    } catch (e) {
      console.error('Failed to update order status in API', e);
    }
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
