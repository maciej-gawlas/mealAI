import type { Database } from './database.types';

export type Tables = Database['public']['Tables'];
export type UserPreference = Tables['user_preferences']['Row'];

export type DatabaseFunctions = {
  update_user_preferences: {
    Args: {
      p_user_id: string;
      p_preference_ids: string[];
    };
    Returns: UserPreference[];
  };
};
