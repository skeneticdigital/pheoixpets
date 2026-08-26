import express from 'express';
import cors from 'cors';
import pool, { initDb } from './db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize DB on start
initDb();

// ---------------------------------------------------------
// PRODUCTS API
// ---------------------------------------------------------

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY createdAt DESC');
    
    // Format boolean for frontend
    const products = (rows as any[]).map(p => ({
      ...p,
      isNew: p.isNew === 1 || p.isNew === true
    }));
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a product (single or bulk array)
app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    const productsToInsert = Array.isArray(data) ? data : [data];
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const p of productsToInsert) {
        await connection.query(
          `INSERT INTO products (id, name, price, originalPrice, discount, category, image, isNew) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           name=VALUES(name), price=VALUES(price), originalPrice=VALUES(originalPrice), 
           discount=VALUES(discount), category=VALUES(category), image=VALUES(image), isNew=VALUES(isNew)`,
          [p.id, p.name, p.price, p.originalPrice || '', p.discount || '', p.category, p.image || '', p.isNew ? 1 : 0]
        );
      }
      await connection.commit();
      res.status(201).json({ message: 'Products saved successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving product(s):', error);
    res.status(500).json({ error: 'Failed to save product(s)' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    
    await pool.query(
      `UPDATE products 
       SET name=?, price=?, originalPrice=?, discount=?, category=?, image=?, isNew=? 
       WHERE id=?`,
      [p.name, p.price, p.originalPrice || '', p.discount || '', p.category, p.image || '', p.isNew ? 1 : 0, id]
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


// ---------------------------------------------------------
// ORDERS API
// ---------------------------------------------------------

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    
    const orders = (rows as any[]).map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
      customerDetails: typeof o.customerDetails === 'string' ? JSON.parse(o.customerDetails) : o.customerDetails
    }));
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;
    const itemsJson = JSON.stringify(o.items);
    const detailsJson = JSON.stringify(o.customerDetails);
    
    await pool.query(
      `INSERT INTO orders (id, orderId, customerDetails, items, totalAmount, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [o.id, o.id, detailsJson, itemsJson, String(o.totalAmount), o.status || 'Pending']
    );
    
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Delete an order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id=?', [id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Export the Express app for Vercel Serverless Functions
export default app;
