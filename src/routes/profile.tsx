import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CURRENT_USER } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { useStage } from '../components/stage/useStage';
import { restartDemo } from '../lib/twoStage';

export const Route = createFileRoute('/profile')({
  head: () => ({
    meta: [
      { title: 'Your profile & controls — Matchwise' },
      {
        name: 'description',
        content: 'Review your demo profile, private signals, blocked profiles and what Matchwise does not do.',
      },
      { property: 'og:title', content: 'Your profile & controls — Matchwise' },
      { property: 'og:description', content: 'Signals stay private. You stay in control.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Profile,
});

function Profile() {
  const stage = useStage();
  const navigate = useNavigate();
  const me = CURRENT_USER;
  const curious = Object.values(stage.signals).filter((s) => s === 'curious').length;

  return (
    <StageShell title="You" helper="Your signals are private. Nobody sees them but you.">
      <div className="flex items-center gap-4 rounded-3xl border border-stone-900/10 bg-white p-5">
        <img src={me.avatar} alt={me.name} className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <p className="font-[Playfair_Display] text-2xl leading-none">{me.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-400">
            {me.title} · {me.location}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          ['Signals', String(Object.keys(stage.signals).length)],
          ['Curious', String(curious)],
          ['Blocked', String(stage.blocked.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4 ring-1 ring-stone-900/5">
            <p className="font-[Playfair_Display] text-2xl">{value}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-stone-900/5">
        <h2 className="font-[Playfair_Display] text-xl">What Matchwise does not do</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
          {[
            'It does not predict love or guarantee outcomes.',
            'It does not show your private signals to anyone.',
            'It does not verify identity or run background checks.',
            'It does not rank people by attractiveness.',
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-[#A8C7A3]">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-3">
        <Link
          to="/app"
          className="block rounded-xl border border-stone-900/15 bg-white px-4 py-3.5 text-center text-sm font-semibold text-stone-700"
        >
          Open the full Prism prototype
        </Link>
        <button
          onClick={() => {
            restartDemo();
            void navigate({ to: '/onboarding' });
          }}
          className="w-full rounded-xl bg-[#17211D] px-4 py-3.5 text-sm font-semibold text-white"
        >
          Restart the guided demo
        </button>
      </div>
    </StageShell>
  );
}
