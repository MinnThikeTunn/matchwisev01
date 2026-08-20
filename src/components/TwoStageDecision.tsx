import React, { useMemo, useState } from 'react';
import { Check, X, MessageSquare, ShieldCheck, Handshake } from 'lucide-react';
import { UserProfile } from '../types';
import { useStage } from './stage/useStage';
import {
  decideIntroduction,
  findIntroduction,
  reachStep,
  simulateTheirDecision,
} from '../lib/twoStage';
import { SafetySheet } from './stage/SafetySheet';

interface Props {
  currentUser: UserProfile;
  candidate: UserProfile;
  candidatePool: UserProfile[];
  onOpenChat?: (candidateId: string) => void;
}

const CHIP_COLOR: Record<string, string> = {
  Intent: '#D97706',
  Values: '#0A6275',
  Communication: '#059669',
  Timing: '#7C3AED',
};

export function TwoStageDecision({ currentUser, candidate, candidatePool, onOpenChat }: Props) {
  const stage = useStage();
  const [safety, setSafety] = useState(false);

  const intro = useMemo(
    () => findIntroduction(currentUser, candidatePool, stage, candidate.id),
    [currentUser, candidatePool, stage, candidate.id],
  );

  React.useEffect(() => {
    if (stage.demoMode) reachStep(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!intro) return null;

  const mine = stage.decisions[candidate.id];
  const theirs = stage.theirDecisions[candidate.id];
  const matched = mine === 'accepted' && theirs === 'accepted';

  return (
    <section className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-7 mb-6 sm:mb-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
            <Handshake className="w-3.5 h-3.5" />
            Stage 2 · Deliberate decision
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Why you two
          </h2>
        </div>
        <span className="rounded-full bg-amber-50 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-900">
          {intro.band}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {intro.chips.map((chip) => (
          <span
            key={chip.label}
            className="rounded-full border px-3 py-1 text-xs font-semibold"
            style={{
              color: CHIP_COLOR[chip.label],
              borderColor: `${CHIP_COLOR[chip.label]}40`,
              backgroundColor: `${CHIP_COLOR[chip.label]}12`,
            }}
            title={chip.detail}
          >
            {chip.label}
            {chip.strong ? ' · strong' : ''}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {intro.sections.map((s) => (
          <div key={s.title} className="rounded-xl bg-stone-50 p-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
              {s.title}
            </p>
            <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-stone-500">{intro.nuance}</p>

      <div className="mt-6 border-t border-stone-100 pt-5">
        {matched ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-stone-900">
              Two yeses — the conversation is open.
            </p>
            <button
              onClick={() => onOpenChat?.(candidate.id)}
              className="inline-flex items-center gap-2 rounded-full bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              <MessageSquare className="w-4 h-4" /> Open conversation
            </button>
          </div>
        ) : mine === 'accepted' ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-600">
              You accepted. Nothing is shared until {candidate.name.split(' ')[0]} accepts too.
            </p>
            <button
              onClick={() => {
                simulateTheirDecision(candidate.id, 'accepted');
                reachStep(5);
              }}
              className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Simulate their yes (demo)
            </button>
          </div>
        ) : mine === 'declined' ? (
          <p className="text-sm text-stone-500">
            You passed on this introduction. They are never told.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                decideIntroduction(candidate.id, 'accepted');
                reachStep(5);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A6275] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              <Check className="w-4 h-4" /> Accept introduction
            </button>
            <button
              onClick={() => decideIntroduction(candidate.id, 'declined')}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <X className="w-4 h-4" /> Not this time
            </button>
            <span className="text-xs text-stone-400">
              Both people must accept before anyone can message.
            </span>
          </div>
        )}

        <button
          onClick={() => setSafety(true)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#0A6275]" /> Safety &amp; control
        </button>
      </div>

      <SafetySheet
        candidateId={candidate.id}
        candidateName={candidate.name}
        open={safety}
        onClose={() => setSafety(false)}
        onLeft={() => reachStep(7)}
      />
    </section>
  );
}
