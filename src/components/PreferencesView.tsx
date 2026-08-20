import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  MessageSquare,
  Handshake,
  Gauge,
} from 'lucide-react';
import {
  QUESTION_SETS,
  QuestionSet,
  answeredCount,
  preferenceStats,
  resetAnswers,
  resetSet,
  setAnswer,
  toggleMultiAnswer,
  topTraits,
  topWeights,
  useAnswers,
} from '../lib/preferences';
import { useStage } from './stage/useStage';

interface PreferencesViewProps {
  onOpenDiscovery?: () => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({ onOpenDiscovery }) => {
  const answers = useAnswers();
  const stage = useStage();
  const stats = preferenceStats(answers);
  const [openSet, setOpenSet] = useState<string>(QUESTION_SETS[0].id);

  const signalsSent = Object.keys(stage.signals).length;
  const introductions = Object.keys(stage.decisions).length + Math.min(3, signalsSent);
  const matches = Object.keys(stage.decisions).filter(
    (id) => stage.decisions[id] === 'accepted' && stage.theirDecisions[id] === 'accepted',
  ).length;

  const traits = topTraits(answers);
  const weights = topWeights(answers);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Preferences
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Tell us how you actually are
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-stone-600">
          The more of this you answer, the more your introductions are built on things that matter
          rather than guesses. Everything stays on this device for the demo.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <StatCard icon={Gauge} label="Profile complete" value={`${stats.completeness}%`} />
        <StatCard icon={Check} label="Questions answered" value={`${stats.answered}/${stats.total}`} />
        <StatCard icon={Heart} label="Signals sent" value={signalsSent} />
        <StatCard icon={Handshake} label="Introductions" value={introductions} />
        <StatCard icon={Sparkles} label="Mutual matches" value={matches} />
        <StatCard icon={MessageSquare} label="Avg. reply time" value="2h 10m" />
      </section>

      <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-stone-900">Match confidence</span>
          <span className="font-bold text-[#B5751E]">{stats.confidence}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#B5751E] transition-all duration-500"
            style={{ width: `${stats.confidence}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Confidence rises as you answer. It describes how much evidence we have — not how likely
          anything is to work out.
        </p>
      </section>

      {/* Question sets */}
      <div className="space-y-3">
        {QUESTION_SETS.map((set) => {
          const done = answeredCount(answers, set);
          const open = openSet === set.id;
          return (
            <section key={set.id} className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpenSet(open ? '' : set.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-stone-50"
              >
                <ProgressRing value={done} total={set.questions.length} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-stone-900">{set.title}</span>
                  <span className="block text-xs text-stone-500">{set.why}</span>
                </span>
                <span className="text-xs text-stone-400 shrink-0">
                  {done}/{set.questions.length}
                </span>
                {open ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {open && (
                <div className="border-t border-stone-100 p-5 space-y-6">
                  {set.questions.map((q) => (
                    <div key={q.id}>
                      <p className="text-sm font-medium text-stone-800">{q.prompt}</p>

                      {q.kind === 'scale' && (
                        <>
                          <div className="mt-3 flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => {
                              const active = answers[q.id] === n;
                              return (
                                <button
                                  key={n}
                                  onClick={() => setAnswer(q.id, n)}
                                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                                    active
                                      ? 'border-stone-900 bg-stone-900 text-white'
                                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                                  }`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-1.5 flex justify-between text-[11px] text-stone-400">
                            <span>{q.ends?.[0]}</span>
                            <span>{q.ends?.[1]}</span>
                          </div>
                        </>
                      )}

                      {q.kind === 'single' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {q.options?.map((o) => {
                            const active = answers[q.id] === o;
                            return (
                              <button
                                key={o}
                                onClick={() => setAnswer(q.id, o)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                  active
                                    ? 'border-stone-900 bg-stone-900 text-white'
                                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                                }`}
                              >
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.kind === 'multi' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {q.options?.map((o) => {
                            const list = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                            const active = list.includes(o);
                            return (
                              <button
                                key={o}
                                onClick={() => toggleMultiAnswer(q.id, o)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                  active
                                    ? 'border-[#B5751E] bg-amber-50 text-[#8a570f]'
                                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                                }`}
                              >
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => resetSet(set.id)}
                    className="text-xs text-stone-500 underline"
                  >
                    Clear this section
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* What this changed */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-stone-900">What this changed</h2>
        {stats.answered === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            Nothing yet — answer a section above and this fills in.
          </p>
        ) : (
          <div className="mt-3 space-y-3 text-sm text-stone-700">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
                You come across as
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {traits.length ? (
                  traits.map((t) => (
                    <span key={t} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-stone-500">Answer the personality set to see this.</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
                You weight most in a partner
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {weights.length ? (
                  weights.map((t) => (
                    <span key={t} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-[#8a570f]">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-stone-500">Answer the values set to see this.</span>
                )}
              </div>
            </div>
            <p className="text-sm text-stone-600">
              These answers now shape {stats.factorsShaped} of the 7 factors behind your
              introductions.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {onOpenDiscovery && (
            <button
              onClick={onOpenDiscovery}
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
            >
              See who this brings up
            </button>
          )}
          <button
            onClick={resetAnswers}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all answers
          </button>
        </div>
      </section>
    </div>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <Icon className="w-4 h-4 text-stone-400" />
      <div className="mt-2 text-xl font-semibold text-stone-900">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-stone-500">{label}</div>
    </div>
  );
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const pct = total ? value / total : 0;
  const size = 38;
  const r = 16;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e7e5e4" strokeWidth="3" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#B5751E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - pct)}
      />
    </svg>
  );
}

export default PreferencesView;
