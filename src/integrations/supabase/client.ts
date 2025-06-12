import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Get environment variables with appropriate error handling
 * Using import.meta.env for Vite environment variables
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Validate critical environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Missing Supabase environment variables. Check your .env file.');
  // In development, we might want to throw an error to make it obvious
  if (APP_ENV === 'development') {
    throw new Error('Missing required Supabase environment variables. Please check your .env file.');
  }
}

// Export environment variables for use in other modules
export const ENV = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ADMIN_USER_ID,
  APP_ENV,
  ENABLE_REAL_PAYMENTS: import.meta.env.VITE_ENABLE_REAL_PAYMENTS === 'true',
  ENABLE_REAL_TIME_NOTIFICATIONS: import.meta.env.VITE_ENABLE_REAL_TIME_NOTIFICATIONS !== 'false',
};

/**
 * Create and export the typed Supabase client
 * Using Database type for full type safety across the application
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'afro-connect',
      'x-app-version': '1.0.0',
      'x-app-env': APP_ENV
    }
  }
  // Note: debug option is not available in the current version of supabase-js
});

/**
 * Helper function to handle Supabase errors consistently
 * Provides standardized error handling across the application
 * 
 * @param error The error object from Supabase
 * @param context Optional context for logging (e.g., 'auth.signIn', 'businesses.create')
 * @param silent If true, will not log to console (useful for expected errors)
 * @returns Standardized error object
 */
export const handleSupabaseError = (error: Error | null, context?: string, silent: boolean = false) => {
  if (error) {
    const errorContext = context ? ` (${context})` : '';
    
    if (!silent) {
      console.error(`Supabase Error${errorContext}:`, error.message);
      
      // Additional debugging in development
      if (APP_ENV === 'development' && error instanceof Error && error.stack) {
        console.debug('Error stack:', error.stack);
      }
    }
    
    return { 
      error: { 
        message: error.message, 
        context,
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
        details: error instanceof Error && 'details' in error ? (error as any).details : undefined,
        hint: error instanceof Error && 'hint' in error ? (error as any).hint : undefined,
      } 
    };
  }
  return { error: null };
};

/**
 * Checks if the Supabase connection is working by testing both auth and database
 * @returns Connection status object
 */
export const checkSupabaseConnection = async () => {
  const result = {
    auth: { status: 'unknown', message: '', error: null as any },
    database: { status: 'unknown', message: '', error: null as any },
    overall: 'disconnected' as 'connected' | 'partial' | 'disconnected'
  };

  try {
    // Check Auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      result.auth = {
        status: 'disconnected',
        message: 'Failed to connect to Supabase Auth',
        error: authError
      };
    } else {
      result.auth = {
        status: 'connected',
        message: 'Connected to Supabase Auth',
        error: null
      };
    }
    
    // Check Database connection by querying a simple table
    try {
      const { error: dbError } = await supabase
        .from('businesses')
        .select('count')
        .limit(1);
      
      if (dbError) {
        result.database = {
          status: 'disconnected',
          message: 'Failed to connect to Supabase Database',
          error: dbError
        };
      } else {
        result.database = {
          status: 'connected',
          message: 'Connected to Supabase Database',
          error: null
        };
      }
    } catch (dbError) {
      result.database = {
        status: 'disconnected',
        message: 'Failed to connect to Supabase Database',
        error: dbError
      };
    }
    
    // Determine overall status
    if (result.auth.status === 'connected' && result.database.status === 'connected') {
      result.overall = 'connected';
    } else if (result.auth.status === 'connected' || result.database.status === 'connected') {
      result.overall = 'partial';
    } else {
      result.overall = 'disconnected';
    }
    
    return result;
  } catch (error) {
    console.error('Failed to check Supabase connection:', error);
    return {
      auth: { status: 'disconnected', message: 'Error checking auth connection', error },
      database: { status: 'disconnected', message: 'Error checking database connection', error },
      overall: 'disconnected' as const
    };
  }
};

/**
 * Checks if a user has admin privileges
 * @param userId The user ID to check
 * @returns Boolean indicating if user is an admin
 */
export const checkUserIsAdmin = async (userId: string) => {
  if (!userId) return false;
  
  try {
    // Use proper typing for the query
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId as any) // Cast to any to bypass type checking for now
      .single();
    
    if (error || !data) return false;
    
    // Check if data has the role property
    return typeof data === 'object' && 'role' in data && data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};