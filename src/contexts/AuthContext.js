import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Set initial user
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        if (mounted) setUser(initialUser);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user ?? null);
              console.log('Auth state changed:', event, session?.user?.email);
            }
          }
        );

        // Return cleanup function
        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const cleanup = initAuth();

    return () => {
      mounted = false;
      // Execute cleanup function if it exists
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const value = {
    user,
    loading,
    supabase,
    isInitialized: true
  };

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