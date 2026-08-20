import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';
import { StageShell } from '../components/stage/StageShell';
import { restartDemo } from '../lib/twoStage';

export const Route = createFileRoute('/demo-complete')({
  head: () => ({
    meta: [
      { title: 'Demo recap — Matchwise' },
      {
        name: 'description',
        content: 'What the Matchwise guided demo showed: private signals, explainable introductions, two yeses, and safety controls.',
      },
      { property: 'og:title', content: 'Demo recap — Matchwise' },
      { property: 'og:description', content: 'Interest starts it. Intention confirms it.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: DemoComplete,
});

const RECAP = [
  ['A swipe is a signal, not a match', 'Stage 1 stays private and low-stakes.'],
  ['Introductions are few and explained', 'Honest bands, readable reasons, one real nuance.'],
  ['Two yeses open a conversation', 'Both people decide independently, with context.'],
  ['Safety is one tap away', 'Report, block, or leave — at any point, without explanation.'],
];

function DemoComplete() {
  const navigate = useNavigate();

  return (
    <StageShell showNav={false}>
      <div className="rounded-3xl border border-stone-900/10 bg-white p-7 text-center">
        <Sparkles size={22} className="mx-auto text-[#E9BC55]" />
        <h1 className="mt-3 font-[Playfair_Display] text-3xl tracking-tight">
          That&apos;s the whole idea
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
          Interest starts it. Intention confirms it.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {RECAP.map(([title, body]) => (
          <div key={title} className="rounded-2xl bg-white p-4 ring-1 ring-stone-900/5">
            <p className="text-sm font-semibold text-stone-800">{title}</p>
            <p className="mt-0.5 text-sm text-stone-500">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => {
            restartDemo();
            void navigate({ to: '/onboarding' });
          }}
          className="w-full rounded-xl bg-[#F2684A] px-4 py-4 text-sm font-semibold text-white"
        >
          Run the demo again
        </button>
        <Link
          to="/app"
          className="block rounded-xl border border-stone-900/15 bg-white px-4 py-3.5 text-center text-sm font-semibold text-stone-700"
        >
          Explore the full Prism prototype
        </Link>
      </div>
    </StageShell>
  );
}
