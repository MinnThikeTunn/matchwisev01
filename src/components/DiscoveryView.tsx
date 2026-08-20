import React, { useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import {
  Heart,
  X,
  RotateCcw,
  Sparkles,
  Compass,
  Info,
  MapPin,
  Clock,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  DISCOVERY_CONTEXTS,
  DiscoveryContext,
  MATCH_VERSION,
  RankedCandidate,
  SwipeRecord,
  candidateTags,
  clearSwipes,
  confidenceLabel,
  evidenceLabel,
  learnSignal,
  loadSwipes,
  rankDiscovery,
  saveSwipes,
  topLearnedTags,
} from '../lib/discovery';

interface DiscoveryViewProps {
  currentUser: UserProfile;
  candidatePool: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
}

export function DiscoveryView({ currentUser, candidatePool, onSelectCandidate }: DiscoveryViewProps) {
  const [context, setContext] = useState<DiscoveryContext>('COLLABORATE');
  const [swipes, setSwipes] = useState<SwipeRecord[]>(() => loadSwipes());
  const [showDebug, setShowDebug] = useState(false);

  const queue = useMemo(
    () => rankDiscovery(currentUser, candidatePool, context, swipes),
    [currentUser, candidatePool, context, swipes],
  );

  const signal = useMemo(() => learnSignal(swipes, context), [swipes, context]);
  const learnedTags = topLearnedTags(signal);
  const likes = swipes.filter((s) => s.context === context && s.action === 'like');
  const likedProfiles = likes
    .map((s) => candidatePool.find((p) => p.id === s.candidateId))
    .filter(Boolean) as UserProfile[];

  const record = (candidate: UserProfile, action: 'like' | 'pass') => {
    const next: SwipeRecord[] = [
      ...swipes,
      {
        candidateId: candidate.id,
        action,
        context,
        at: new Date().toISOString(),
        matchVersion: MATCH_VERSION,
        tags: candidateTags(candidate),
      },
    ];
    setSwipes(next);
    saveSwipes(next);
  };

  const undo = () => {
    const next = swipes.slice(0, -1);
    setSwipes(next);
    saveSwipes(next);
  };

  const reset = () => {
    clearSwipes();
    setSwipes([]);
  };

  const top = queue[0];
  const upcoming = queue.slice(1, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
          <Compass className="w-3.5 h-3.5" />
          Discovery · {MATCH_VERSION}
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          One card at a time
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl text-sm sm:text-base">
          Deterministic ranking chooses who you see. Your like / pass behaviour becomes a preference
          signal that nudges — never overrides — the engine.
        </p>
      </header>

      {/* Context switcher */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {DISCOVERY_CONTEXTS.map((c) => {
          const active = c.id === context;
          return (
            <button
              key={c.id}
              onClick={() => setContext(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              <span className="font-medium">{c.label}</span>
              <span className={`ml-2 text-[11px] ${active ? 'text-white/60' : 'text-stone-400'}`}>
                {c.blurb}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        {/* Card stack */}
        <div>
          <div className="relative h-[560px] sm:h-[600px]">
            {upcoming
              .slice()
              .reverse()
              .map((r, i) => (
                <div
                  key={r.candidate.id}
                  className="absolute inset-x-0 top-0 h-full rounded-3xl border border-stone-200 bg-white shadow-sm"
                  style={{
                    transform: `translateY(${(upcoming.length - i) * 10}px) scale(${
                      1 - (upcoming.length - i) * 0.02
                    })`,
                    zIndex: i,
                  }}
                />
              ))}

            <AnimatePresence mode="popLayout">
              {top ? (
                <SwipeCard
                  key={top.candidate.id}
                  ranked={top}
                  onLike={() => record(top.candidate, 'like')}
                  onPass={() => record(top.candidate, 'pass')}
                  onOpen={() => onSelectCandidate(top.candidate)}
                  showDebug={showDebug}
                />
              ) : (
                <div className="absolute inset-0 rounded-3xl border border-dashed border-stone-300 bg-white/60 flex flex-col items-center justify-center text-center px-8">
                  <Sparkles className="w-6 h-6 text-stone-400" />
                  <p className="mt-3 font-medium text-stone-800">You've seen everyone here</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Switch context or reset your signals to review the pool again.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-5 rounded-full bg-stone-900 text-white text-sm px-5 py-2.5"
                  >
                    Reset discovery signals
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => top && record(top.candidate, 'pass')}
              disabled={!top}
              aria-label="Pass"
              className="w-14 h-14 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-400 disabled:opacity-40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={undo}
              disabled={!swipes.length}
              aria-label="Undo last swipe"
              className="w-11 h-11 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-400 hover:text-stone-800 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => top && record(top.candidate, 'like')}
              disabled={!top}
              aria-label="Connect"
              className="w-14 h-14 rounded-full bg-[#B5751E] text-white flex items-center justify-center shadow-sm hover:brightness-110 disabled:opacity-40 transition-all"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-stone-900">Signal ledger</h2>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <Stat label="Connect" value={signal.liked} />
              <Stat label="Pass" value={signal.passed} />
              <Stat label="Queue" value={queue.length} />
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
                Stated preference
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {currentUser.needsOffers.needs.slice(0, 3).join(', ') || 'Not specified'}
              </p>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-stone-400">
                Behaviour suggests
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {learnedTags.length ? learnedTags.join(', ') : 'Not enough swipes yet'}
              </p>
            </div>
            {swipes.length > 0 && (
              <button onClick={reset} className="mt-4 text-xs text-stone-500 underline">
                Reset all signals
              </button>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900">Connections</h2>
              <span className="text-xs text-stone-400">{likedProfiles.length}</span>
            </div>
            {likedProfiles.length === 0 ? (
              <p className="mt-2 text-sm text-stone-500">Nobody yet — connect with a card to start.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {likedProfiles.slice(-5).reverse().map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => onSelectCandidate(p)}
                      className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-stone-50 text-left"
                    >
                      <img src={p.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-stone-900 truncate">{p.name}</span>
                        <span className="block text-xs text-stone-500 truncate">{p.title}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            onClick={() => setShowDebug((v) => !v)}
            className="w-full rounded-2xl border border-stone-200 bg-white p-4 flex items-center gap-2 text-sm text-stone-600 hover:border-stone-400"
          >
            <BarChart3 className="w-4 h-4" />
            {showDebug ? 'Hide' : 'Show'} matching debug on card
          </button>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-stone-50 py-2">
      <div className="text-lg font-semibold text-stone-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div>
    </div>
  );
}

function SwipeCard({
  ranked,
  onLike,
  onPass,
  onOpen,
  showDebug,
}: {
  ranked: RankedCandidate;
  onLike: () => void;
  onPass: () => void;
  onOpen: () => void;
  showDebug: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-12, 12]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const passOpacity = useTransform(x, [-160, -40], [1, 0]);
  const [flipped, setFlipped] = useState(false);
  const c = ranked.candidate;

  return (
    <motion.article
      className="absolute inset-0 z-10 rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.x > 130) onLike();
        else if (info.offset.x < -130) onPass();
      }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 z-20 rounded-lg border-2 border-[#B5751E] px-3 py-1 text-sm font-bold tracking-widest text-[#B5751E] rotate-[-12deg] bg-white/80"
      >
        CONNECT
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 z-20 rounded-lg border-2 border-stone-500 px-3 py-1 text-sm font-bold tracking-widest text-stone-600 rotate-[12deg] bg-white/80"
      >
        PASS
      </motion.div>

      <div className="relative h-[46%]">
        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">{c.name}</h3>
            {ranked.isExploration && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                Exploration
              </span>
            )}
          </div>
          <p className="text-sm text-white/80">{c.title}</p>
        </div>
      </div>

      <div className="h-[54%] overflow-y-auto p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {c.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {c.availabilityHoursPerWeek}h / week
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {c.needsOffers.offers.slice(0, 4).map((o) => (
            <span key={o} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
              {o}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
          <button
            onClick={() => setFlipped((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-semibold text-stone-900">Why this match?</span>
            <Info className="w-4 h-4 text-stone-400" />
          </button>
          <div className="mt-2 flex gap-4 text-xs text-stone-600">
            <span>
              Evidence: <strong className="text-stone-900">{evidenceLabel(ranked.score)}</strong>
            </span>
            <span>
              Confidence:{' '}
              <strong className="text-stone-900">{confidenceLabel(ranked.confidence)}</strong>
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-stone-700">
            {ranked.reasons.slice(0, flipped ? 6 : 3).map((r) => (
              <li key={r} className="flex gap-2">
                <span className="text-[#B5751E]">•</span>
                {r}
              </li>
            ))}
          </ul>
          {flipped && ranked.uncertainties.length > 0 && (
            <>
              <p className="mt-3 text-xs font-mono uppercase tracking-[0.16em] text-stone-400">
                Less certain about
              </p>
              <ul className="mt-1 space-y-1 text-sm text-stone-600">
                {ranked.uncertainties.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="text-stone-400">•</span>
                    {u}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {showDebug && (
          <div className="mt-3 rounded-xl border border-stone-200 p-3 font-mono text-[11px] text-stone-600 space-y-1">
            <div>gate: passed</div>
            <div>base_score: {ranked.baseScore}</div>
            <div>behaviour_adjustment: {ranked.behaviourAdjustment}</div>
            <div>ranked_score: {ranked.score}</div>
            <div>confidence: {ranked.confidence}</div>
            <div>version: {MATCH_VERSION}</div>
          </div>
        )}

        <button
          onClick={onOpen}
          className="mt-4 w-full rounded-full border border-stone-300 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
        >
          Open full synergy breakdown
        </button>
      </div>
    </motion.article>
  );
}
