import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { DEMO_STEPS, useMatchwise } from "@/lib/matchwise/store";
import { cn } from "@/lib/utils";

export function DemoProgress() {
  const { demoMode, step, restartDemo, hydrated } = useMatchwise();
  if (!hydrated || !demoMode) return null;

  const currentIndex = DEMO_STEPS.findIndex((s) => s.key === step);

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-secondary/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-5 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Guided demo
        </span>
        <ol className="flex flex-1 items-center gap-1.5" aria-label="Demo progress">
          {DEMO_STEPS.map((s, i) => (
            <li
              key={s.key}
              title={s.label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= currentIndex ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </ol>
        <Link
          to="/"
          onClick={restartDemo}
          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Restart
        </Link>
      </div>
    </div>
  );
}
