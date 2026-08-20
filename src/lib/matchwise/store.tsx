import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { candidates, demoUser, profilesById } from "./data";
import {
  RECOMMENDATION_THRESHOLD,
  scorePair,
  signalValue,
  type ScoredCandidate,
  type SignalState,
} from "./scoring";

export type DemoStep =
  | "landing"
  | "profile"
  | "discover"
  | "introductions"
  | "decision"
  | "chat"
  | "complete";

export const DEMO_STEPS: { key: DemoStep; label: string }[] = [
  { key: "profile", label: "Demo profile" },
  { key: "discover", label: "Signal" },
  { key: "introductions", label: "Shortlist" },
  { key: "decision", label: "Decide" },
  { key: "chat", label: "Chat" },
  { key: "complete", label: "Recap" },
];

export type Decision = "accept" | "reject";

export type Message = { id: string; from: "me" | "them"; body: string; at: number };

export type Report = { profileId: string; reason: string; details: string; at: number };

type State = {
  demoMode: boolean;
  step: DemoStep;
  signals: Record<string, SignalState>;
  hidden: string[];
  myDecisions: Record<string, Decision>;
  theirDecisions: Record<string, Decision>;
  messages: Record<string, Message[]>;
  blocked: string[];
  reports: Report[];
};

const initialState: State = {
  demoMode: false,
  step: "landing",
  signals: {},
  hidden: [],
  myDecisions: {},
  theirDecisions: {},
  messages: {},
  blocked: [],
  reports: [],
};

const STORAGE_KEY = "matchwise.demo.v1";

type Store = State & {
  hydrated: boolean;
  startDemo: () => void;
  restartDemo: () => void;
  setStep: (step: DemoStep) => void;
  sendSignal: (profileId: string, direction: Exclude<SignalState, null>) => void;
  undoSignal: (profileId: string) => void;
  hideProfile: (profileId: string) => void;
  decide: (profileId: string, decision: Decision) => void;
  receiveTheirDecision: (profileId: string, decision: Decision) => void;
  sendMessage: (profileId: string, body: string) => void;
  blockProfile: (profileId: string) => void;
  reportProfile: (profileId: string, reason: string, details: string) => void;
  leaveConversation: (profileId: string) => void;
  discoverQueue: typeof candidates;
  recommendations: ScoredCandidate[];
  matches: ScoredCandidate[];
  scoreFor: (profileId: string) => ScoredCandidate | undefined;
};

const StoreContext = createContext<Store | null>(null);

export function MatchwiseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt demo state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable; the demo still works in memory */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const store = useMemo<Store>(() => {
    const scored = candidates
      .filter((c) => !state.blocked.includes(c.id) && !state.hidden.includes(c.id))
      .map((c) =>
        scorePair(demoUser, c, signalValue(state.signals[c.id] ?? null, c.id === "min" ? "curious" : null)),
      )
      .sort((x, y) => y.score - x.score);

    const eligible = scored.filter((s) => s.score >= RECOMMENDATION_THRESHOLD).slice(0, 3);
    const matches = eligible.filter(
      (s) => state.myDecisions[s.profile.id] === "accept" && state.theirDecisions[s.profile.id] === "accept",
    );

    return {
      ...state,
      hydrated,
      startDemo: () => patch((s) => ({ ...s, demoMode: true, step: "profile" })),
      restartDemo: () => setState({ ...initialState, demoMode: true, step: "profile" }),
      setStep: (step) => patch((s) => ({ ...s, step })),
      sendSignal: (profileId, direction) =>
        patch((s) => ({ ...s, signals: { ...s.signals, [profileId]: direction } })),
      undoSignal: (profileId) =>
        patch((s) => {
          const signals = { ...s.signals };
          delete signals[profileId];
          return { ...s, signals };
        }),
      hideProfile: (profileId) =>
        patch((s) => ({ ...s, hidden: [...new Set([...s.hidden, profileId])] })),
      decide: (profileId, decision) =>
        patch((s) => ({ ...s, myDecisions: { ...s.myDecisions, [profileId]: decision } })),
      receiveTheirDecision: (profileId, decision) =>
        patch((s) => ({ ...s, theirDecisions: { ...s.theirDecisions, [profileId]: decision } })),
      sendMessage: (profileId, body) =>
        patch((s) => ({
          ...s,
          messages: {
            ...s.messages,
            [profileId]: [
              ...(s.messages[profileId] ?? []),
              { id: `${Date.now()}`, from: "me", body, at: Date.now() },
            ],
          },
        })),
      blockProfile: (profileId) =>
        patch((s) => ({
          ...s,
          blocked: [...new Set([...s.blocked, profileId])],
        })),
      reportProfile: (profileId, reason, details) =>
        patch((s) => ({
          ...s,
          reports: [...s.reports, { profileId, reason, details, at: Date.now() }],
        })),
      leaveConversation: (profileId) =>
        patch((s) => ({
          ...s,
          myDecisions: { ...s.myDecisions, [profileId]: "reject" },
        })),
      discoverQueue: candidates.filter(
        (c) => !state.blocked.includes(c.id) && !state.hidden.includes(c.id) && !state.signals[c.id],
      ),
      recommendations: eligible,
      matches,
      scoreFor: (profileId) =>
        scored.find((s) => s.profile.id === profileId) ??
        (profilesById[profileId]
          ? scorePair(demoUser, profilesById[profileId], signalValue(state.signals[profileId] ?? null, null))
          : undefined),
    };
  }, [state, hydrated, patch]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useMatchwise() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMatchwise must be used inside MatchwiseProvider");
  return ctx;
}
