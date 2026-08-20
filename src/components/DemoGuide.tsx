import React from 'react';
import { Sparkles, X, RotateCcw } from 'lucide-react';
import { DEMO_STEPS, exitDemo, restartDemo } from '../lib/twoStage';
import { useStage } from './stage/useStage';

export function DemoGuide({ onRestartFlow }: { onRestartFlow: () => void }) {
  const stage = useStage();
  if (!stage.demoMode) return null;

  const current = Math.min(stage.step, DEMO_STEPS.length - 1);

  return (
    <div className="sticky top-[60px] z-30 border-b border-amber-500/20 bg-amber-50/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 sm:px-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-900">
          <Sparkles className="w-3.5 h-3.5" /> Guided demo
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
          {DEMO_STEPS.map((s, i) => (
            <span
              key={s.key}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                i === current
                  ? 'bg-[#D97706] text-white'
                  : i < current
                    ? 'bg-amber-200/70 text-amber-900'
                    : 'text-amber-900/50'
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            restartDemo();
            onRestartFlow();
          }}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900/70 hover:text-amber-900"
        >
          <RotateCcw className="w-3 h-3" /> Restart
        </button>
        <button
          onClick={exitDemo}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900/70 hover:text-amber-900"
        >
          <X className="w-3 h-3" /> Exit demo
        </button>
      </div>
    </div>
  );
}
