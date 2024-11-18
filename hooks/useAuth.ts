import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../supabase';
import { useBoardStore } from '../store';

export function useAuth() {
  const router = useRouter();
  const { setUserId } = useBoardStore();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setUserId(null);
        router.push('/login');
        return;
      }

      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        try {
          const { data: { session: newSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError || !newSession) {
            throw refreshError || new Error('Failed to refresh session');
          }
          
          setUserId(newSession.user.id);
        } catch (e) {
          setUserId(null);
          router.push('/login');
        }
      } else {
        setUserId(session.user.id);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUserId(null);
          router.push('/login');
        } else if (session) {
          setUserId(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUserId]);
} 