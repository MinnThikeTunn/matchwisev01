import { createServerFn } from '@tanstack/react-start';
import type { Json } from '../integrations/supabase/types';

/**
 * Cloud storage for anonymous (no sign-in) onboarding profiles.
 *
 * - Public, non-sensitive profile data lives in `anon_profiles` and is readable
 *   by everyone through a narrow `is_public = true` policy.
 * - Raw questionnaire answers live in `anon_profile_features`, which has no
 *   client grants at all — only these server handlers can touch it.
 * - Writes are authorized by a per-device secret token; the database only ever
 *   stores its SHA-256 hash.
 */

export type PublicProfileRow = {
  id: string;
  name: string;
  title: string | null;
  location: string | null;
  bio: string | null;
  avatar: string | null;
  public_data: Json;
  updated_at: string;
};

const MAX_PAYLOAD_BYTES = 96 * 1024;

type SaveInput = {
  token: string;
  name?: string;
  title?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar?: string | null;
  publicData?: unknown;
  features?: unknown;
  completed?: boolean;
  isPublic?: boolean;
};

function clean(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function validateToken(token: unknown): string {
  if (typeof token !== 'string' || !/^[a-f0-9]{32,128}$/i.test(token)) {
    throw new Error('Invalid device token');
  }
  return token;
}

function validateJson(value: unknown, label: string): Json {
  const obj = (value && typeof value === 'object' && !Array.isArray(value)
    ? JSON.parse(JSON.stringify(value))
    : {}) as Json;
  const size = JSON.stringify(obj).length;
  if (size > MAX_PAYLOAD_BYTES) throw new Error(`${label} payload too large`);
  return obj;
}

async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(`matchwise:${token}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

export const saveOnboardingProfile = createServerFn({ method: 'POST' })
  .inputValidator((input: SaveInput) => {
    validateToken(input?.token);
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('../integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const publicData = validateJson(data.publicData, 'Profile');
    const features = validateJson(data.features, 'Answers');

    const row = {
      token_hash: tokenHash,
      name: clean(data.name, 120) ?? '',
      title: clean(data.title, 160),
      location: clean(data.location, 160),
      bio: clean(data.bio, 1000),
      avatar: clean(data.avatar, 500),
      public_data: publicData,
      is_public: data.isPublic !== false,
    };

    const { data: profile, error } = await supabaseAdmin
      .from('anon_profiles')
      .upsert(row, { onConflict: 'token_hash' })
      .select('id')
      .single();

    if (error || !profile) throw new Error(error?.message ?? 'Failed to save profile');

    const { error: featuresError } = await supabaseAdmin
      .from('anon_profile_features')
      .upsert(
        {
          profile_id: profile.id,
          features,
          completed: data.completed === true,
        },
        { onConflict: 'profile_id' },
      );

    if (featuresError) throw new Error(featuresError.message);

    return { id: profile.id as string };
  });

export const getOnboardingProfile = createServerFn({ method: 'POST' })
  .inputValidator((input: { token: string }) => {
    validateToken(input?.token);
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('../integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const { data: profile } = await supabaseAdmin
      .from('anon_profiles')
      .select('id, name, title, location, bio, avatar, public_data, is_public')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (!profile) return { profile: null, features: null, completed: false };

    const { data: features } = await supabaseAdmin
      .from('anon_profile_features')
      .select('features, completed')
      .eq('profile_id', profile.id)
      .maybeSingle();

    return {
      profile,
      features: features?.features ?? null,
      completed: features?.completed ?? false,
    };
  });

export const listPublicProfiles = createServerFn({ method: 'GET' }).handler(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const url = process.env['SUPABASE_URL']!;

  const supabasePublic = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) {
          headers.delete('Authorization');
        }
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await supabasePublic
    .from('anon_profiles')
    .select('id, name, title, location, bio, avatar, public_data, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) return { profiles: [] as PublicProfileRow[], error: error.message as string | null };
  return { profiles: (data ?? []) as unknown as PublicProfileRow[], error: null as string | null };
});
