import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { createTables } from './migrate';

const sqlite = new Database('./dev.db');

// Ensure tables exist
createTables();

export const db = drizzle(sqlite, { schema });