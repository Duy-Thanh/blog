import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSupabase } from '../supabase/config';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const supabase = await getSupabase();
        
        // Set initial user
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        if (mounted) setUser(initialUser);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) setUser(session?.user ?? null);
          }
        );

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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