import React, { useMemo, useState } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { CURRENT_USER, MOCK_PROFILES } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { useStage } from '../components/stage/useStage';
import { SafetySheet } from '../components/stage/SafetySheet';
import { findIntroduction, reachStep, sendMessage } from '../lib/twoStage';

export const Route = createFileRoute('/chat/$matchId')({
  head: () => ({
    meta: [
      { title: 'Conversation — Matchwise' },
      {
        name: 'description',
        content: 'A conversation that opened after two deliberate yeses, with safety controls one tap away.',
      },
      { property: 'og:title', content: 'Conversation — Matchwise' },
      { property: 'og:description', content: 'Openers grounded in why you were introduced.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { matchId } = useParams({ from: '/chat/$matchId' });
  const stage = useStage();
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [safety, setSafety] = useState(false);

  const intro = useMemo(
    () => findIntroduction(CURRENT_USER, MOCK_PROFILES, stage, matchId),
    [stage, matchId],
  );
  const thread = stage.messages[matchId] ?? [];
  const closed = stage.closed.includes(matchId);

  React.useEffect(() => {
    reachStep(6);
  }, []);

  if (!intro) {
    return (
      <StageShell showNav={false} title="Conversation unavailable">
        <button onClick={() => void navigate({ to: '/chats' })} className="text-sm underline">
          Back to conversations
        </button>
      </StageShell>
    );
  }

  const send = (text: string) => {
    const value = text.trim();
    if (!value || closed) return;
    sendMessage(matchId, value, 'me');
    setDraft('');
  };

  return (
    <StageShell showNav={false}>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => void navigate({ to: '/chats' })}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500"
        >
          <ArrowLeft size={15} /> Conversations
        </button>
        <button
          onClick={() => setSafety(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/15 bg-white px-3 py-1.5 text-xs font-medium text-stone-600"
        >
          <ShieldCheck size={13} className="text-[#0D7A94]" /> Safety
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-stone-900/10 bg-white p-4">
        <img
          src={intro.candidate.avatar}
          alt={intro.candidate.name}
          className="h-12 w-12 rounded-xl object-cover"
        />
        <div>
          <p className="font-[Playfair_Display] text-xl leading-none">{intro.candidate.name}</p>
          <p className="mt-1 text-xs text-stone-400">
            You both accepted this introduction · {intro.band}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {thread.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              m.from === 'me'
                ? 'ml-auto bg-[#17211D] text-white'
                : 'bg-white text-stone-700 ring-1 ring-stone-900/10'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {closed ? (
        <p className="mt-6 rounded-2xl bg-white p-5 text-center text-sm text-stone-500 ring-1 ring-stone-900/10">
          You left this conversation. It stays closed.
        </p>
      ) : (
        <>
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
              Openers from your reasons
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {intro.starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-white px-3.5 py-2 text-xs text-stone-600 ring-1 ring-stone-900/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form
            className="sticky bottom-4 mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message"
              aria-label="Message"
              className="flex-1 rounded-full border border-stone-900/10 bg-white px-5 py-3.5 text-sm outline-none focus:border-stone-900/30"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="rounded-full bg-[#F2684A] px-5 text-white"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}

      {stage.demoMode && (
        <button
          onClick={() => {
            reachStep(8);
            void navigate({ to: '/demo-complete' });
          }}
          className="mt-6 w-full rounded-xl border border-stone-900/15 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700"
        >
          Finish the guided demo
        </button>
      )}

      <SafetySheet
        candidateId={matchId}
        candidateName={intro.candidate.name}
        open={safety}
        onClose={() => setSafety(false)}
        onLeft={() => reachStep(7)}
      />
    </StageShell>
  );
}
