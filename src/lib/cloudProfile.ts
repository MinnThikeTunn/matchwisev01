import { UserProfile } from '../types';
import { MatchFeatures } from '../types/matching';
import {
  saveOnboardingProfile,
  getOnboardingProfile,
  listPublicProfiles,
} from './onboarding.functions';
import { getDeviceToken, storeProfileId } from './deviceIdentity';
import { MATCH_FEATURES_STORAGE_KEY, ONBOARDING_COMPLETE_KEY } from './onboardingStorage';

const USER_PROFILE_KEY = 'matchwise_user_profile';

/** Strip anything we don't want publicly readable before it leaves the browser. */
function toPublicProfile(profile: UserProfile): Record<string, unknown> {
  const { email: _email, ...rest } = profile;
  return rest as unknown as Record<string, unknown>;
}

export function cacheProfileLocally(profile: UserProfile, features?: MatchFeatures | null) {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    if (features) localStorage.setItem(MATCH_FEATURES_STORAGE_KEY, JSON.stringify(features));
  } catch {
    /* ignore */
  }
}

export function readCachedFeatures(): MatchFeatures | null {
  try {
    const raw = localStorage.getItem(MATCH_FEATURES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MatchFeatures) : null;
  } catch {
    return null;
  }
}

/** Persist the visitor's profile + raw answers to the cloud database. */
export async function saveProfileToCloud(
  profile: UserProfile,
  features: MatchFeatures | null,
  completed: boolean,
): Promise<boolean> {
  const token = getDeviceToken();
  if (!token) return false;

  try {
    const result = await saveOnboardingProfile({
      data: {
        token,
        name: profile.name,
        title: profile.title,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
        publicData: toPublicProfile(profile),
        features: features ?? {},
        completed,
        isPublic: true,
      },
    });
    if (result?.id) storeProfileId(result.id);
    return true;
  } catch (err) {
    console.warn('Cloud profile save failed, keeping local copy:', err);
    return false;
  }
}

export type LoadedCloudProfile = {
  profile: UserProfile | null;
  features: MatchFeatures | null;
  completed: boolean;
};

/** Load this device's profile back from the cloud database. */
export async function loadProfileFromCloud(): Promise<LoadedCloudProfile> {
  const token = getDeviceToken();
  if (!token) return { profile: null, features: null, completed: false };

  try {
    const res = await getOnboardingProfile({ data: { token } });
    if (!res?.profile) return { profile: null, features: null, completed: false };

    const publicData = res.profile.public_data as unknown;
    const profile =
      publicData && typeof publicData === 'object' && 'id' in (publicData as object)
        ? (publicData as UserProfile)
        : null;

    return {
      profile,
      features: (res.features as MatchFeatures | null) ?? null,
      completed: Boolean(res.completed),
    };
  } catch (err) {
    console.warn('Cloud profile load failed, using local copy:', err);
    return { profile: null, features: null, completed: false };
  }
}

/** Public directory of everyone who finished onboarding — readable by anyone. */
export async function fetchPublicProfiles(): Promise<UserProfile[]> {
  try {
    const res = await listPublicProfiles();
    return (res?.profiles ?? [])
      .map(row => {
        const data = row.public_data as unknown;
        if (!data || typeof data !== 'object' || !('id' in (data as object))) return null;
        const profile = data as UserProfile;
        return { ...profile, id: `cloud-${row.id}` } as UserProfile;
      })
      .filter((p): p is UserProfile => p !== null);
  } catch (err) {
    console.warn('Public profile fetch failed:', err);
    return [];
  }
}

export function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  } catch {
    /* ignore */
  }
}
