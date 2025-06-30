import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://opwmgoenccllctjctigp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wd21nb2VuY2NsbGN0amN0aWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDUwNzYsImV4cCI6MjA2NjgyMTA3Nn0.cLN1X-HutbOMw0hLWGi_ioOmU-n4kqECuB2LTWt3_1c';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_data: {
        Row: {
          id: string
          user_id: string
          data_type: string
          data_value: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data_type: string
          data_value: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data_type?: string
          data_value?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}