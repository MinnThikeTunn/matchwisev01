import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { startDemo } from '../lib/twoStage';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Matchwise Prism — Better introductions, two thoughtful yeses' },
      {
        name: 'description',
        content:
          'Matchwise Prism separates a private interest signal from a deliberate match decision. Explore freely, then decide with explainable chromatic context.',
      },
      { property: 'og:title', content: 'Matchwise Prism — Better introductions' },
      {
        property: 'og:description',
        content:
          'Interest starts it. Intention confirms it. Explainable introductions decided by both people.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [notice, setNotice] = useState('');

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-stone-900">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <section>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#059669] shadow-xs" />
            <span className="text-lg font-bold tracking-tight">Matchwise Prism</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Better introductions.
            <br />
            Two thoughtful yeses.
          </h1>
          <p className="mt-3 max-w-md text-base text-stone-600">
            Explore freely, then decide with context. A swipe here is a private signal — never a
            match — and every introduction explains itself.
          </p>

          <button
            onClick={() => {
              startDemo();
              void navigate({ to: '/app' });
            }}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D97706] px-6 py-4 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            <Sparkles size={16} />
            Try the 3-minute guided demo
            <ArrowRight size={16} />
          </button>
          <p className="mt-2 text-xs text-stone-400">
            No account needed. Runs inside the full Prism app with demo profiles.
          </p>

          <div className="mt-8 grid max-w-md gap-3 text-sm text-stone-600">
            {[
              ['Discovery', 'A low-stakes, private interest signal.'],
              ['Introductions', 'A small shortlist with readable reasons — no percentages.'],
              ['Two yeses', 'Conversations open only when both people accept.'],
            ].map(([title, body]) => (
              <div
                key={title}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A6275]" />
                <p>
                  <span className="font-semibold text-stone-900">{title}.</span> {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-xs">
          <div className="mb-5 flex gap-1 rounded-full bg-stone-100 p-1 text-sm">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 font-medium transition ${
                  mode === m ? 'bg-stone-900 text-white' : 'text-stone-500'
                }`}
              >
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(
                'Accounts are not enabled in this prototype. Use the guided demo, or open the app directly.',
              );
            }}
          >
            <label className="block text-sm">
              <span className="text-stone-500">Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#D97706] focus:bg-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-stone-500">Password</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#D97706] focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold hover:bg-stone-50"
            >
              Continue
            </button>
          </form>

          {notice && <p className="mt-3 text-xs text-stone-500">{notice}</p>}

          <div className="mt-6 border-t border-stone-200 pt-5 text-sm">
            <Link
              to="/app"
              className="flex items-center justify-between text-stone-600 hover:text-stone-900"
            >
              <span>Open the app without the demo</span>
              <ArrowRight size={15} />
            </Link>
            <p className="mt-4 flex items-start gap-2 text-xs text-stone-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#0A6275]" />
              Matchwise ranks promising introductions. It does not predict love, and it never shows
              your private signals to anyone else.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
