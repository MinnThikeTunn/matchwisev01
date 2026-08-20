import type { Profile } from "./data";

export type SignalState = "curious" | "pass" | null;

export type ReasonCode =
  | "aligned_long_term_intent"
  | "compatible_intent"
  | "shared_pace"
  | "shared_values"
  | "shared_interests"
  | "compatible_reply_pace"
  | "thoughtful_message_style"
  | "schedule_overlap"
  | "planning_style_difference"
  | "social_energy_difference"
  | "different_reply_rhythm"
  | "different_intent_timeline";

export type FactorBreakdown = {
  goals: number;
  values: number;
  communication: number;
  interests: number;
  lifestyle: number;
  personality: number;
  signal: number;
};

export type ScoredCandidate = {
  profile: Profile;
  score: number;
  factors: FactorBreakdown;
  positiveReasons: ReasonCode[];
  nuance: ReasonCode | null;
  label: "Top fit this week" | "Strong alignment" | "Worth a closer look";
};

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const near = (a: number, b: number) => clamp(1 - Math.abs(a - b));

const INTENT_MATRIX: Record<string, Record<string, number>> = {
  long_term: { long_term: 1, open_to_serious: 0.75, new_friends_first: 0.4, unsure: 0.3 },
  open_to_serious: { long_term: 0.75, open_to_serious: 1, new_friends_first: 0.55, unsure: 0.45 },
  new_friends_first: { long_term: 0.4, open_to_serious: 0.55, new_friends_first: 1, unsure: 0.6 },
  unsure: { long_term: 0.3, open_to_serious: 0.45, new_friends_first: 0.6, unsure: 0.7 },
};

function goalsScore(a: Profile, b: Profile) {
  const intent = INTENT_MATRIX[a.intent]?.[b.intent] ?? 0.4;
  return clamp(0.75 * intent + 0.25 * near(a.pace, b.pace));
}

function overlapScore(a: string[], b: string[], cap = 0.55) {
  const setB = new Set(b);
  const shared = a.filter((x) => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  if (union === 0) return 0;
  return clamp(Math.min(shared / union / cap, 1));
}

function communicationScore(a: Profile, b: Profile) {
  const freq = near(a.communication.frequency, b.communication.frequency);
  const depth = near(a.communication.depth, b.communication.depth);
  const channel = a.communication.channel === b.communication.channel ? 1 : 0.6;
  return clamp(0.4 * freq + 0.4 * depth + 0.2 * channel);
}

function lifestyleScore(a: Profile, b: Profile) {
  const setB = new Set(b.availability);
  const shared = a.availability.filter((x) => setB.has(x)).length;
  const slots = Math.max(a.availability.length, 1);
  return clamp(0.7 * (shared / slots) + 0.3 * near(a.socialEnergy, b.socialEnergy));
}

function personalityScore(a: Profile, b: Profile) {
  // Interaction-style proximity only. Never a diagnosis, never shown as raw traits.
  return clamp(
    0.4 * near(a.planning, b.planning) +
      0.3 * near(a.socialEnergy, b.socialEnergy) +
      0.3 * near(a.novelty, b.novelty),
  );
}

export function signalValue(mine: SignalState, theirs: SignalState): number {
  if (mine === "curious" && theirs === "curious") return 1;
  if (mine === "curious" || theirs === "curious") return 0.75;
  if (mine === "pass" && theirs === "pass") return 0;
  if (mine === "pass" || theirs === "pass") return 0.25;
  return 0.5;
}

export const WEIGHTS = {
  goals: 0.25,
  values: 0.2,
  communication: 0.15,
  interests: 0.15,
  lifestyle: 0.1,
  personality: 0.1,
  signal: 0.05,
} as const;

export const RECOMMENDATION_THRESHOLD = 72;

export function scorePair(a: Profile, b: Profile, signal: number): ScoredCandidate {
  const factors: FactorBreakdown = {
    goals: goalsScore(a, b),
    values: overlapScore(a.values, b.values, 0.6),
    communication: communicationScore(a, b),
    interests: overlapScore(a.interests, b.interests, 0.55),
    lifestyle: lifestyleScore(a, b),
    personality: personalityScore(a, b),
    signal,
  };

  const score = Math.round(
    100 *
      (WEIGHTS.goals * factors.goals +
        WEIGHTS.values * factors.values +
        WEIGHTS.communication * factors.communication +
        WEIGHTS.interests * factors.interests +
        WEIGHTS.lifestyle * factors.lifestyle +
        WEIGHTS.personality * factors.personality +
        WEIGHTS.signal * factors.signal),
  );

  const positiveReasons: ReasonCode[] = [];
  if (a.intent === "long_term" && b.intent === "long_term") {
    positiveReasons.push("aligned_long_term_intent");
  } else if (factors.goals >= 0.7) {
    positiveReasons.push("compatible_intent");
  }
  if (Math.abs(a.pace - b.pace) <= 0.15) positiveReasons.push("shared_pace");
  if (factors.values >= 0.6) positiveReasons.push("shared_values");
  if (factors.interests >= 0.5) positiveReasons.push("shared_interests");
  if (near(a.communication.frequency, b.communication.frequency) >= 0.85) {
    positiveReasons.push("compatible_reply_pace");
  }
  if (a.communication.depth >= 0.7 && b.communication.depth >= 0.7) {
    positiveReasons.push("thoughtful_message_style");
  }
  if (factors.lifestyle >= 0.6) positiveReasons.push("schedule_overlap");

  let nuance: ReasonCode | null = null;
  if (Math.abs(a.planning - b.planning) >= 0.3) nuance = "planning_style_difference";
  else if (Math.abs(a.socialEnergy - b.socialEnergy) >= 0.3) nuance = "social_energy_difference";
  else if (Math.abs(a.communication.frequency - b.communication.frequency) >= 0.3)
    nuance = "different_reply_rhythm";
  else if (factors.goals < 0.6) nuance = "different_intent_timeline";

  const label =
    score >= 85 ? "Top fit this week" : score >= 76 ? "Strong alignment" : "Worth a closer look";

  return { profile: b, score, factors, positiveReasons: positiveReasons.slice(0, 4), nuance, label };
}

/** Deterministic, approved sentences. AI may polish these later; it never invents the score. */
export function reasonSentence(code: ReasonCode, a: string, b: string): string {
  switch (code) {
    case "aligned_long_term_intent":
      return `You both say you want a long-term relationship and are comfortable moving slowly.`;
    case "compatible_intent":
      return `Your stated intentions line up closely enough to be worth a conversation.`;
    case "shared_pace":
      return `Neither of you wants to rush the first few weeks.`;
    case "shared_values":
      return `You picked several of the same values as the ones that matter most.`;
    case "shared_interests":
      return `You have real overlap in how you spend your free time.`;
    case "compatible_reply_pace":
      return `You expect a similar amount of messaging, so neither of you should feel ignored or crowded.`;
    case "thoughtful_message_style":
      return `You both prefer thoughtful messages over constant texting.`;
    case "schedule_overlap":
      return `Your free time overlaps, so meeting up would not be a scheduling project.`;
    case "planning_style_difference":
      return `${a} plans ahead more; ${b} is more spontaneous. Treat this as a conversation point, not a prediction.`;
    case "social_energy_difference":
      return `${b} recharges around people more than ${a} does. Worth naming early.`;
    case "different_reply_rhythm":
      return `${b} messages more often than ${a} tends to. Agreeing on a rhythm helps.`;
    case "different_intent_timeline":
      return `You describe slightly different timelines. Not a dealbreaker, but say it out loud.`;
  }
}

export const REASON_CHIP: Record<ReasonCode, { label: string; category: string }> = {
  aligned_long_term_intent: { label: "Aligned long-term intent", category: "Intent" },
  compatible_intent: { label: "Compatible intent", category: "Intent" },
  shared_pace: { label: "Similar pace", category: "Intent" },
  shared_values: { label: "Shared values", category: "Values" },
  shared_interests: { label: "Shared interests", category: "Interests" },
  compatible_reply_pace: { label: "Compatible reply pace", category: "Communication" },
  thoughtful_message_style: { label: "Thoughtful messages", category: "Communication" },
  schedule_overlap: { label: "Schedules overlap", category: "Timing" },
  planning_style_difference: { label: "Planning styles differ", category: "Nuance" },
  social_energy_difference: { label: "Different social energy", category: "Nuance" },
  different_reply_rhythm: { label: "Different reply rhythm", category: "Nuance" },
  different_intent_timeline: { label: "Different timelines", category: "Nuance" },
};
