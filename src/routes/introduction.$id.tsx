import React, { useMemo, useState } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Check, ShieldCheck, X } from 'lucide-react';
import { CURRENT_USER, MOCK_PROFILES } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { useStage } from '../components/stage/useStage';
import { SafetySheet } from '../components/stage/SafetySheet';
import {
  decideIntroduction,
  findIntroduction,
  reachStep,
  sendMessage,
  simulateTheirDecision,
} from '../lib/twoStage';

export const Route = createFileRoute('/introduction/$id')({
  head: () => ({
    meta: [
      { title: 'Why you two — Matchwise introduction' },
      {
        name: 'description',
        content: 'The reasons behind an introduction: shared foundation, rhythm, overlap and one honest nuance.',
      },
      { property: 'og:title', content: 'Why you two — Matchwise introduction' },
      { property: 'og:description', content: 'Transparent reasons before you decide.' },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: IntroDetail,
});

function IntroDetail() {
  const { id } = useParams({ from: '/introduction/$id' });
  const stage = useStage();
  const navigate = useNavigate();
  const [safety, setSafety] = useState(false);

  const intro = useMemo(
    () => findIntroduction(CURRENT_USER, MOCK_PROFILES, stage, id),
    [stage, id],
  );

  React.useEffect(() => {
    reachStep(4);
  }, []);

  if (!intro) {
    return (
      <StageShell showNav={false} title="Introduction not available">
        <button onClick={() => void navigate({ to: '/introductions' })} className="text-sm underline">
          Back to introductions
        </button>
      </StageShell>
    );
  }

  const { candidate, status } = intro;
  const firstName = candidate.name.split(' ').slice(-1)[0];

  const accept = () => {
    decideIntroduction(candidate.id, 'accepted');
    reachStep(5);
    window.setTimeout(() => {
      simulateTheirDecision(candidate.id, 'accepted');
      sendMessage(
        candidate.id,
        `Glad we both said yes — your take on ${candidate.needsOffers.domains[0] ?? 'your work'} caught my eye.`,
        'them',
      );
      reachStep(6);
    }, 1400);
  };

  const decline = () => {
    decideIntroduction(candidate.id, 'declined');
    void navigate({ to: '/introductions' });
  };

  return (
    <StageShell showNav={false}>
      <button
        onClick={() => void navigate({ to: '/introductions' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500"
      >
        <ArrowLeft size={15} /> Introductions
      </button>

      <div className="overflow-hidden rounded-3xl border border-stone-900/10 bg-white">
        <div className="flex gap-4 p-6">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="h-24 w-24 rounded-2xl object-cover"
          />
          <div>
            <span className="rounded-full bg-[#F4F7F4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4b7a48]">
              {intro.band}
            </span>
            <h1 className="mt-2 font-[Playfair_Display] text-3xl leading-none tracking-tight">
              {candidate.name}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-400">
              {candidate.title} · {candidate.location}
            </p>
          </div>
        </div>

        <div className="border-t border-stone-900/5 px-6 py-5">
          <h2 className="font-[Playfair_Display] text-xl">Why you two</h2>
          <div className="mt-4 space-y-4">
            {intro.sections.map((s) => (
              <div key={s.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {s.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-700">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-[#FFF8E9] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6a1f]">
              One thing to be aware of
            </p>
            <p className="mt-1 text-sm text-stone-700">{intro.nuance}</p>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
              If you both say yes
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-stone-600">
              {intro.starters.map((s) => (
                <li key={s} className="rounded-xl bg-[#FAFBFD] px-4 py-2.5">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSafety(true)}
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-stone-500 underline underline-offset-4"
          >
            <ShieldCheck size={14} /> Safety &amp; control
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3 pb-4">
        {status === 'matched' ? (
          <button
            onClick={() => {
              reachStep(6);
              void navigate({ to: '/chat/$matchId', params: { matchId: candidate.id } });
            }}
            className="w-full rounded-xl bg-[#17211D] px-4 py-4 text-sm font-semibold text-white"
          >
            You both said yes — open the conversation
          </button>
        ) : status === 'accepted' ? (
          <div className="rounded-xl bg-white px-4 py-4 text-center text-sm text-stone-500 ring-1 ring-stone-900/10">
            You accepted. {firstName} decides privately — nothing opens until they do.
          </div>
        ) : status === 'closed' ? (
          <div className="rounded-xl bg-white px-4 py-4 text-center text-sm text-stone-500 ring-1 ring-stone-900/10">
            This introduction is closed.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={decline}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-900/15 bg-white px-4 py-4 text-sm font-semibold text-stone-600"
            >
              <X size={15} /> Not this one
            </button>
            <button
              onClick={accept}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2684A] px-4 py-4 text-sm font-semibold text-white"
            >
              <Check size={15} /> Accept introduction
            </button>
          </div>
        )}
      </div>

      <SafetySheet
        candidateId={candidate.id}
        candidateName={candidate.name}
        open={safety}
        onClose={() => setSafety(false)}
        onLeft={() => reachStep(7)}
      />
    </StageShell>
  );
}
