import { AuthResponse } from '@supabase/supabase-js';
import supabase from './supabase'
import { User } from './types';

export async function createUser(user: {name: string, email: string, password: string}): Promise<AuthResponse> {
  // First create the auth user
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: { name: user.name },
    }
  });

  if (error) throw error;

  // Ensure we have a user before proceeding
  if (!data.user) throw new Error('Failed to create user');

  // Create the user profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: data.user.id,
      name: user.name,
      email: user.email
    }]);

  if (profileError) throw profileError;

  return {data, error};
}
  
  export async function getUser(userId: string): Promise<User> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }

    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    
    if (error) {
      throw new Error(error.message || "Failed to fetch user");
    }

    if (!user || user.id !== userId) {
      throw new Error("User not found");
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      password: '', // We don't store or return passwords
      created_at: new Date(user.created_at!).getTime()
    };
  }
  
  export async function deleteUser(id: string): Promise<boolean> {
    // First delete the user's profile and related data
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
  
    if (profileError) throw profileError;
  
    // Then delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    
    if (authError) throw authError;
  
    return true;
  }
  
  export async function updateUser(
    id: string, 
    updates: { name?: string; email?: string; password?: string }
  ): Promise<User> {
    // Update auth user if email or password changed
    if (updates.email || updates.password) {
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: updates.email,
        password: updates.password
      });
  
      if (authError) throw authError;
    }
  
    // Update profile if name changed
    if (updates.name) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: updates.name })
        .eq('id', id);
  
      if (profileError) throw profileError;
    }
  
    // Get updated user data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !user) throw getUserError;
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
  
    if (profileError) throw profileError;
  
    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      password: '', // We don't return passwords
      created_at: new Date(user.created_at!).getTime()
    };
  }
  
  export async function LoginUser(user: { email: string; password: string; }): Promise<AuthResponse["data"]> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
  
    if (error) throw error;
    return data;
  }
  