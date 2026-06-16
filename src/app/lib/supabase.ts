import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'fintrack-auth',
    },
  }
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string; email: string; avatar: string; created_at: string };
        Insert: { id: string; name?: string; email?: string; avatar?: string };
        Update: { name?: string; avatar?: string };
      };
      transactions: {
        Row: {
          id: string; user_id: string; type: 'income' | 'expense';
          amount: number; category: string; note: string;
          payment_method: string; transaction_date: string; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      budgets: {
        Row: { id: string; user_id: string; category: string; limit_amount: number; created_at: string };
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at'>;
        Update: { category?: string; limit_amount?: number };
      };
    };
  };
};
