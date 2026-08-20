CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE IF NOT EXISTS public.anon_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  title text,
  location text,
  bio text,
  avatar text,
  public_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT true,
  claimed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.anon_profiles TO anon;
GRANT SELECT ON public.anon_profiles TO authenticated;
GRANT ALL ON public.anon_profiles TO service_role;

ALTER TABLE public.anon_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.anon_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.anon_profiles FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE TABLE IF NOT EXISTS public.anon_profile_features (
  profile_id uuid PRIMARY KEY REFERENCES public.anon_profiles(id) ON DELETE CASCADE,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.anon_profile_features TO service_role;
ALTER TABLE public.anon_profile_features ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_anon_profiles_updated_at ON public.anon_profiles;
CREATE TRIGGER update_anon_profiles_updated_at
  BEFORE UPDATE ON public.anon_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_anon_profile_features_updated_at ON public.anon_profile_features;
CREATE TRIGGER update_anon_profile_features_updated_at
  BEFORE UPDATE ON public.anon_profile_features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS anon_profiles_public_updated_idx ON public.anon_profiles (is_public, updated_at DESC);