import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CURRENT_USER } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { reachStep } from '../lib/twoStage';

export const Route = createFileRoute('/onboarding')({
  head: () => ({
    meta: [
      { title: 'Your demo profile — Matchwise' },
      {
        name: 'description',
        content: 'A prefilled Matchwise demo profile: intent, values, interests, communication and availability.',
      },
      { property: 'og:title', content: 'Your demo profile — Matchwise' },
      { property: 'og:description', content: 'Prefilled demo answers so the guided demo starts immediately.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Onboarding,
});

const SAMPLE_QUESTIONS = [
  'What are you hoping to find in the next six months?',
  'Which three values would your closest friend say you live by?',
  'How do you prefer to keep in touch between meeting up?',
  'When in the week do you actually have free time?',
  'How much do you like to plan versus improvise?',
];

function Onboarding() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(false);
  const me = CURRENT_USER;

  const rows: [string, string][] = [
    ['Looking for', me.subMode.toLowerCase().replace('_', ' ')],
    ['Values', me.needsOffers.domains.slice(0, 3).join(', ')],
    ['Interests', me.needsOffers.offers.slice(0, 4).join(', ')],
    ['Communication', me.communicationLatency],
    ['Availability', `About ${me.availabilityHoursPerWeek} hours a week`],
    ['Interaction style', me.riskTolerance],
  ];

  return (
    <StageShell
      showNav={false}
      title="Your demo profile"
      helper="These answers are prefilled so the demo starts right away. Nothing here is a real person."
    >
      <div className="overflow-hidden rounded-3xl border border-stone-900/10 bg-white">
        <div className="flex items-center gap-4 border-b border-stone-900/10 p-5">
          <img src={me.avatar} alt={me.name} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <h2 className="font-[Playfair_Display] text-2xl tracking-tight">{me.name}</h2>
            <p className="text-xs uppercase tracking-[0.14em] text-stone-400">
              {me.title} · {me.location}
            </p>
          </div>
        </div>
        <dl className="divide-y divide-stone-900/5">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3.5 text-sm">
              <dt className="text-stone-400">{k}</dt>
              <dd className="col-span-2 text-stone-700">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        onClick={() => setSheet(true)}
        className="mt-4 text-sm text-stone-500 underline underline-offset-4"
      >
        See how the profile was built
      </button>

      <button
        onClick={() => {
          reachStep(2);
          void navigate({ to: '/discover' });
        }}
        className="mt-6 w-full rounded-xl bg-[#F2684A] px-4 py-4 text-sm font-semibold text-white"
      >
        Use this demo profile
      </button>

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 pb-8">
            <h3 className="font-[Playfair_Display] text-xl">Sample questions</h3>
            <p className="mt-1 text-sm text-stone-500">
              The full questionnaire asks about intent, values, communication, lifestyle and
              availability. The demo skips it.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-stone-700">
              {SAMPLE_QUESTIONS.map((q) => (
                <li key={q} className="rounded-xl bg-[#FAFBFD] px-4 py-3">
                  {q}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSheet(false)}
              className="mt-5 w-full rounded-xl border border-stone-900/10 px-4 py-3 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </StageShell>
  );
}
