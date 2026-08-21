/**
 * Preferences & personality answers.
 *
 * Everything here is demo data held on the device. Answers feed the readable
 * "what this changed" summary and the stats strip — nothing is sent anywhere.
 */
import { useSyncExternalStore } from 'react';

export type QuestionKind = 'scale' | 'single' | 'multi';

export interface Question {
  id: string;
  prompt: string;
  kind: QuestionKind;
  options?: string[];
  /** Labels for the two ends of a scale question. */
  ends?: [string, string];
}

export interface QuestionSet {
  id: string;
  title: string;
  why: string;
  questions: Question[];
}

const scale = (id: string, prompt: string, ends: [string, string]): Question => ({
  id,
  prompt,
  kind: 'scale',
  ends,
});

export const QUESTION_SETS: QuestionSet[] = [
  {
    id: 'personality',
    title: 'Personality',
    why: 'Shapes who feels easy to be around, not who looks good on paper.',
    questions: [
      scale('p1', 'I come away from a busy social night energised.', ['Rarely', 'Almost always']),
      scale('p2', 'I plan ahead rather than improvise.', ['Improvise', 'Plan']),
      scale('p3', 'When we disagree, I want to talk it out immediately.', ['Need space', 'Talk now']),
      scale('p4', 'I go looking for new places, food and ideas.', ['Stick to favourites', 'Always new']),
      scale('p5', 'I stay steady when things get stressful.', ['I wobble', 'Very steady']),
      scale('p6', 'I show affection openly and often.', ['Reserved', 'Very open']),
      scale('p7', 'I need a lot of alone time to feel like myself.', ['Very little', 'A lot']),
      scale('p8', 'I make decisions quickly and stick with them.', ['Slowly', 'Quickly']),
    ],
  },
  {
    id: 'intent',
    title: 'Relationship intent',
    why: 'The single biggest reason introductions go wrong is mismatched intent.',
    questions: [
      {
        id: 'i1',
        prompt: 'What are you looking for right now?',
        kind: 'single',
        options: ['Something serious', 'Open to serious', 'Dating casually', 'Making friends first'],
      },
      {
        id: 'i2',
        prompt: 'Timeline you have in mind',
        kind: 'single',
        options: ['No rush at all', 'Within a year', 'Ready now'],
      },
      {
        id: 'i3',
        prompt: 'Exclusivity',
        kind: 'single',
        options: ['Exclusive early', 'Exclusive when it feels right', 'Non-exclusive'],
      },
      {
        id: 'i4',
        prompt: 'How far would you travel to meet someone?',
        kind: 'single',
        options: ['Same neighbourhood', 'Up to 25 km', 'Same country', 'Distance is fine'],
      },
      {
        id: 'i5',
        prompt: 'Your gender',
        kind: 'single',
        options: ['Woman', 'Man', 'Non-binary'],
      },
      {
        id: 'i6',
        prompt: 'Who would you like to be introduced to?',
        kind: 'multi',
        options: ['Women', 'Men', 'Non-binary people'],
      },
    ],
  },
  {
    id: 'values',
    title: 'Values',
    why: 'Introductions weight values highest — it is what people argue about later.',
    questions: [
      scale('v1', 'Family closeness matters to me.', ['Not much', 'Enormously']),
      scale('v2', 'Faith or spirituality is part of my life.', ['Not at all', 'Central']),
      scale('v3', 'Ambition and career drive matter in a partner.', ['Not really', 'A lot']),
      scale('v4', 'I can be close to someone who votes differently.', ['No', 'Yes']),
      scale('v5', 'I prefer blunt honesty over softened truth.', ['Soften it', 'Say it straight']),
      scale('v6', 'I am careful and planned about money.', ['Spontaneous', 'Very careful']),
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    why: 'Day-to-day rhythm decides whether you actually see each other.',
    questions: [
      { id: 'l1', prompt: 'Sleep rhythm', kind: 'single', options: ['Early bird', 'In between', 'Night owl'] },
      { id: 'l2', prompt: 'Social battery', kind: 'single', options: ['Small circle', 'Balanced', 'Always out'] },
      { id: 'l3', prompt: 'Drinking', kind: 'single', options: ['Never', 'Socially', 'Regularly'] },
      { id: 'l4', prompt: 'Smoking', kind: 'single', options: ['Never', 'Socially', 'Regularly'] },
      { id: 'l5', prompt: 'Exercise', kind: 'single', options: ['Rarely', 'A few times a week', 'Daily'] },
      { id: 'l6', prompt: 'Pets', kind: 'single', options: ['Have pets', 'Love them', 'Prefer not'] },
      { id: 'l7', prompt: 'Kids', kind: 'single', options: ['Have kids', 'Want kids', 'Unsure', "Don't want kids"] },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    why: 'Mismatched reply speed kills more early conversations than anything else.',
    questions: [
      { id: 'c1', prompt: 'How fast do you usually reply?', kind: 'single', options: ['Within minutes', 'Same day', 'When I get to it'] },
      { id: 'c2', prompt: 'Preferred channel', kind: 'single', options: ['Texting', 'Voice notes', 'Calls', 'In person'] },
      { id: 'c3', prompt: 'When something bothers you, you...', kind: 'single', options: ['Say it right away', 'Wait until calm', 'Let small things go'] },
      { id: 'c4', prompt: 'How soon do you like to meet in person?', kind: 'single', options: ['Within days', 'After a week or two', 'Once it feels right'] },
    ],
  },
  {
    id: 'interests',
    title: 'Interests',
    why: 'Gives the first conversation somewhere obvious to go.',
    questions: [
      {
        id: 'n1',
        prompt: 'Pick everything you genuinely spend time on',
        kind: 'multi',
        options: [
          'Food & cooking', 'Travel', 'Music', 'Film', 'Gaming', 'Outdoors',
          'Reading', 'Sport', 'Art', 'Dancing', 'Photography', 'Volunteering',
        ],
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTION_SETS.reduce((n, s) => n + s.questions.length, 0);

export type AnswerValue = number | string | string[];
export type Answers = Record<string, AnswerValue>;

const STORAGE_KEY = 'matchwise_preferences_v1';

let answers: Answers = {};
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) answers = JSON.parse(raw) as Answers;
  } catch {
    /* ignore */
  }
}

function commit(next: Answers) {
  answers = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

const emptyAnswers: Answers = {};

export const preferencesStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): Answers {
    hydrate();
    return answers;
  },
  getServerSnapshot(): Answers {
    return emptyAnswers;
  },
};

export function useAnswers(): Answers {
  return useSyncExternalStore(
    preferencesStore.subscribe,
    preferencesStore.getSnapshot,
    preferencesStore.getServerSnapshot,
  );
}

export function setAnswer(id: string, value: AnswerValue) {
  commit({ ...answers, [id]: value });
}

export function toggleMultiAnswer(id: string, option: string) {
  const current = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
  const next = current.includes(option)
    ? current.filter((o) => o !== option)
    : [...current, option];
  commit({ ...answers, [id]: next });
}

export function resetAnswers() {
  commit({});
}

export function resetSet(setId: string) {
  const set = QUESTION_SETS.find((s) => s.id === setId);
  if (!set) return;
  const next = { ...answers };
  for (const q of set.questions) delete next[q.id];
  commit(next);
}

export function answeredCount(a: Answers, set?: QuestionSet): number {
  const questions = set ? set.questions : QUESTION_SETS.flatMap((s) => s.questions);
  return questions.filter((q) => {
    const v = a[q.id];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== '';
  }).length;
}

export interface PreferenceStats {
  answered: number;
  total: number;
  completeness: number;
  confidence: number;
  factorsShaped: number;
}

export function preferenceStats(a: Answers): PreferenceStats {
  const answered = answeredCount(a);
  const completeness = Math.round((answered / TOTAL_QUESTIONS) * 100);
  // Confidence starts low and climbs as more of the profile is filled in.
  const confidence = Math.min(96, 38 + Math.round((answered / TOTAL_QUESTIONS) * 58));
  const factorsShaped = QUESTION_SETS.filter((s) => answeredCount(a, s) > 0).length + 1;
  return { answered, total: TOTAL_QUESTIONS, completeness, confidence, factorsShaped };
}

/** Plain-language traits derived from the personality scales. */
export function topTraits(a: Answers): string[] {
  const val = (id: string) => (typeof a[id] === 'number' ? (a[id] as number) : null);
  const traits: { label: string; strength: number }[] = [];
  const push = (id: string, high: string, low: string) => {
    const v = val(id);
    if (v === null) return;
    traits.push({ label: v >= 3 ? high : low, strength: Math.abs(v - 3) });
  };
  push('p1', 'Energised by people', 'Recharges alone');
  push('p2', 'Plans ahead', 'Happily spontaneous');
  push('p3', 'Talks things out fast', 'Needs space before talking');
  push('p4', 'Chases the new', 'Loyal to favourites');
  push('p5', 'Steady under pressure', 'Feels things strongly');
  push('p6', 'Openly affectionate', 'Quietly affectionate');
  push('p7', 'Values solitude', 'Likes company most days');
  push('p8', 'Decides quickly', 'Decides carefully');
  return traits.sort((x, y) => y.strength - x.strength).slice(0, 3).map((t) => t.label);
}

/** The two things the person weights most in a partner, from the values set. */
export function topWeights(a: Answers): string[] {
  const labels: Record<string, string> = {
    v1: 'Family closeness',
    v2: 'Shared faith or spirituality',
    v3: 'Ambition',
    v4: 'Political openness',
    v5: 'Blunt honesty',
    v6: 'Financial care',
  };
  return Object.entries(labels)
    .map(([id, label]) => ({ label, v: typeof a[id] === 'number' ? (a[id] as number) : 0 }))
    .filter((x) => x.v > 0)
    .sort((x, y) => y.v - x.v)
    .slice(0, 2)
    .map((x) => x.label);
}

// ---------------------------------------------------------------------------
// Gender & orientation — used as a hard filter for romantic introductions.
// ---------------------------------------------------------------------------

export type Gender = 'woman' | 'man' | 'nonbinary';

const GENDER_FROM_ANSWER: Record<string, Gender> = {
  Woman: 'woman',
  Man: 'man',
  'Non-binary': 'nonbinary',
};

const INTEREST_FROM_ANSWER: Record<string, Gender> = {
  Women: 'woman',
  Men: 'man',
  'Non-binary people': 'nonbinary',
};

export const GENDER_LABEL: Record<Gender, string> = {
  woman: 'Woman',
  man: 'Man',
  nonbinary: 'Non-binary',
};

export interface DatingIdentity {
  gender?: Gender;
  interestedIn: Gender[];
}

/** The viewer's own gender and who they want to meet, from the intent set. */
export function datingIdentity(a: Answers): DatingIdentity {
  const g = typeof a['i5'] === 'string' ? GENDER_FROM_ANSWER[a['i5'] as string] : undefined;
  const raw = Array.isArray(a['i6']) ? (a['i6'] as string[]) : [];
  const interestedIn = raw
    .map((o) => INTEREST_FROM_ANSWER[o])
    .filter((x): x is Gender => Boolean(x));
  return { gender: g, interestedIn };
}

// ---------------------------------------------------------------------------
// Guided demo — a prefilled persona so the demo has real answers behind it.
// ---------------------------------------------------------------------------

/** Alex Mercer: a man who wants to be introduced to women. Demo data only. */
export const DEMO_ANSWERS: Answers = {
  p1: 4, p2: 4, p3: 3, p4: 5, p5: 4, p6: 4, p7: 2, p8: 4,
  i1: 'Something serious',
  i2: 'Within a year',
  i3: 'Exclusive when it feels right',
  i4: 'Up to 25 km',
  i5: 'Man',
  i6: ['Women'],
  v1: 4, v2: 2, v3: 4, v4: 4, v5: 5, v6: 4,
  l1: 'Early bird',
  l2: 'Balanced',
  l3: 'Socially',
  l4: 'Never',
  l5: 'A few times a week',
  l6: 'Love them',
  l7: 'Want kids',
  c1: 'Same day',
  c2: 'In person',
  c3: 'Say it right away',
  c4: 'After a week or two',
  n1: ['Food & cooking', 'Travel', 'Music', 'Outdoors', 'Reading'],
};

/** Loads the demo persona's answers, overwriting whatever is on the device. */
export function applyDemoAnswers() {
  commit({ ...DEMO_ANSWERS });
}
