import "server-only";

import db from "./db";

export async function getUser(email) {
  const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
  const values = [email];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}
