import { createPool } from '@vercel/postgres';

export const db = createPool();

export default db;
