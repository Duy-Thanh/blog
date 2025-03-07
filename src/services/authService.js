import { getSupabase } from '../supabase/config';
import { decryptData } from '../utils/encryption';

let cachedCredentials = null;
let isDecrypting = false;

const loadEncryptedCredentials = async () => {
  // If already decrypting, wait
  if (isDecrypting) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return loadEncryptedCredentials();
  }

  // If cached, return cached version
  if (cachedCredentials) {
    return cachedCredentials;
  }

  try {
    isDecrypting = true;
    const response = await fetch(process.env.REACT_APP_ENCRYPTED_CREDENTIALS_PATH);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Encrypted credentials loaded:', data);
    cachedCredentials = data;
    return data;
  } finally {
    isDecrypting = false;
  }
};

export const authService = {
  async signIn(email, password) {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const supabase = await getSupabase();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async getSession() {
    try {
      const supabase = await getSupabase();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }
}; 