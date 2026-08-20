import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Compass, Sparkles, MessagesSquare, User } from 'lucide-react';
import { DEMO_STEPS } from '../../lib/twoStage';
import { useStage } from './useStage';

const NAV = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/introductions', label: 'Introductions', icon: Sparkles },
  { to: '/chats', label: 'Chats', icon: MessagesSquare },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export function StageShell({
  children,
  showNav = true,
  title,
  helper,
}: {
  children: React.ReactNode;
  showNav?: boolean;
  title?: string;
  helper?: string;
}) {
  const stage = useStage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-900/10 bg-[#FAFBFD]/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F2684A]" />
            <span className="font-[Playfair_Display] text-lg tracking-tight">Matchwise</span>
          </Link>
          {stage.demoMode && (
            <span className="rounded-full border border-stone-900/15 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
              Guided demo
            </span>
          )}
        </div>
        {stage.demoMode && (
          <div className="mx-auto max-w-3xl px-5 pb-3">
            <div className="flex gap-1">
              {DEMO_STEPS.map((s, i) => (
                <span
                  key={s.key}
                  title={s.label}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= stage.step ? 'bg-[#F2684A]' : 'bg-stone-900/10'
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-stone-400">
              Step {Math.min(stage.step + 1, DEMO_STEPS.length)} of {DEMO_STEPS.length} ·{' '}
              {DEMO_STEPS[Math.min(stage.step, DEMO_STEPS.length - 1)]!.label}
            </p>
          </div>
        )}
      </header>

      <main className={`mx-auto max-w-3xl px-5 pt-6 ${showNav ? 'pb-28' : 'pb-10'}`}>
        {title && (
          <div className="mb-5">
            <h1 className="font-[Playfair_Display] text-3xl leading-tight tracking-tight">{title}</h1>
            {helper && <p className="mt-1.5 text-sm text-stone-500">{helper}</p>}
          </div>
        )}
        {children}
      </main>

      {showNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-900/10 bg-white/95 backdrop-blur">
          <div className="mx-auto grid max-w-3xl grid-cols-4">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-wide ${
                    active ? 'text-[#F2684A]' : 'text-stone-400'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
