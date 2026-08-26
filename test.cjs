const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  const pool = mysql.createPool({
    host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: Number(process.env.TIDB_PORT) || 4000,
    user: process.env.TIDB_USER || 'EY53MquijedJkGF.root',
    password: process.env.TIDB_PASSWORD || 'wltFiMjt7iOXDtGL',
    database: process.env.TIDB_DATABASE || 'petshop',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const p = {
      id: 'bulk_test_123',
      name: 'Bulk Test',
      price: '₹100',
      originalPrice: '',
      discount: '',
      category: 'Dog',
      image: '',
      isNew: 0
    };
    
    await connection.query(
      `INSERT INTO products (id, name, price, originalPrice, discount, category, image, isNew) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       name=VALUES(name), price=VALUES(price), originalPrice=VALUES(originalPrice), 
       discount=VALUES(discount), category=VALUES(category), image=VALUES(image), isNew=VALUES(isNew)`,
      [p.id, p.name, p.price, p.originalPrice || '', p.discount || '', p.category, p.image || '', p.isNew ? 1 : 0]
    );
    await connection.commit();
    console.log('Success');
  } catch (e) {
    console.error(e);
    await connection.rollback();
  } finally {
    connection.release();
    pool.end();
  }
}
test();
