import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/demo-complete")({
  head: () => ({
    meta: [
      { title: "Demo complete — Matchwise" },
      {
        name: "description",
        content:
          "Signal curiosity, receive an explained introduction, both decide deliberately, start with context and control.",
      },
      { property: "og:title", content: "Demo complete — Matchwise" },
      { property: "og:description", content: "The Matchwise difference in four steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoComplete,
});

const RECAP = [
  ["Signal curiosity.", "A swipe stays private and never creates a match."],
  ["Receive an explained introduction.", "A short shortlist with reasons you can read."],
  ["Both decide deliberately.", "Chat opens only after two independent yeses."],
  ["Start with context and control.", "Starters that fit, safety tools in reach."],
];

function DemoComplete() {
  const { restartDemo } = useMatchwise();
  const navigate = useNavigate();

  return (
    <AppShell showNav={false}>
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Demo complete</p>
        <h1 className="mt-2 text-4xl">Interest starts it. Intention confirms it.</h1>

        <ol className="mt-6 space-y-3">
          {RECAP.map(([title, body], i) => (
            <li key={title}>
              <SectionCard className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </SectionCard>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            className="h-13 flex-1 rounded-2xl py-4 font-bold"
            onClick={() => {
              restartDemo();
              void navigate({ to: "/onboarding" });
            }}
          >
            Restart demo
          </Button>
          <Button
            variant="outline"
            className="h-13 flex-1 rounded-2xl border-2 py-4 font-bold"
            onClick={() => void navigate({ to: "/discover" })}
          >
            Explore the prototype
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
