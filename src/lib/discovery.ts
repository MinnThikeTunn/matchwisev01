import { UserProfile, IntentSubMode } from '../types';
import { DATING_META } from '../data/datingProfiles';
import { evaluatePairwiseMatch } from './algorithm';

export const MATCH_VERSION = 'MATCHWISE_MATCH_V1_0';

/** Discovery contexts. Dating is the primary one. */
export type DiscoveryContext = 'DATING' | 'COLLABORATE' | 'STUDY' | 'FRIENDS' | 'TEAMS';

export const DISCOVERY_CONTEXTS: {
  id: DiscoveryContext;
  label: string;
  subMode: IntentSubMode;
  blurb: string;
}[] = [
  { id: 'DATING', label: 'Dating', subMode: 'DATING', blurb: 'Romantic intent, values & lifestyle fit' },
  { id: 'COLLABORATE', label: 'Collaborate', subMode: 'NETWORKING', blurb: 'Skill exchange & co-building' },
  { id: 'STUDY', label: 'Study', subMode: 'STUDY_PARTNERS', blurb: 'Peers, tutors & learners' },
  { id: 'FRIENDS', label: 'Community', subMode: 'FRIENDS', blurb: 'Social rhythm & shared activities' },
  { id: 'TEAMS', label: 'Teams', subMode: 'PROJECT_GROUPS', blurb: 'Role coverage & delivery fit' },
];

/**
 * Per-context weighting. Dating leans on values, lifestyle, communication and
 * interests; the working contexts lean on complementary skills and delivery.
 */
export const CONTEXT_WEIGHTS: Record<
  DiscoveryContext,
  { values: number; lifestyle: number; communication: number; interests: number; skills: number }
> = {
  DATING: { values: 0.3, lifestyle: 0.22, communication: 0.2, interests: 0.2, skills: 0.08 },
  COLLABORATE: { values: 0.15, lifestyle: 0.05, communication: 0.15, interests: 0.15, skills: 0.5 },
  STUDY: { values: 0.15, lifestyle: 0.1, communication: 0.2, interests: 0.15, skills: 0.4 },
  FRIENDS: { values: 0.2, lifestyle: 0.25, communication: 0.15, interests: 0.3, skills: 0.1 },
  TEAMS: { values: 0.15, lifestyle: 0.05, communication: 0.15, interests: 0.1, skills: 0.55 },
};


export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  candidateId: string;
  action: SwipeAction;
  context: DiscoveryContext;
  at: string;
  matchVersion: string;
  /** Tags the candidate was shown with — only shown candidates feed learning. */
  tags: string[];
}

const STORAGE_KEY = 'matchwise_discovery_swipes';

export function loadSwipes(): SwipeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SwipeRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSwipes(records: SwipeRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-400)));
  } catch {
    /* ignore */
  }
}

export function clearSwipes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Tags used as preference signals for a candidate. */
export function candidateTags(candidate: UserProfile): string[] {
  return [
    ...candidate.needsOffers.offers,
    ...candidate.needsOffers.domains,
  ].map((t) => t.toLowerCase());
}

export interface LearnedSignal {
  weights: Record<string, number>;
  liked: number;
  passed: number;
}

/** Learned preference from actual swipe behaviour, per context. */
export function learnSignal(swipes: SwipeRecord[], context: DiscoveryContext): LearnedSignal {
  const weights: Record<string, number> = {};
  let liked = 0;
  let passed = 0;
  for (const s of swipes) {
    if (s.context !== context) continue;
    const delta = s.action === 'like' ? 1 : -0.6;
    if (s.action === 'like') liked++;
    else passed++;
    for (const tag of s.tags) weights[tag] = (weights[tag] || 0) + delta;
  }
  return { weights, liked, passed };
}

export function topLearnedTags(signal: LearnedSignal, n = 3): string[] {
  return Object.entries(signal.weights)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

export interface RankedCandidate {
  candidate: UserProfile;
  baseScore: number;
  behaviourAdjustment: number;
  score: number;
  confidence: number;
  eligible: boolean;
  gateReason?: string;
  isExploration: boolean;
  reasons: string[];
  uncertainties: string[];
}

/** Shared interests / values proxies used by the dating context. */
export function sharedInterests(a: UserProfile, b: UserProfile): string[] {
  const mine = new Set(
    [...a.needsOffers.domains, ...a.needsOffers.offers].map((t) => t.toLowerCase()),
  );
  return [...b.needsOffers.domains, ...b.needsOffers.offers].filter((t) =>
    mine.has(t.toLowerCase()),
  );
}

/**
 * Context-weighted adjustment on top of the deterministic pairwise score.
 * Dating weights values, lifestyle, communication and interests far above skills.
 */
function contextAdjustment(
  requester: UserProfile,
  candidate: UserProfile,
  context: DiscoveryContext,
): number {
  const w = CONTEXT_WEIGHTS[context];
  const close = (x: number, y: number) => 1 - Math.min(1, Math.abs(x - y) / 100);

  const values = close(requester.resonanceScore, candidate.resonanceScore);
  const lifestyle =
    0.5 * close(requester.availabilityHoursPerWeek * 4, candidate.availabilityHoursPerWeek * 4) +
    0.5 * close(requester.ocean.conscientiousness, candidate.ocean.conscientiousness);
  const communication =
    0.5 * close(requester.ocean.extraversion, candidate.ocean.extraversion) +
    0.5 * close(100 - requester.ocean.neuroticism, 100 - candidate.ocean.neuroticism);
  const interests = Math.min(1, sharedInterests(requester, candidate).length / 3);
  const skills = close(requester.capabilityScore, candidate.capabilityScore);

  const weighted =
    values * w.values +
    lifestyle * w.lifestyle +
    communication * w.communication +
    interests * w.interests +
    skills * w.skills;

  // Centred so an average pair is unaffected; bounded to a modest nudge.
  return Math.max(-8, Math.min(8, (weighted - 0.6) * 20));
}

function datingEvidence(
  requester: UserProfile,
  candidate: UserProfile,
): { reasons: string[]; uncertainties: string[] } {
  const reasons: string[] = [];
  const uncertainties: string[] = [];
  const shared = sharedInterests(requester, candidate);
  const meta = DATING_META[candidate.id];

  if (meta?.lookingFor) reasons.push(`Looking for: ${meta.lookingFor.toLowerCase()}.`);
  if (shared.length) reasons.push(`You share ${shared.slice(0, 2).join(' and ')}.`);
  if (meta?.interests?.length) reasons.push(`Spends free time on ${meta.interests.slice(0, 3).join(', ').toLowerCase()}.`);
  if (Math.abs(requester.ocean.extraversion - candidate.ocean.extraversion) <= 15)
    reasons.push('Similar social energy — evenings would likely look alike.');
  if (Math.abs(requester.ocean.agreeableness - candidate.ocean.agreeableness) <= 12)
    reasons.push('Close on warmth and how you handle disagreement.');
  if (candidate.ocean.neuroticism <= 30) reasons.push('Steady under stress, by their own account.');
  if (!reasons.length) reasons.push('Broad overlap without one standout factor yet.');

  if (typeof meta?.distanceKm === 'number' && meta.distanceKm > 12)
    uncertainties.push(`About ${meta.distanceKm} km away — worth checking how you both feel about that.`);
  if (Math.abs(requester.availabilityHoursPerWeek - candidate.availabilityHoursPerWeek) > 8)
    uncertainties.push('Your free time looks quite different week to week.');
  uncertainties.push('Chemistry is not something a score can predict — treat this as a starting point.');

  return { reasons: reasons.slice(0, 6), uncertainties: uncertainties.slice(0, 3) };
}

function evidence(
  requester: UserProfile,
  candidate: UserProfile,
  context: DiscoveryContext,
): { reasons: string[]; uncertainties: string[] } {
  if (context === 'DATING') return datingEvidence(requester, candidate);

  const reasons: string[] = [];
  const uncertainties: string[] = [];

  const theirOffersYouNeed = requester.needsOffers.needs.filter((n) =>
    candidate.needsOffers.offers.some(
      (o) => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()),
    ),
  );
  const yourOffersTheyNeed = candidate.needsOffers.needs.filter((n) =>
    requester.needsOffers.offers.some(
      (o) => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()),
    ),
  );
  const sharedDomains = requester.needsOffers.domains.filter((d) =>
    candidate.needsOffers.domains.includes(d),
  );
  const availGap = Math.abs(requester.availabilityHoursPerWeek - candidate.availabilityHoursPerWeek);

  if (theirOffersYouNeed.length) reasons.push(`They cover what you're missing: ${theirOffersYouNeed.slice(0, 2).join(', ')}.`);
  if (yourOffersTheyNeed.length) reasons.push(`You cover what they're missing: ${yourOffersTheyNeed.slice(0, 2).join(', ')}.`);
  if (sharedDomains.length) reasons.push(`You both work in ${sharedDomains.slice(0, 2).join(' and ')}.`);
  if (availGap <= 6) reasons.push('Your weekly availability lines up closely.');
  if (context === 'STUDY' && Math.abs(requester.capabilityScore - candidate.capabilityScore) >= 10)
    reasons.push('Skill gap is complementary — useful for teaching and learning.');
  if (context === 'TEAMS' && candidate.executionScore >= 80)
    reasons.push('High execution drive strengthens delivery on a team.');
  if (context === 'FRIENDS' && Math.abs(requester.ocean.extraversion - candidate.ocean.extraversion) <= 15)
    reasons.push('Similar social rhythm makes casual contact easy.');
  if (!reasons.length) reasons.push('Broad profile overlap without a single standout factor.');

  if (availGap > 12) uncertainties.push('Weekly availability differs a lot — coordination may be harder.');
  if (!sharedDomains.length) uncertainties.push('No shared domain recorded yet.');
  if (!candidate.constraints.connectionGoals?.length) uncertainties.push('Their connection goals are not filled in.');
  if (context === 'STUDY') uncertainties.push('We have limited information about their study style.');

  return { reasons, uncertainties: uncertainties.slice(0, 3) };
}

/**
 * Candidate pool -> remove self -> remove seen/blocked -> hard boundaries ->
 * context scoring -> behaviour adjustment -> confidence -> explanation -> rank.
 */
export function rankDiscovery(
  requester: UserProfile,
  pool: UserProfile[],
  context: DiscoveryContext,
  swipes: SwipeRecord[],
): RankedCandidate[] {
  const seen = new Set(swipes.filter((s) => s.context === context).map((s) => s.candidateId));
  const signal = learnSignal(swipes, context);
  const subMode = DISCOVERY_CONTEXTS.find((c) => c.id === context)!.subMode;

  const ranked = pool
    .filter((c) => c.id !== requester.id && !seen.has(c.id))
    .filter((c) => (context === 'DATING' ? c.subMode === 'DATING' : c.subMode !== 'DATING'))
    .map<RankedCandidate>((candidate) => {
      const result = evaluatePairwiseMatch(requester, candidate, subMode);
      const tags = candidateTags(candidate);
      const raw = tags.reduce((acc, t) => acc + (signal.weights[t] || 0), 0);
      // Bounded nudge so learned behaviour never dominates the deterministic score.
      const behaviourAdjustment =
        Math.max(-6, Math.min(6, raw * 1.2)) + contextAdjustment(requester, candidate, context);
      const { reasons, uncertainties } = evidence(requester, candidate, context);
      return {
        candidate,
        baseScore: result.finalMatchScore,
        behaviourAdjustment: Math.round(behaviourAdjustment * 10) / 10,
        score: Math.round(result.finalMatchScore + behaviourAdjustment),
        confidence: result.confidenceFactor,
        eligible: result.hardGatePassed,
        gateReason: result.gateFailureReason,
        isExploration: false,
        reasons,
        uncertainties,
      };
    })
    .filter((r) => r.eligible)
    .sort((a, b) => b.score - a.score);

  // Exploration slot: keep one lower-ranked candidate near the top so the feed
  // does not collapse into a single narrow profile type.
  if (ranked.length > 4) {
    const idx = 3 + (swipes.length % Math.max(1, ranked.length - 3));
    const [explore] = ranked.splice(Math.min(idx, ranked.length - 1), 1);
    if (explore) {
      explore.isExploration = true;
      ranked.splice(Math.min(2, ranked.length), 0, explore);
    }
  }

  return ranked;
}

export function confidenceLabel(c: number): string {
  if (c >= 0.9) return 'High';
  if (c >= 0.78) return 'Moderate';
  return 'Limited';
}

export function evidenceLabel(score: number): string {
  if (score >= 90) return 'Strong';
  if (score >= 80) return 'Promising';
  if (score >= 70) return 'Worth exploring';
  return 'Early signal';
}
