import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DBURL,
});

export default pool;

