import React, { useMemo, useState } from 'react';
import { MessageSquare, Send, ShieldCheck, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { useStage } from './stage/useStage';
import { SafetySheet } from './stage/SafetySheet';
import { buildIntroductions, reachStep, sendMessage } from '../lib/twoStage';

interface Props {
  currentUser: UserProfile;
  candidatePool: UserProfile[];
  activeId: string | null;
  onSelectThread: (id: string | null) => void;
}

export function ChatsView({ currentUser, candidatePool, activeId, onSelectThread }: Props) {
  const stage = useStage();
  const [draft, setDraft] = useState('');
  const [safety, setSafety] = useState(false);

  const matched = useMemo(
    () =>
      buildIntroductions(currentUser, candidatePool, stage, 8).filter(
        (i) => i.status === 'matched' || stage.closed.includes(i.candidate.id),
      ),
    [currentUser, candidatePool, stage],
  );

  React.useEffect(() => {
    if (stage.demoMode && activeId) reachStep(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const active = matched.find((i) => i.candidate.id === activeId) ?? null;
  const thread = active ? stage.messages[active.candidate.id] ?? [] : [];
  const closed = active ? stage.closed.includes(active.candidate.id) : false;

  const send = (text: string) => {
    const value = text.trim();
    if (!value || !active || closed) return;
    sendMessage(active.candidate.id, value, 'me');
    setDraft('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
          <MessageSquare className="w-3.5 h-3.5" />
          Conversations
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Open only where you both said yes
        </h1>
      </header>

      {matched.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-sm text-stone-500">
          No conversations yet. Accept an introduction — if they accept too, it opens here.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
          <aside className="space-y-2">
            {matched.map((intro) => {
              const t = stage.messages[intro.candidate.id] ?? [];
              const last = t[t.length - 1];
              const isActive = intro.candidate.id === activeId;
              return (
                <button
                  key={intro.candidate.id}
                  onClick={() => onSelectThread(intro.candidate.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                    isActive
                      ? 'border-[#D97706] bg-amber-50/60'
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <img
                    src={intro.candidate.avatar}
                    alt=""
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-stone-900">
                      {intro.candidate.name}
                    </span>
                    <span className="block truncate text-xs text-stone-500">
                      {last?.text ?? 'Say hello whenever you are ready.'}
                    </span>
                  </span>
                </button>
              );
            })}
          </aside>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            {!active ? (
              <p className="py-16 text-center text-sm text-stone-500">
                Pick a conversation to open it.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectThread(null)}
                      aria-label="Back to conversation list"
                      className="lg:hidden text-stone-400"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <img
                      src={active.candidate.avatar}
                      alt=""
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold text-stone-900">
                        {active.candidate.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        You both accepted this introduction · {active.band}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSafety(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-400"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A6275]" /> Safety
                  </button>
                </div>

                <div className="mt-4 min-h-[180px] space-y-2.5">
                  {thread.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.from === 'me'
                          ? 'ml-auto bg-stone-900 text-white'
                          : 'bg-stone-50 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                {closed ? (
                  <p className="mt-6 rounded-xl bg-stone-50 p-5 text-center text-sm text-stone-500">
                    You left this conversation. It stays closed.
                  </p>
                ) : (
                  <>
                    <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
                      Openers from your reasons
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {active.starters.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs text-stone-600 hover:border-stone-400"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <form
                      className="mt-5 flex gap-2"
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
                        className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm outline-none focus:border-[#D97706] focus:bg-white"
                      />
                      <button
                        type="submit"
                        aria-label="Send message"
                        className="rounded-full bg-[#D97706] px-5 text-white hover:brightness-110"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}

                <SafetySheet
                  candidateId={active.candidate.id}
                  candidateName={active.candidate.name}
                  open={safety}
                  onClose={() => setSafety(false)}
                  onLeft={() => reachStep(7)}
                />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
