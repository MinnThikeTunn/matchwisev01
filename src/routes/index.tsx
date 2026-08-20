import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { startDemo } from '../lib/twoStage';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Matchwise — Better introductions. Two thoughtful yeses.' },
      {
        name: 'description',
        content:
          'Matchwise separates a private interest signal from a deliberate match decision. Explore freely, then decide with context.',
      },
      { property: 'og:title', content: 'Matchwise — Better introductions. Two thoughtful yeses.' },
      {
        property: 'og:description',
        content: 'Interest starts it. Intention confirms it. Explainable introductions, decided by both people.',
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
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <section>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F2684A]" />
            <span className="font-[Playfair_Display] text-xl tracking-tight">Matchwise</span>
          </div>

          <h1 className="mt-6 font-[Playfair_Display] text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Better introductions.
            <br />
            Two thoughtful yeses.
          </h1>
          <p className="mt-3 max-w-md text-base text-stone-500">
            Explore freely, then decide with context. A swipe here is a private signal — never a
            match.
          </p>

          <button
            onClick={() => {
              startDemo();
              void navigate({ to: '/onboarding' });
            }}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17211D] px-6 py-4 text-sm font-semibold text-white shadow-lg"
          >
            <Sparkles size={16} className="text-[#E9BC55]" />
            Try the 3-minute guided demo
            <ArrowRight size={16} />
          </button>
          <p className="mt-2 text-xs text-stone-400">
            No account needed. Uses fictional demo profiles.
          </p>

          <div className="mt-8 grid max-w-md gap-3 text-sm text-stone-600">
            {[
              ['Discover', 'A low-stakes, private interest signal.'],
              ['Introductions', 'A small shortlist with readable reasons.'],
              ['Two yeses', 'Chat opens only when both people accept.'],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-stone-900/5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8C7A3]" />
                <p>
                  <span className="font-semibold text-stone-800">{title}.</span> {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-900/10 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(23,33,29,0.6)]">
          <div className="mb-5 flex gap-1 rounded-full bg-[#FAFBFD] p-1 text-sm">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 font-medium transition ${
                  mode === m ? 'bg-[#17211D] text-white' : 'text-stone-500'
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
                'Accounts are not enabled in this prototype. Use the guided demo, or explore the full Prism prototype below.',
              );
            }}
          >
            <label className="block text-sm">
              <span className="text-stone-500">Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-stone-900/10 bg-[#FAFBFD] px-4 py-3 text-sm outline-none focus:border-stone-900/30"
              />
            </label>
            <label className="block text-sm">
              <span className="text-stone-500">Password</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-stone-900/10 bg-[#FAFBFD] px-4 py-3 text-sm outline-none focus:border-stone-900/30"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl border border-stone-900/15 px-4 py-3 text-sm font-semibold"
            >
              Continue
            </button>
          </form>

          {notice && <p className="mt-3 text-xs text-stone-500">{notice}</p>}

          <div className="mt-6 border-t border-stone-900/10 pt-5 text-sm">
            <Link to="/app" className="flex items-center justify-between text-stone-600 hover:text-stone-900">
              <span>Explore the full Prism prototype</span>
              <ArrowRight size={15} />
            </Link>
            <p className="mt-4 flex items-start gap-2 text-xs text-stone-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#0D7A94]" />
              Matchwise ranks promising introductions. It does not predict love, and it never shows
              your private signals to anyone else.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
