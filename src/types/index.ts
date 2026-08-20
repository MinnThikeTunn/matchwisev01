export type EngineTier = 'PERSONAL' | 'PROFESSIONAL' | 'COLLABORATIVE';

export type ViewMode = 'dashboard' | 'discovery' | 'maps' | 'verification' | 'synergy' | 'profile' | 'colors';

export type IntentSubMode = 
  | 'DATING' 
  | 'FRIENDS' 
  | 'ACTIVITIES' 
  | 'NETWORKING' 
  | 'MENTORSHIP' 
  | 'STUDY_PARTNERS' 
  | 'HACKATHON_TEAMS' 
  | 'PROJECT_GROUPS' 
  | 'CUSTOM_AI_MATCH';

export interface OCEANProfile {
  openness: number; // 0 - 100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface NeedsOffersProfile {
  offers: string[];
  needs: string[];
  domains: string[];
}

export interface HardConstraints {
  minAge?: number;
  maxAge?: number;
  languages: string[];
  blockedUserIds: string[];
  connectionGoals: string[];
  location?: string;
  maxDistanceKm?: number;
}

export interface ChromaticSpec {
  name: string;
  dotColor: string;
  l: number;
  c: number;
  h: number;
  channel: 'SOLAR' | 'NEXUS' | 'RESONANCE';
  description: string;
}

export interface PrismSpectrum {
  solarResonance: number; // Execution Drive (Red/Gold) 0-100
  deepTealAnchor: number; // Capability & Skill Set (Blue/Cyan) 0-100
  verdantSpark: number;   // Ethics & Compatibility (Green/Violet) 0-100
  dominantSignature: string;
  globalSynergyScore: number;
  chromaticSpecs: ChromaticSpec[];
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  email?: string;
  bio: string;
  location: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  tier: EngineTier;
  subMode: IntentSubMode;
  ocean: OCEANProfile;
  needsOffers: NeedsOffersProfile;
  constraints: HardConstraints;
  spectrum: PrismSpectrum;
  executionScore: number; // 0-100
  capabilityScore: number; // 0-100
  resonanceScore: number;  // 0-100
  availabilityHoursPerWeek: number;
  communicationLatency: string;
  riskTolerance: string;
  verifiedAt: string;
  prismId: string;
}

export interface KeyDriver {
  title: string;
  description: string;
  type: 'technical' | 'communication' | 'risk' | 'values' | 'schedule';
  scoreImpact: number;
}

export interface ArchetypalMetric {
  name: string;
  percentage: number;
  color: string;
  iconType: 'circle' | 'triangle-left' | 'triangle-up';
}

export interface MatchResult {
  candidate: UserProfile;
  requester: UserProfile;
  hardGatePassed: boolean; // G in {0, 1}
  gateFailureReason?: string;
  rawCompatibilityScore: number; // S in [0, 1]
  confidenceFactor: number; // C in [0, 1]
  finalMatchScore: number; // G * S * C (0 - 100%)
  synergyLabel: string;
  synergyDescription: string;
  keyDrivers: KeyDriver[];
  archetypalMetrics: ArchetypalMetric[];
  holisticBalance: number;
  isAiGeneratedExplanation?: boolean;
}

export interface CriteriaCardData {
  id: string;
  rawPrompt: string;
  targetSubMode: IntentSubMode;
  targetTeamSize: number;
  requiredRoles: { role: string; count: number }[];
  requiredSkills: string[];
  minExecutionDrive: number;
  preferredTimezone: string;
  domainFocus: string;
  isApproved: boolean;
}
