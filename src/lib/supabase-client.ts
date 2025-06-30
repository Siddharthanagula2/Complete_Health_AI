import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Create a single instance of the Supabase client to be used throughout the app
export const createClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
};

// Helper function to check if a user is authenticated
export const isUserAuthenticated = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user profile data
export const getUserProfile = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Helper function to handle auth state changes
export const setupAuthListener = (callback: (user: any) => void) => {
  const supabase = createClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        callback(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    }
  );
  
  return subscription;
};