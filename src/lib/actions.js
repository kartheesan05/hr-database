'use server'

import db from './db';

export async function getHrData(page = 1, pageSize = 100, searchParams = {}) {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT * FROM hr_contacts';
  const queryParams = [];

  // Build the WHERE clause based on searchParams
  const whereConditions = [];
  if (searchParams.name) {
    whereConditions.push('hr_name ILIKE $' + (queryParams.length + 1));
    queryParams.push(`%${searchParams.name}%`);
  }
  if (searchParams.phoneNumber) {
    whereConditions.push('phone_number ILIKE $' + (queryParams.length + 1));
    queryParams.push(`%${searchParams.phoneNumber}%`);
  }
  if (searchParams.email) {
    whereConditions.push('email ILIKE $' + (queryParams.length + 1));
    queryParams.push(`%${searchParams.email}%`);
  }
  if (searchParams.interview) {
    whereConditions.push('LOWER(interview_mode) = LOWER($' + (queryParams.length + 1) + ')');
    queryParams.push(searchParams.interview.toLowerCase());
  }
  if (searchParams.company) {
    whereConditions.push('company ILIKE $' + (queryParams.length + 1));
    queryParams.push(`%${searchParams.company}%`);
  }

  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }

  const countQuery = 'SELECT COUNT(*) FROM hr_contacts' + (whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : '');

  query += ` ORDER BY id LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(pageSize, offset);

  try {
    const result = await db.query(query, queryParams);
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const totalCount = parseInt(countResult.rows[0].count);

    return {
      data: result.rows,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching HR data:', error);
    throw error;
  }
}
