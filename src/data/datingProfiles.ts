import { UserProfile } from '../types';
import type { Gender } from '../lib/preferences';
import { CHROMATIC_SPEC_PRESETS } from './mockData';

/** Extra, dating-only detail we show on romantic Discovery cards. */
export interface DatingMeta {
  age: number;
  /** How this person identifies. */
  gender: Gender;
  /** Genders they want to be introduced to. */
  interestedIn: Gender[];
  /** Plain-language label shown on the card. */
  orientation: string;
  distanceKm: number;
  lookingFor: string;
  interests: string[];
  worthKnowing: string;
}

export const DATING_META: Record<string, DatingMeta> = {
  'user-chloe-lin': {
    age: 29,
    gender: 'woman',
    interestedIn: ['woman', 'nonbinary'],
    orientation: 'Queer',
    distanceKm: 6,
    lookingFor: 'Something serious, unhurried',
    interests: ['Bookshops', 'Film photography', 'Slow mornings', 'Live jazz', 'Hiking'],
    worthKnowing: 'Writes letters instead of long texts — and means it.',
  },
  'user-nadia-rahman': {
    age: 27,
    gender: 'woman',
    interestedIn: ['man'],
    orientation: 'Straight',
    distanceKm: 3,
    lookingFor: 'A relationship, open to seeing where it goes',
    interests: ['Cooking', 'Tennis', 'Travel', 'Podcasts', 'Street food'],
    worthKnowing: 'Will absolutely make you try the spicy version first.',
  },
  'user-daniel-okafor': {
    age: 31,
    gender: 'man',
    interestedIn: ['woman'],
    orientation: 'Straight',
    distanceKm: 11,
    lookingFor: 'Long-term partnership',
    interests: ['Running', 'Cooking', 'Vinyl', 'Football', 'Museums'],
    worthKnowing: 'Sunday is for a long run and an even longer breakfast.',
  },
  'user-hana-ito': {
    age: 28,
    gender: 'woman',
    interestedIn: ['woman', 'man'],
    orientation: 'Bisexual',
    distanceKm: 8,
    lookingFor: 'Dating with intention',
    interests: ['Ceramics', 'Cycling', 'Cinema', 'Coffee', 'Gardening'],
    worthKnowing: 'Keeps a list of the best quiet cafés in every city she visits.',
  },
  'user-elena-vargas': {
    age: 33,
    gender: 'woman',
    interestedIn: ['man'],
    orientation: 'Straight',
    distanceKm: 15,
    lookingFor: 'Serious, kids someday',
    interests: ['Dancing', 'Wine', 'Sailing', 'Design', 'Dogs'],
    worthKnowing: 'Direct about what she wants — saves everyone a lot of time.',
  },
  'user-james-whitfield': {
    age: 30,
    gender: 'man',
    interestedIn: ['woman'],
    orientation: 'Straight',
    distanceKm: 4,
    lookingFor: 'A real relationship, not a rotation',
    interests: ['Climbing', 'Board games', 'Baking', 'Live music', 'Camping'],
    worthKnowing: 'Bakes when nervous. You benefit.',
  },
  'user-priya-menon': {
    age: 26,
    gender: 'woman',
    interestedIn: ['woman', 'man'],
    orientation: 'Bisexual',
    distanceKm: 9,
    lookingFor: 'Open to serious, taking it slowly',
    interests: ['Yoga', 'Painting', 'Sci-fi', 'Markets', 'Swimming'],
    worthKnowing: 'Paints on Sunday mornings and will ask you to sit for one.',
  },
};

function base(
  overrides: Partial<UserProfile> & Pick<UserProfile, 'id' | 'name' | 'title' | 'avatar' | 'bio' | 'location'>,
): UserProfile {
  return {
    coordinates: { x: 38, y: 35, lat: 37.7749, lng: -122.4194 },
    tier: 'PERSONAL',
    subMode: 'DATING',
    prismId: `MW-${overrides.id.slice(-4).toUpperCase()}`,
    verifiedAt: '2024-06-02T09:00:00Z',
    ocean: { openness: 80, conscientiousness: 78, extraversion: 66, agreeableness: 84, neuroticism: 28 },
    needsOffers: { offers: [], needs: [], domains: ['Personal Connection'] },
    constraints: {
      languages: ['English'],
      blockedUserIds: [],
      connectionGoals: ['Dating', 'Long-Term Alignment'],
      location: 'Local',
    },
    spectrum: {
      solarResonance: 80,
      deepTealAnchor: 82,
      verdantSpark: 90,
      dominantSignature: 'Warm Resonance',
      globalSynergyScore: 88,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS,
    },
    executionScore: 80,
    capabilityScore: 82,
    resonanceScore: 90,
    availabilityHoursPerWeek: 14,
    communicationLatency: 'Replies within a few hours',
    riskTolerance: 'Open and honest early',
    ...overrides,
  } as UserProfile;
}

/** Fictional demo people for the romantic Discovery context. */
export const DATING_PROFILES: UserProfile[] = [
  base({
    id: 'user-nadia-rahman',
    name: 'Nadia Rahman',
    title: 'Pastry chef',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
    bio: 'Runs a small bakery, chases tennis on weekday evenings, and keeps a running list of places to eat abroad.',
    location: 'San Francisco, CA',
    coordinates: { x: 38, y: 35, lat: 37.7849, lng: -122.4094 },
    ocean: { openness: 86, conscientiousness: 82, extraversion: 78, agreeableness: 88, neuroticism: 24 },
    needsOffers: {
      offers: ['Warmth', 'Cooking together', 'Directness'],
      needs: ['Curiosity', 'Consistency', 'Humour'],
      domains: ['Personal Connection', 'Food', 'Travel'],
    },
    communicationLatency: 'Texts back fast, prefers calling',
  }),
  base({
    id: 'user-daniel-okafor',
    name: 'Daniel Okafor',
    title: 'Physiotherapist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'Long runs, longer breakfasts, and a record collection that has outgrown the shelf it lives on.',
    location: 'Oakland, CA',
    coordinates: { x: 39, y: 35, lat: 37.8044, lng: -122.2712 },
    ocean: { openness: 74, conscientiousness: 90, extraversion: 62, agreeableness: 86, neuroticism: 20 },
    needsOffers: {
      offers: ['Steadiness', 'Follow-through', 'Calm under stress'],
      needs: ['Shared ambition', 'Affection', 'Honesty'],
      domains: ['Personal Connection', 'Fitness', 'Music'],
    },
    availabilityHoursPerWeek: 12,
  }),
  base({
    id: 'user-hana-ito',
    name: 'Hana Ito',
    title: 'Ceramicist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    bio: 'Makes cups for a living, cycles everywhere, and can be bribed with a good second-run cinema.',
    location: 'San Francisco, CA',
    coordinates: { x: 38, y: 35, lat: 37.7649, lng: -122.4294 },
    ocean: { openness: 93, conscientiousness: 80, extraversion: 52, agreeableness: 90, neuroticism: 26 },
    needsOffers: {
      offers: ['Creative energy', 'Patience', 'Quiet company'],
      needs: ['Depth', 'Gentleness', 'Space to work'],
      domains: ['Personal Connection', 'Art', 'Cinema'],
    },
    communicationLatency: 'Slow, thoughtful replies',
  }),
  base({
    id: 'user-elena-vargas',
    name: 'Elena Vargas',
    title: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Designs housing, sails badly but enthusiastically, and knows exactly what she is looking for.',
    location: 'Berkeley, CA',
    coordinates: { x: 39, y: 34, lat: 37.8715, lng: -122.273 },
    ocean: { openness: 84, conscientiousness: 92, extraversion: 74, agreeableness: 76, neuroticism: 22 },
    needsOffers: {
      offers: ['Clarity', 'Ambition', 'Good taste'],
      needs: ['Reliability', 'Family-minded', 'Warmth'],
      domains: ['Personal Connection', 'Design', 'Outdoors'],
    },
    availabilityHoursPerWeek: 10,
  }),
  base({
    id: 'user-james-whitfield',
    name: 'James Whitfield',
    title: 'Secondary school teacher',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
    bio: 'Climbs on Tuesdays, hosts a board game night that has run for four years, bakes when nervous.',
    location: 'San Francisco, CA',
    coordinates: { x: 38, y: 35, lat: 37.7799, lng: -122.4144 },
    ocean: { openness: 78, conscientiousness: 84, extraversion: 70, agreeableness: 92, neuroticism: 30 },
    needsOffers: {
      offers: ['Kindness', 'Consistency', 'Community'],
      needs: ['Playfulness', 'Openness', 'Shared weekends'],
      domains: ['Personal Connection', 'Outdoors', 'Games'],
    },
  }),
  base({
    id: 'user-priya-menon',
    name: 'Priya Menon',
    title: 'Paediatric nurse',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
    bio: 'Twelve-hour shifts, then yoga, then paint. Not in a hurry, but not here to waste time either.',
    location: 'Daly City, CA',
    coordinates: { x: 38, y: 36, lat: 37.6879, lng: -122.4702 },
    ocean: { openness: 88, conscientiousness: 86, extraversion: 58, agreeableness: 94, neuroticism: 25 },
    needsOffers: {
      offers: ['Empathy', 'Groundedness', 'Care'],
      needs: ['Patience with my schedule', 'Curiosity', 'Kindness'],
      domains: ['Personal Connection', 'Art', 'Wellness'],
    },
    availabilityHoursPerWeek: 8,
  }),
];
