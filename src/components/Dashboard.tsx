// ✅ FINAL, thoroughly aligned `/dashboard` page
// ✅ Works with your existing `Dashboard.tsx` without breaking streak, points, and goals expectations
// ✅ Ensures complete Supabase session validation, profile structure compatibility, and correct data mapping
// ✅ Prevents infinite spinners and misalignments

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabaseClient';
import { Dashboard } from '@/components/Dashboard';
import { User, DailyStats } from '@/types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session fetch error:', sessionError);
          setError('Could not fetch session.');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        if (!session) {
          router.push('/login');
          return;
        }

        const userId = session.user.id;

        // ✅ Fetch profile with required fields for `Dashboard.tsx`
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, goals, streak, points')
          .eq('id', userId)
          .single();

        if (profileError || !profileData) {
          console.error('Profile fetch error:', profileError);
          setError('Could not load user profile.');
          return;
        }

        if (!profileData.goals || typeof profileData.goals !== 'object') {
          setError('User goals data is missing or malformed.');
          return;
        }

        // ✅ Fetch today's health data with fallback if none
        const today = new Date().toISOString().split('T')[0];
        const { data: healthData, error: healthError } = await supabase
          .from('health_data')
          .select('calories, water, exercise, protein, carbs, fat')
          .eq('user_id', userId)
          .gte('created_at', `${today}T00:00:00Z`)
          .lte('created_at', `${today}T23:59:59Z`)
          .maybeSingle();

        if (healthError) {
          console.error('Health data fetch error:', healthError);
          setError('Could not load today\'s health data.');
          return;
        }

        const defaultStats: DailyStats = {
          calories: 0,
          water: 0,
          exercise: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };

        setUser(profileData);
        setTodayStats(healthData ?? defaultStats);
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('An unexpected error occurred while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="mt-4">Verifying authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-500">
        <p className="text-lg font-semibold">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded"
          onClick={() => router.push('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user || !todayStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // ✅ Cleanly renders with types and structure your current `Dashboard.tsx` expects
  return <Dashboard user={user} todayStats={todayStats} />;
}
