import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

console.log('Database connection established');
console.log(`User: ${process.env.POSTGRES_USER}`);
console.log(`Host: ${process.env.POSTGRES_HOST}`);
console.log(`Database: ${process.env.POSTGRES_DB}`);

export default pool;