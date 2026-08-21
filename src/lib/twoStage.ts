/**
 * Stage 1 / Stage 2 introduction layer.
 *
 * Stage 1 (Discover) records a *private interest signal*. It never creates a match.
 * Stage 2 (Introductions) proposes a small shortlist built from the deterministic
 * Prism engine plus a small signal component, and requires two independent yeses
 * before a conversation opens.
 */
import { UserProfile } from '../types';
import { evaluatePairwiseMatch } from './algorithm';

export type SignalAction = 'curious' | 'pass';
export type Decision = 'accepted' | 'declined';

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: string;
}

export interface StageState {
  demoMode: boolean;
  /** Guided-demo step index, see DEMO_STEPS. */
  step: number;
  signals: Record<string, SignalAction>;
  signalOrder: string[];
  decisions: Record<string, Decision>;
  /** The other person's private decision (simulated in demo mode). */
  theirDecisions: Record<string, Decision>;
  messages: Record<string, ChatMessage[]>;
  blocked: string[];
  closed: string[];
  reports: { candidateId: string; reason: string; at: string }[];
  toastSeen: boolean;
}

export const DEMO_STEPS = [
  { key: 'landing', label: 'Start' },
  { key: 'profile', label: 'Demo profile' },
  { key: 'discover', label: 'Signal' },
  { key: 'introductions', label: 'Shortlist' },
  { key: 'reasons', label: 'Why you two' },
  { key: 'decision', label: 'Two yeses' },
  { key: 'chat', label: 'Conversation' },
  { key: 'safety', label: 'Safety' },
  { key: 'complete', label: 'Recap' },
] as const;

const STORAGE_KEY = 'matchwise_two_stage_v1';

const initialState: StageState = {
  demoMode: false,
  step: 0,
  signals: {},
  signalOrder: [],
  decisions: {},
  theirDecisions: {},
  messages: {},
  blocked: [],
  closed: [],
  reports: [],
  toastSeen: false,
};

let state: StageState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initialState, ...(JSON.parse(raw) as StageState) };
  } catch {
    /* ignore */
  }
}

function set(next: Partial<StageState>) {
  state = { ...state, ...next };
  persist();
  emit();
}

export const stageStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): StageState {
    hydrate();
    return state;
  },
  getServerSnapshot(): StageState {
    return initialState;
  },
};

/* ------------------------------------------------------------------ actions */

export function startDemo() {
  state = { ...initialState, demoMode: true, step: 1 };
  // The guided demo needs a complete persona behind it, including the gender
  // and orientation that gate romantic introductions.
  applyDemoAnswers();
  persist();
  emit();
}

export function restartDemo() {
  startDemo();
}

export function exitDemo() {
  set({ demoMode: false });
}

/** Advances the guided demo, never moving backwards. */
export function reachStep(step: number) {
  if (!state.demoMode || state.step >= step) return;
  set({ step });
}

export function recordSignal(candidateId: string, action: SignalAction) {
  set({
    signals: { ...state.signals, [candidateId]: action },
    signalOrder: [...state.signalOrder.filter((id) => id !== candidateId), candidateId],
    toastSeen: true,
  });
}

export function undoLastSignal() {
  const last = state.signalOrder[state.signalOrder.length - 1];
  if (!last) return;
  const signals = { ...state.signals };
  delete signals[last];
  set({ signals, signalOrder: state.signalOrder.slice(0, -1) });
}

export function decideIntroduction(candidateId: string, decision: Decision) {
  set({ decisions: { ...state.decisions, [candidateId]: decision } });
}

/** Demo mode only: the counterpart answers privately after a short delay. */
export function simulateTheirDecision(candidateId: string, decision: Decision = 'accepted') {
  set({ theirDecisions: { ...state.theirDecisions, [candidateId]: decision } });
}

export function sendMessage(candidateId: string, text: string, from: 'me' | 'them' = 'me') {
  const thread = state.messages[candidateId] ?? [];
  const message: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    from,
    text,
    at: new Date().toISOString(),
  };
  set({ messages: { ...state.messages, [candidateId]: [...thread, message] } });
}

export function blockCandidate(candidateId: string) {
  if (state.blocked.includes(candidateId)) return;
  set({ blocked: [...state.blocked, candidateId], closed: [...state.closed, candidateId] });
}

export function reportCandidate(candidateId: string, reason: string) {
  set({
    reports: [...state.reports, { candidateId, reason, at: new Date().toISOString() }],
  });
}

export function leaveConversation(candidateId: string) {
  if (state.closed.includes(candidateId)) return;
  set({ closed: [...state.closed, candidateId] });
}

/* ------------------------------------------------------- derived match logic */

export type IntroStatus = 'pending' | 'accepted' | 'matched' | 'closed';

export interface ReasonChip {
  label: 'Intent' | 'Values' | 'Communication' | 'Timing';
  detail: string;
  strong: boolean;
}

export interface Introduction {
  candidate: UserProfile;
  /** Honest band label — never an exact percentage. */
  band: 'Top fit this week' | 'Strong alignment' | 'Worth a closer look';
  chips: ReasonChip[];
  sections: { title: string; body: string }[];
  nuance: string;
  starters: string[];
  status: IntroStatus;
  /** Internal only — used for ordering, never shown as a score. */
  rank: number;
}

const overlap = (a: string[] = [], b: string[] = []) =>
  a.filter((x) => b.some((y) => y.toLowerCase() === x.toLowerCase()));

const loose = (a: string[] = [], b: string[] = []) =>
  a.filter((x) =>
    b.some(
      (y) =>
        y.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(y.toLowerCase()),
    ),
  );

function listPhrase(items: string[], max = 3) {
  const shown = items.slice(0, max);
  if (shown.length === 0) return '';
  if (shown.length === 1) return shown[0]!;
  return `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`;
}

function buildReasons(me: UserProfile, them: UserProfile) {
  const sharedGoals = overlap(me.constraints.connectionGoals, them.constraints.connectionGoals);
  const sharedDomains = overlap(me.needsOffers.domains, them.needsOffers.domains);
  const theyOfferWhatINeed = loose(me.needsOffers.needs, them.needsOffers.offers);
  const iOfferWhatTheyNeed = loose(them.needsOffers.needs, me.needsOffers.offers);
  const sameIntent = me.subMode === them.subMode;
  const paceGap = Math.abs(me.availabilityHoursPerWeek - them.availabilityHoursPerWeek);
  const sameRhythm =
    me.communicationLatency.split(',')[0]!.trim().toLowerCase() ===
    them.communicationLatency.split(',')[0]!.trim().toLowerCase();

  const chips: ReasonChip[] = [
    {
      label: 'Intent',
      detail: sameIntent
        ? `You are both here for ${them.subMode.toLowerCase().replace('_', ' ')}`
        : `Different headline intent — worth checking early`,
      strong: sameIntent || sharedGoals.length > 0,
    },
    {
      label: 'Values',
      detail: sharedDomains.length
        ? `Shared ground in ${listPhrase(sharedDomains, 2)}`
        : `Different fields, complementary outlooks`,
      strong: sharedDomains.length > 0,
    },
    {
      label: 'Communication',
      detail: sameRhythm
        ? `You both prefer ${me.communicationLatency.split(',')[0]!.trim().toLowerCase()} exchanges`
        : `${them.name.split(' ')[0]} leans ${them.communicationLatency.split(',')[0]!.trim().toLowerCase()}`,
      strong: sameRhythm,
    },
    {
      label: 'Timing',
      detail:
        paceGap <= 6
          ? `Similar weekly availability (~${Math.min(me.availabilityHoursPerWeek, them.availabilityHoursPerWeek)} hrs)`
          : `Availability differs by about ${paceGap} hrs a week`,
      strong: paceGap <= 6,
    },
  ];

  const firstName = them.name.split(' ').slice(-1)[0]!;

  const sections = [
    {
      title: 'Shared foundation',
      body: sharedGoals.length
        ? `You are both looking for ${listPhrase(sharedGoals, 2).toLowerCase()}, and neither of you is in a rush to skip the getting-to-know-you part.`
        : `You describe what you want in similar terms: something considered, with room to grow into it.`,
    },
    {
      title: 'Easy conversation',
      body: sharedDomains.length
        ? `You both spend time around ${listPhrase(sharedDomains)}. That is a real first conversation, not small talk.`
        : `${firstName} works in ${them.needsOffers.domains[0] ?? 'a nearby field'}, close enough to yours that curiosity travels both ways.`,
    },
    {
      title: 'Compatible rhythm',
      body: sameRhythm
        ? `You both prefer ${me.communicationLatency.toLowerCase()} over constant back-and-forth.`
        : `You prefer ${me.communicationLatency.toLowerCase()}; ${firstName} prefers ${them.communicationLatency.toLowerCase()}. Say so early and it stays easy.`,
    },
    {
      title: 'Practical overlap',
      body: `Your free time overlaps at roughly ${Math.min(me.availabilityHoursPerWeek, them.availabilityHoursPerWeek)} hours a week${
        me.location === them.location ? `, and you are both in ${them.location}.` : `, across ${me.location} and ${them.location}.`
      }`,
    },
  ];

  if (theyOfferWhatINeed.length || iOfferWhatTheyNeed.length) {
    sections.push({
      title: 'What you each bring',
      body: `${firstName} brings ${listPhrase(theyOfferWhatINeed, 2) || 'a different angle'}; you bring ${
        listPhrase(iOfferWhatTheyNeed, 2) || 'a perspective they are missing'
      }.`,
    });
  }

  const nuance = sameRhythm
    ? `${firstName} plans further ahead than you do. Treat that as a conversation point, not a prediction.`
    : `You two pace things differently. Treat that as a conversation point, not a prediction.`;

  const starters = [
    `What's the best thing you made or fixed recently?`,
    `What would your ideal quiet weekend look like?`,
    sharedDomains.length
      ? `What got you into ${sharedDomains[0]}?`
      : `What project are you most excited about right now?`,
  ];

  return { chips, sections, nuance, starters };
}

function statusFor(state: StageState, id: string): IntroStatus {
  if (state.closed.includes(id) || state.blocked.includes(id) || state.decisions[id] === 'declined')
    return 'closed';
  if (state.decisions[id] === 'accepted' && state.theirDecisions[id] === 'accepted')
    return 'matched';
  if (state.decisions[id] === 'accepted') return 'accepted';
  return 'pending';
}

/** The Stage 2 shortlist: deliberately small, eligibility-gated, signal-nudged. */
export function buildIntroductions(
  me: UserProfile,
  pool: UserProfile[],
  s: StageState,
  limit = 3,
): Introduction[] {
  const scored = pool
    .filter((p) => p.id !== me.id && !s.blocked.includes(p.id))
    .map((candidate) => {
      const result = evaluatePairwiseMatch(me, candidate);
      // Stage 1 contributes a small nudge only — it never replaces compatibility.
      const signal = s.signals[candidate.id];
      const nudge = signal === 'curious' ? 4 : signal === 'pass' ? -10 : 0;
      return {
        candidate,
        eligible: result.hardGatePassed,
        rank: result.finalMatchScore + nudge,
      };
    })
    .filter((x) => x.eligible)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);

  return scored.map(({ candidate, rank }, index) => {
    const { chips, sections, nuance, starters } = buildReasons(me, candidate);
    const band: Introduction['band'] =
      index === 0 ? 'Top fit this week' : rank >= 85 ? 'Strong alignment' : 'Worth a closer look';
    return {
      candidate,
      band,
      chips,
      sections,
      nuance,
      starters,
      status: statusFor(s, candidate.id),
      rank,
    };
  });
}

export function findIntroduction(
  me: UserProfile,
  pool: UserProfile[],
  s: StageState,
  id: string,
): Introduction | undefined {
  return buildIntroductions(me, pool, s, 6).find((i) => i.candidate.id === id);
}

export const REPORT_REASONS = [
  'Fake or misleading profile',
  'Harassment or abusive messages',
  'Inappropriate photos',
  'Asking for money',
  'Someone I know in real life',
];

export const MEETING_CHECKLIST = [
  'Meet somewhere public and familiar',
  'Tell a friend where you are going and when',
  'Arrange your own transport there and back',
  'Leave whenever you want to — no explanation owed',
];
