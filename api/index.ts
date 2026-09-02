import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import pool, { initDb } from './db.js';
import PDFDocument from 'pdfkit';

function createInvoicePDF(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(25).fillColor('#ff7a00').text('Phoenix Pets', { align: 'center' });
    doc.fontSize(10).fillColor('gray').text('No.35/15, S Mada St, Sarojini Nagar, Kolathur, Chennai 600099', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(20).fillColor('black').text('INVOICE', { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    doc.text(`Bill To:`);
    doc.text(`${order.customerDetails.name}`);
    doc.text(`${order.customerDetails.email}`);
    doc.text(`${order.customerDetails.phone}`);
    doc.text(`${order.customerDetails.address}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Items ordered:');
    doc.moveDown(0.5);
    order.items.forEach((item: any, index: number) => {
      doc.fontSize(12).text(`${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${item.price}`);
    });
    
    doc.moveDown(2);
    
    const subtotal = order.items.reduce((sum: number, item: any) => {
      const numericPrice = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
      return sum + (numericPrice * item.quantity);
    }, 0);
    const shippingCharge = order.totalAmount > subtotal ? order.totalAmount - subtotal : 0;

    doc.fontSize(14).text(`Subtotal: Rs. ${subtotal.toLocaleString('en-IN')}`, { align: 'right' });
    doc.fontSize(14).text(`Shipping: Rs. ${shippingCharge}`, { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#ff7a00').text(`Total Amount: Rs. ${order.totalAmount.toLocaleString('en-IN')}`, { align: 'right' });

    doc.end();
  });
}

// Setup Nodemailer transport
// Using Ethereal (fake email service) for testing or environment variables for real SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'bernadette.kassulke43@ethereal.email', // Replace with real ethereal creds or env vars
    pass: process.env.SMTP_PASS || 'T6GfXZpWbM3S6K2mX1'
  }
});

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
          `INSERT INTO products (id, name, price, originalPrice, discount, category, image, isNew, stock) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           name=VALUES(name), price=VALUES(price), originalPrice=VALUES(originalPrice), 
           discount=VALUES(discount), category=VALUES(category), image=VALUES(image), isNew=VALUES(isNew), stock=VALUES(stock)`,
          [p.id, p.name, p.price, p.originalPrice || '', p.discount || '', p.category, p.image || '', p.isNew ? 1 : 0, p.stock || 0]
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
       SET name=?, price=?, originalPrice=?, discount=?, category=?, image=?, isNew=?, stock=? 
       WHERE id=?`,
      [p.name, p.price, p.originalPrice || '', p.discount || '', p.category, p.image || '', p.isNew ? 1 : 0, p.stock || 0, id]
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
      `INSERT INTO orders (id, orderId, customerDetails, items, totalAmount, status, paymentScreenshot) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [o.id, o.id, detailsJson, itemsJson, String(o.totalAmount), o.status || 'Pending', o.paymentScreenshot || null]
    );
    
    // Attempt to send email invoice asynchronously
    try {
      const itemsHtml = o.items.map((item: any) => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.price}</td>
        </tr>`
      ).join('');

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Phoenix Pets" <noreply@phoenixpets.com>',
        to: o.customerDetails.email,
        subject: `Invoice for your order ${o.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff7a00;">Thank you for your order!</h2>
            <p>Hi ${o.customerDetails.name},</p>
            <p>Your order <strong>${o.id}</strong> has been received and is currently being processed. Here is your invoice:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 20px;">
              <p style="margin: 5px 0;"><strong>Subtotal:</strong> ₹${o.items.reduce((s: number, i: any) => s + (Number(String(i.price).replace(/[^0-9.-]+/g, "")) * i.quantity), 0).toLocaleString('en-IN')}</p>
              <p style="margin: 5px 0;"><strong>Shipping:</strong> ₹${(o.totalAmount - o.items.reduce((s: number, i: any) => s + (Number(String(i.price).replace(/[^0-9.-]+/g, "")) * i.quantity), 0)).toLocaleString('en-IN')}</p>
              <h3 style="color: #ff7a00; margin-top: 10px;">Total: ₹${o.totalAmount.toLocaleString('en-IN')}</h3>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">If you have any questions, please reply to this email.</p>
          </div>
        `,
        attachments: [
          {
            filename: `PhoenixPets_Invoice_${o.id}.pdf`,
            content: await createInvoicePDF(o),
            contentType: 'application/pdf'
          }
        ]
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Invoice email sent:', info.messageId);
      if (info.messageId && info.messageId.includes('ethereal')) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (emailErr) {
      console.error('Failed to send email invoice:', emailErr);
      // We don't fail the order if the email fails
    }

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
