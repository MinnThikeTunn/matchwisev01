import React, { useMemo, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Undo2 } from 'lucide-react';
import { CURRENT_USER, MOCK_PROFILES } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { SignalCard } from '../components/stage/SignalCard';
import { useStage } from '../components/stage/useStage';
import { reachStep, recordSignal, undoLastSignal } from '../lib/twoStage';

export const Route = createFileRoute('/discover')({
  head: () => ({
    meta: [
      { title: 'Discover — private interest signals | Matchwise' },
      {
        name: 'description',
        content: 'Signal curiosity or pass. Signals shape your shortlist and never create a match.',
      },
      { property: 'og:title', content: 'Discover — private interest signals | Matchwise' },
      { property: 'og:description', content: 'A low-stakes signal, not a match decision.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Discover,
});

function Discover() {
  const stage = useStage();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  const queue = useMemo(
    () => MOCK_PROFILES.filter((p) => !stage.signals[p.id] && !stage.blocked.includes(p.id)),
    [stage.signals, stage.blocked],
  );

  const signalCount = Object.keys(stage.signals).length;
  const current = queue[0];

  const handleSignal = (id: string, action: 'curious' | 'pass') => {
    recordSignal(id, action);
    setToast('Signal saved — this is not a match.');
    window.setTimeout(() => setToast(''), 2600);
    if (signalCount + 1 >= 2) reachStep(3);
  };

  return (
    <StageShell
      title="Who sparks your curiosity?"
      helper="Signals shape your shortlist. They do not create matches."
    >
      {current ? (
        <SignalCard
          key={current.id}
          profile={current}
          onSignal={(action) => handleSignal(current.id, action)}
        />
      ) : (
        <div className="rounded-3xl border border-stone-900/10 bg-white p-8 text-center">
          <h2 className="font-[Playfair_Display] text-2xl">Your shortlist is ready</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
            We looked at mutual eligibility, your profile and your private signals, and picked a
            small number of introductions.
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          onClick={undoLastSignal}
          disabled={stage.signalOrder.length === 0}
          className="inline-flex items-center gap-1.5 text-stone-500 disabled:opacity-30"
        >
          <Undo2 size={14} /> Undo last
        </button>
        <span className="text-stone-400">{signalCount} private signals so far</span>
      </div>

      {signalCount >= 2 && (
        <button
          onClick={() => {
            reachStep(3);
            void navigate({ to: '/introductions' });
          }}
          className="mt-5 w-full rounded-xl bg-[#17211D] px-4 py-4 text-sm font-semibold text-white"
        >
          See your introductions
        </button>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#17211D] px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </StageShell>
  );
}
