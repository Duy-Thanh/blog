import { getSupabase } from '../supabase/config';

export const blogService = {
  getPosts: async () => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPost: async (id) => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  createPost: async (post) => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (id, updates) => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  getPostBySlug: async (slug) => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  }
}; 