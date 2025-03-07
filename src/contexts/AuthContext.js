import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSupabase } from '../supabase/config';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    let mounted = true;
    let authSubscription = null;

    async function initializeAuth() {
      try {
        // Get initialized Supabase client
        const client = await getSupabase();
        if (!mounted) return;
        
        setSupabaseClient(client);
        
        // Set initial user
        const { data: { user: initialUser } } = await client.auth.getUser();
        if (mounted) setUser(initialUser);

        // Listen for auth changes
        authSubscription = client.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user ?? null);
              console.log('Auth state changed:', event, session?.user?.email);
            }
          }
        );
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    supabase: supabaseClient,
    isInitialized: !!supabaseClient
  };

  // Only render children when Supabase is initialized
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 