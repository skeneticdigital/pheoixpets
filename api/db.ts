import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Default to the credentials that were in src/lib/db.ts
const pool = mysql.createPool({
  host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER || 'EY53MquijedJkGF.root',
  password: process.env.TIDB_PASSWORD || 'wltFiMjt7iOXDtGL',
  database: process.env.TIDB_DATABASE || 'petshop',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        originalPrice VARCHAR(50),
        discount VARCHAR(50),
        category VARCHAR(100) NOT NULL,
        image LONGTEXT,
        isNew BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(50) NOT NULL,
        customerDetails JSON NOT NULL,
        items JSON NOT NULL,
        totalAmount VARCHAR(50) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending'
      )
    `);

    connection.release();
    console.log('TiDB database initialized successfully.');
  } catch (error) {
    console.error('Error initializing TiDB database:', error);
  }
}

export default pool;
