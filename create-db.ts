import mysql from 'mysql2/promise';

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: 'EY53MquijedJkGF.root',
      password: 'wltFiMjt7iOXDtGL',
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });
    console.log('Connected to TiDB Serverless');
    
    await connection.query('CREATE DATABASE IF NOT EXISTS petshop');
    console.log('Database petshop created successfully');
    
    await connection.end();
  } catch (error) {
    console.error('Failed:', error);
  }
}

run();
