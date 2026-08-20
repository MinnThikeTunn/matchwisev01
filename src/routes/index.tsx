import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matchwise — Better introductions. Two thoughtful yeses." },
      {
        name: "description",
        content:
          "A swipe is a private interest signal, not a match. Matchwise proposes a few explained introductions and both people decide deliberately before chat opens.",
      },
      { property: "og:title", content: "Matchwise — Better introductions. Two thoughtful yeses." },
      {
        property: "og:description",
        content: "Explore freely, then decide with context. Interest starts it. Intention confirms it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { startDemo } = useMatchwise();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-14">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-extrabold tracking-tight">Matchwise</span>
          </div>

          <h1 className="mt-8 text-[2.6rem] leading-[1.05] sm:text-6xl">
            Better introductions.
            <br />
            <em className="not-italic text-primary">Two thoughtful yeses.</em>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Explore freely, then decide with context. A swipe here is a private signal of curiosity —
            it never creates a match on its own.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:max-w-md">
            <Button
              size="lg"
              className="h-14 rounded-2xl text-base font-bold shadow-lift"
              onClick={() => {
                startDemo();
                void navigate({ to: "/onboarding" });
              }}
            >
              Try the 3-minute guided demo
              <ArrowRight className="ml-1 size-5" aria-hidden />
            </Button>
            <p className="text-sm text-muted-foreground">
              No account needed. Uses fictional demo profiles.
            </p>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Stage 1", "Signal curiosity privately."],
              ["Stage 2", "Receive a few explained introductions."],
              ["Match", "Chat opens only after both say yes."],
            ].map(([k, v]) => (
              <div key={k} className="ink-hairline rounded-2xl bg-card p-4 shadow-paper">
                <dt className="text-xs font-bold uppercase tracking-wide text-primary">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="ink-hairline rounded-3xl bg-card p-6 shadow-paper">
          <div className="flex rounded-xl bg-secondary p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === m ? "bg-card shadow-paper" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast("Accounts are disabled in the prototype. Use the guided demo instead.");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required minLength={8} />
            </div>
            <Button type="submit" variant="outline" className="w-full h-11 rounded-xl">
              Continue
            </Button>
          </form>

          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            Matchwise is 18+. We suggest promising introductions — we don't predict love, and we
            don't sell attention.
          </p>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="relative inline-flex size-8 items-center justify-center rounded-xl bg-primary"
    >
      <span className="absolute size-3.5 -translate-x-1 -translate-y-0.5 rounded-md border-2 border-primary-foreground" />
      <span className="absolute size-3.5 translate-x-1 translate-y-1 rounded-md border-2 border-primary-foreground/70" />
    </span>
  );
}
