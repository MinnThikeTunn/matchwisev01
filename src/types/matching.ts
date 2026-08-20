import { IntentSubMode, OCEANProfile } from './index';

export type ConnectionGoal =
  | 'FRIENDSHIP'
  | 'DATING'
  | 'STUDY_PARTNERS'
  | 'HACKATHON_TEAMS'
  | 'GAMING'
  | 'NETWORKING'
  | 'MENTORSHIP';

export interface MatchFeatures {
  // Identity (profile basics)
  identity: {
    name: string;
    title: string;
    location: string;
    bio: string;
    avatar: string;
    age: number | null;
  };

  // Objective
  connectionGoals: ConnectionGoal[];

  // Similarity factors
  interests: string[];              // Jaccard similarity, weight 0.30
  values: string[];                 // weight 0.15
  communication: {                  // weight 0.15
    channels: string[];
    conversationPreference: string; // small talk / deep / balanced
    replySpeed: string;             // immediate / hours / daily
  };
  ocean: OCEANProfile;              // weight 0.25

  // Complementarity factors (variable weight per goal)
  complementarity: {
    teamRole: string;               // leader / supporter / organizer / idea generator
    skills: string[];               // frontend / backend / design / data ...
    creativityRole: string;
    experienceLevel: string;        // beginner / intermediate / advanced / mentor
  };

  // Lifestyle (0.10)
  lifestyle: {
    sleepSchedule: string;
    exerciseFrequency: string;
    workStyle: string;
    socialEnergy: string;
  };

  // Availability (0.05)
  availability: {
    days: string[];
    timeBlocks: string[];
    hoursPerWeek: number;
  };

  // Constraint rules
  constraints: {
    languages: string[];
    minAge: number;
    maxAge: number;
    maxDistanceKm: number;
    locationFlexible: boolean;
  };

  completedAt?: string;
  version: string;
}

/** Configurable weights — tune without touching scoring code. */
export const MATCH_WEIGHTS: Record<
  ConnectionGoal,
  {
    interests: number;
    values: number;
    communication: number;
    personality: number;
    lifestyle: number;
    availability: number;
    complementarity: number;
  }
> = {
  FRIENDSHIP:       { interests: 0.30, values: 0.15, communication: 0.15, personality: 0.25, lifestyle: 0.10, availability: 0.05, complementarity: 0.10 },
  DATING:           { interests: 0.25, values: 0.20, communication: 0.18, personality: 0.25, lifestyle: 0.08, availability: 0.04, complementarity: 0.10 },
  STUDY_PARTNERS:   { interests: 0.20, values: 0.12, communication: 0.15, personality: 0.20, lifestyle: 0.08, availability: 0.10, complementarity: 0.25 },
  HACKATHON_TEAMS:  { interests: 0.18, values: 0.10, communication: 0.14, personality: 0.18, lifestyle: 0.05, availability: 0.10, complementarity: 0.35 },
  GAMING:           { interests: 0.35, values: 0.08, communication: 0.15, personality: 0.20, lifestyle: 0.07, availability: 0.10, complementarity: 0.05 },
  NETWORKING:       { interests: 0.20, values: 0.15, communication: 0.15, personality: 0.20, lifestyle: 0.05, availability: 0.05, complementarity: 0.30 },
  MENTORSHIP:       { interests: 0.15, values: 0.15, communication: 0.15, personality: 0.15, lifestyle: 0.05, availability: 0.05, complementarity: 0.40 },
};

export const GOAL_TO_SUBMODE: Record<ConnectionGoal, IntentSubMode> = {
  FRIENDSHIP: 'FRIENDS',
  DATING: 'DATING',
  STUDY_PARTNERS: 'STUDY_PARTNERS',
  HACKATHON_TEAMS: 'HACKATHON_TEAMS',
  GAMING: 'ACTIVITIES',
  NETWORKING: 'NETWORKING',
  MENTORSHIP: 'MENTORSHIP',
};

export const DEFAULT_FEATURES: MatchFeatures = {
  identity: { name: '', title: '', location: '', bio: '', avatar: '', age: null },
  connectionGoals: [],
  interests: [],
  values: [],
  communication: { channels: [], conversationPreference: '', replySpeed: '' },
  ocean: { openness: 60, conscientiousness: 60, extraversion: 60, agreeableness: 60, neuroticism: 40 },
  complementarity: { teamRole: '', skills: [], creativityRole: '', experienceLevel: '' },
  lifestyle: { sleepSchedule: '', exerciseFrequency: '', workStyle: '', socialEnergy: '' },
  availability: { days: [], timeBlocks: [], hoursPerWeek: 10 },
  constraints: { languages: ['English'], minAge: 18, maxAge: 45, maxDistanceKm: 100, locationFlexible: true },
  version: 'onboarding-v1',
};
