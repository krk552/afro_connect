import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'business_owner';
  }) => Promise<{ 
    error: AuthError | null; 
    needsEmailConfirmation?: boolean;
    message?: string;
  }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  isBusinessOwner: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch user profile from the database with timeout
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching user profile for:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error('⏰ Profile fetch timeout after 10 seconds');
          reject(new Error('Profile fetch timeout'));
        }, 10000)
      );

      const profilePromise = supabase
        .from('users')
        .select('id, email, first_name, last_name, phone, role, email_verified, profile_image_url, metadata, created_at')
        .eq('id', userId)
        .single();

      console.log('📡 Sending profile query to database...');
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched successfully:', { 
        hasProfile: !!data, 
        email: data?.email,
        role: data?.role 
      });
      return data;
    } catch (error) {
      console.error('❌ Exception in fetchUserProfile:', error);
      return null;
    }
  };

  // Optimized function to fetch profile and update last login in parallel
  const fetchProfileAndUpdateLogin = async (userId: string) => {
    try {
      console.log('🚀 Starting parallel profile fetch and login update for:', userId);
      
      // Run both operations in parallel for better performance
      const [profileResult, updateResult] = await Promise.allSettled([
        fetchUserProfile(userId),
        supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', userId)
      ]);

      // Log update result for debugging
      if (updateResult.status === 'rejected') {
        console.error('❌ Error updating last_login_at:', updateResult.reason);
      } else {
        console.log('✅ Last login updated successfully');
      }

      // Return profile data regardless of update success
      if (profileResult.status === 'fulfilled') {
        console.log('✅ Profile and login update completed');
        return profileResult.value;
      } else {
        console.error('❌ Profile fetch failed:', profileResult.reason);
        return null;
      }
    } catch (error) {
      console.error('❌ Exception in fetchProfileAndUpdateLogin:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchUserProfile(user.id);
      setProfile(profileData);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🚀 Initializing auth state...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('📋 Initial session check:', { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        error 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 User found in session, fetching profile...');
        fetchUserProfile(session.user.id).then((profileData) => {
          console.log('📝 Profile data:', profileData);
          setProfile(profileData);
        });
      }
      
      setLoading(false);
      console.log('✅ Auth initialization complete');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { 
          event, 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userEmail: session?.user?.email 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👤 User signed in, simplified profile handling...');
          
          // Simplified approach - just get basic profile without complex operations
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
          
          // Skip the complex last_login_at update for now to test performance
          // const profileData = await fetchProfileAndUpdateLogin(session.user.id);
          
          // If no profile found, try to create one from auth user data (simplified)
          if (!profileData && session.user) {
            console.log('📝 No profile found, creating minimal profile...');
            try {
              const newProfile = {
                id: session.user.id,
                email: session.user.email || '',
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || '',
                role: 'customer' as const,
                email_verified: session.user.email_confirmed_at ? true : false,
              };
              
              const { data, error: insertError } = await supabase
                .from('users')
                .insert(newProfile)
                .select()
                .single();
                
              if (!insertError && data) {
                console.log('✅ Profile created successfully');
                setProfile(data);
              }
            } catch (error) {
              console.error('❌ Failed to create profile:', error);
            }
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Only fetch profile if we don't already have it
          if (!profile || profile.id !== session.user.id) {
            console.log('👤 Token refreshed, fetching profile...');
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👤 User signed out, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Debug effect to log current state
  useEffect(() => {
    console.log('🔍 Current auth state:', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      hasSession: !!session,
      userEmail: user?.email,
      profileEmail: profile?.email
    });
  }, [loading, user, profile, session]);

  // Sign up function
  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      firstName: string;
      lastName: string;
      phone?: string;
      role?: 'customer' | 'business_owner';
    }
  ) => {
    try {
      // Create auth user with email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role || 'customer',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          return { 
            error: null, 
            needsEmailConfirmation: true,
            message: 'An account with this email already exists. If you haven\'t confirmed your email yet, please check your inbox for the confirmation link or use the "Resend Confirmation" button.'
          };
        }
        return { error };
      }

      // If user was created but needs email confirmation
      if (data.user && !data.session) {
        return { 
          error: null, 
          needsEmailConfirmation: true,
          message: 'Please check your email for a confirmation link.'
        };
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone: userData.phone || null,
              role: userData.role || 'customer',
              email_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error };
    }
  };

  // Simplified backup sign-in function (in case complex version fails)
  const signInSimple = async (email: string, password: string) => {
    try {
      console.log('🔑 Using simplified sign-in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('✅ Simple sign-in completed:', { hasError: !!error });
      return { error };
    } catch (error) {
      console.error('❌ Simple sign-in failed:', error);
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Starting sign-in process for:', email);
      
      // Increase timeout to 30 seconds and add better logging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error('⏰ Sign-in timeout after 30 seconds');
          reject(new Error('Login timeout - please try again'));
        }, 30000)
      );

      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📡 Sending login request to Supabase...');
      const result = await Promise.race([loginPromise, timeoutPromise]) as { error: any; data?: any };
      
      console.log('✅ Login request completed:', { 
        hasError: !!result.error, 
        errorMessage: result.error?.message 
      });
      
      return { error: result.error };
    } catch (error) {
      console.error('❌ Error during sign in:', error);
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { error };
    } catch (error) {
      console.error(`Error during ${provider} sign in:`, error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Error during password reset:', error);
      return { error };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      return { error };
    } catch (error) {
      console.error('Error resending confirmation:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        await refreshProfile();
      }

      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  // This is intentionally left empty as we're removing the duplicate refreshProfile function

  const isBusinessOwner = () => {
    if (!profile) return false;
    return profile.role === 'business_owner';
  };

  const isAdmin = () => {
    if (!profile) return false;
    return profile.role === 'admin';
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    resendConfirmation,
    updateProfile,
    refreshProfile,
    isBusinessOwner,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 