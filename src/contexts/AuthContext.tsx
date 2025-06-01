import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
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
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from our users table
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
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
        fetchProfile(session.user.id).then((profileData) => {
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
          console.log('👤 User signed in, fetching profile and updating last_login_at...');
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          // Update last_login_at
          try {
            const { error: updateError } = await supabase
              .from('users')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', session.user.id);
            if (updateError) {
              console.error('❌ Error updating last_login_at:', updateError);
            }
          } catch (e) {
            console.error('❌ Exception updating last_login_at:', e);
          }

        } else if (session?.user) {
          // Handle other events like TOKEN_REFRESHED, USER_UPDATED if needed
          // For now, just fetch profile if user exists but event is not SIGNED_IN
          console.log('👤 Session exists or refreshed, fetching profile...');
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else if (event === 'SIGNED_OUT') {
          console.log('👤 User signed out, clearing profile');
          setProfile(null);
          // Optionally, redirect to login page on sign out
          // navigate('/login');
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
        // User needs to confirm email
        console.log('User created, email confirmation required');
        return { 
          error: null, 
          needsEmailConfirmation: true,
          message: 'Please check your email and click the confirmation link to complete your registration.'
        };
      }

      // If user was created and is immediately signed in (email confirmation disabled)
      if (data.user && data.session) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role || 'customer',
            email_verified: data.user.email_confirmed_at ? true : false,
            is_active: true,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { 
            error: { message: 'Account created but profile setup failed. Please contact support.' } as AuthError 
          };
        }

        return { error: null, message: 'Account created successfully!' };
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error as AuthError };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔵 Attempting sign-in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign-in error from Supabase:', error);
        setUser(null); // Ensure user is null if Supabase auth fails
        setProfile(null); // Ensure profile is null
        setSession(null);
        setLoading(false);
        return { error };
      }

      // If signInWithPassword is successful, onAuthStateChange will handle setting user, session, and profile.
      // We don't need to manually set them here, as that might cause race conditions or use stale data.
      console.log('✅ Sign-in successful via Supabase for:', data.user?.email);
      // The onAuthStateChange listener will now pick up the new session and update user/profile.
      // It will also call setLoading(false) when it's done.

      // We can still update last_login_at here if needed, but ensure it refers to the successfully logged-in user.
      // However, it might be better to move this to onAuthStateChange when event is 'SIGNED_IN'
      // and we are sure the profile is also loaded.
      // For now, let's rely on onAuthStateChange to set the user state correctly.

      return { error: null }; // Indicates success to the caller page
    } catch (error) {
      console.error('❌ Uncaught sign-in error:', error);
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      return { error: error as AuthError };
    }
    // setLoading(false) will be handled by onAuthStateChange or error blocks
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Resend confirmation email function
  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // Refresh profile data
      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 