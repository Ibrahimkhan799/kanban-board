import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

// Add session refresh handler
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    if (session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    }
  }
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('supabase.auth.token');
    window.location.href = '/login';
  }
});

export default supabase;