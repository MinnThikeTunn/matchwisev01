import React, { useMemo } from 'react';
import { Handshake, ChevronRight, Check, Clock, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';
import { useStage } from './stage/useStage';
import { buildIntroductions, reachStep } from '../lib/twoStage';

interface Props {
  currentUser: UserProfile;
  candidatePool: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
  onOpenChats: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Awaiting your decision',
  accepted: 'You accepted — waiting on them',
  matched: 'Two yeses — conversation open',
  closed: 'Closed',
};

export function IntroductionsView({
  currentUser,
  candidatePool,
  onSelectCandidate,
  onOpenChats,
}: Props) {
  const stage = useStage();
  const intros = useMemo(
    () => buildIntroductions(currentUser, candidatePool, stage, 3),
    [currentUser, candidatePool, stage],
  );

  React.useEffect(() => {
    if (stage.demoMode) reachStep(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signalCount = Object.keys(stage.signals).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
          <Handshake className="w-3.5 h-3.5" />
          Stage 2 · Introductions
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          A short list, decided by both people
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-stone-600">
          Built from mutual eligibility, your profile and your {signalCount} private discovery
          signal{signalCount === 1 ? '' : 's'}. No percentages — honest bands and readable reasons.
        </p>
      </header>

      {intros.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-sm text-stone-500">
          No introductions yet. Send a few discovery signals first.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {intros.map((intro) => (
            <article
              key={intro.candidate.id}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={intro.candidate.avatar}
                  alt={intro.candidate.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-stone-900">
                    {intro.candidate.name}
                  </h2>
                  <p className="truncate text-xs text-stone-500">{intro.candidate.title}</p>
                </div>
              </div>

              <span className="mt-4 self-start rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
                {intro.band}
              </span>

              <ul className="mt-4 space-y-1.5 text-sm text-stone-700">
                {intro.chips.slice(0, 3).map((chip) => (
                  <li key={chip.label} className="flex gap-2">
                    <span className="text-[#D97706]">•</span>
                    <span>
                      <strong className="font-semibold text-stone-900">{chip.label}:</strong>{' '}
                      {chip.detail}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
                {intro.status === 'matched' ? (
                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                {STATUS_LABEL[intro.status]}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => onSelectCandidate(intro.candidate)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Why you two <ChevronRight className="w-4 h-4" />
                </button>
                {intro.status === 'matched' && (
                  <button
                    onClick={onOpenChats}
                    aria-label={`Open conversation with ${intro.candidate.name}`}
                    className="rounded-full border border-stone-300 px-3 text-stone-600 hover:bg-stone-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
