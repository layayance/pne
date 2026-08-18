import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const isSupabaseConfigured = Boolean(
  environment.supabaseUrl && environment.supabasePublishableKey,
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(environment.supabaseUrl, environment.supabasePublishableKey)
  : null;
