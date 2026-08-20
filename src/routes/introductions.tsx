import React, { useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Info } from 'lucide-react';
import { CURRENT_USER, MOCK_PROFILES } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { useStage } from '../components/stage/useStage';
import { buildIntroductions } from '../lib/twoStage';

export const Route = createFileRoute('/introductions')({
  head: () => ({
    meta: [
      { title: 'Introductions — your shortlist | Matchwise' },
      {
        name: 'description',
        content: 'A small shortlist of introductions with readable reasons. Both people must accept.',
      },
      { property: 'og:title', content: 'Introductions — your shortlist | Matchwise' },
      { property: 'og:description', content: 'Few, explainable, and decided by both people.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Introductions,
});

const STATUS_COPY: Record<string, string> = {
  pending: 'Awaiting your decision',
  accepted: 'You accepted — waiting on them',
  matched: 'Both accepted — conversation open',
  closed: 'Closed',
};

function Introductions() {
  const stage = useStage();
  const intros = useMemo(
    () => buildIntroductions(CURRENT_USER, MOCK_PROFILES, stage, 3),
    [stage],
  );

  return (
    <StageShell
      title="Introductions"
      helper="A few carefully chosen people. A conversation opens only when you both accept."
    >
      <div className="mb-5 flex items-start gap-2 rounded-2xl bg-white p-4 text-xs leading-relaxed text-stone-500 ring-1 ring-stone-900/5">
        <Info size={14} className="mt-0.5 shrink-0 text-[#0D7A94]" />
        We show honest bands, not precise percentages. Compatibility is a starting point, not a
        prediction.
      </div>

      <div className="space-y-4">
        {intros.map((intro) => (
          <Link
            key={intro.candidate.id}
            to="/introduction/$id"
            params={{ id: intro.candidate.id }}
            className="block overflow-hidden rounded-3xl border border-stone-900/10 bg-white transition hover:border-stone-900/25"
          >
            <div className="flex gap-4 p-5">
              <img
                src={intro.candidate.avatar}
                alt={intro.candidate.name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F4F7F4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4b7a48]">
                    {intro.band}
                  </span>
                </div>
                <h2 className="mt-2 font-[Playfair_Display] text-2xl leading-none tracking-tight">
                  {intro.candidate.name}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-400">
                  {intro.candidate.title} · {intro.candidate.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {intro.chips
                    .filter((c) => c.strong)
                    .slice(0, 3)
                    .map((c) => (
                      <span
                        key={c.label}
                        className="rounded-full bg-[#FAFBFD] px-2.5 py-1 text-[11px] text-stone-600 ring-1 ring-stone-900/10"
                      >
                        {c.label}: {c.detail}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-stone-900/5 px-5 py-3 text-xs">
              <span className="text-stone-500">{STATUS_COPY[intro.status]}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#F2684A]">
                Why you two <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {intros.length === 0 && (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-stone-500">
          No introductions yet. Signal interest in Discover and check back.
        </p>
      )}
    </StageShell>
  );
}
