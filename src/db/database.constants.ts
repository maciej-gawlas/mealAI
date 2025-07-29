import type { Database } from './database.types';

export type Tables = Database['public']['Tables'];

export const DB_TABLES = {
  USER_PREFERENCES: 'user_preferences',
  PREFERENCES: 'preferences'
} as const;

export type TablesNames = keyof Tables;

export type TableDefinition<T extends TablesNames> = {
  name: T;
  schema: Tables[T];
};

export const USER_PREFERENCES_TABLE: TableDefinition<'user_preferences'> = {
  name: DB_TABLES.USER_PREFERENCES,
  schema: {} as Tables['user_preferences']
};

export const PREFERENCES_TABLE: TableDefinition<'preferences'> = {
  name: DB_TABLES.PREFERENCES,
  schema: {} as Tables['preferences']
};
