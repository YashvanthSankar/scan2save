import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern for Supabase client (matching prisma.ts pattern)
const globalForSupabase = global as unknown as { supabase: SupabaseClient };

export const supabase =
    globalForSupabase.supabase ||
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabase = supabase;
}
