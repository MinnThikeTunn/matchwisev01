import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EyeOff, Heart, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppShell } from "@/components/matchwise/AppShell";
import { SwipeCard } from "@/components/matchwise/SwipeCard";
import { INTENT_LABEL, type Profile } from "@/lib/matchwise/data";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Matchwise" },
      {
        name: "description",
        content:
          "Stage 1: signal curiosity privately. Signals shape your shortlist, they do not create matches.",
      },
      { property: "og:title", content: "Discover — Matchwise" },
      { property: "og:description", content: "Signal curiosity privately. No match is created here." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { discoverQueue, sendSignal, undoSignal, hideProfile, setStep, demoMode, signals } =
    useMatchwise();
  const navigate = useNavigate();
  const [last, setLast] = useState<string | null>(null);
  const [open, setOpen] = useState<Profile | null>(null);
  const toastShown = useRef(false);

  useEffect(() => {
    if (demoMode) setStep("discover");
  }, [demoMode, setStep]);

  const signalCount = Object.keys(signals).length;
  const [current, next] = discoverQueue;

  const act = (profile: Profile, direction: "curious" | "pass") => {
    sendSignal(profile.id, direction);
    setLast(profile.id);
    if (!toastShown.current) {
      toastShown.current = true;
      toast("Signal saved privately. No match has been created.", {
        description: "Only Stage 2 introductions can turn into a match.",
      });
    }
  };

  return (
    <AppShell
      title="Who sparks your curiosity?"
      helper="Signals shape your shortlist. They do not create matches, and the other person never sees them."
    >
      <div className="relative min-h-[560px]">
        {current ? (
          <>
            {next ? <SwipeCard profile={next} stacked onSignal={() => {}} onOpen={() => {}} /> : null}
            <SwipeCard
              key={current.id}
              profile={current}
              onSignal={(d) => act(current, d)}
              onOpen={() => setOpen(current)}
            />
          </>
        ) : (
          <div className="ink-hairline rounded-3xl bg-card p-8 text-center shadow-paper">
            <h2 className="text-2xl">That's everyone for now</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You signalled on {signalCount} {signalCount === 1 ? "profile" : "profiles"}. Your
              shortlist is ready.
            </p>
            <Button
              className="mt-5 h-12 rounded-2xl px-6 font-bold"
              onClick={() => {
                setStep("introductions");
                void navigate({ to: "/introductions" });
              }}
            >
              See your introductions
            </Button>
          </div>
        )}
      </div>

      {current ? (
        <div className="mt-5 space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-14 flex-1 rounded-2xl border-2 text-base font-bold"
              onClick={() => act(current, "pass")}
            >
              <X className="size-5" aria-hidden />
              Pass for now
            </Button>
            <Button
              className="h-14 flex-1 rounded-2xl text-base font-bold"
              onClick={() => act(current, "curious")}
            >
              <Heart className="size-5" aria-hidden />
              I'm curious
            </Button>
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              disabled={!last}
              onClick={() => {
                if (last) {
                  undoSignal(last);
                  setLast(null);
                }
              }}
            >
              <Undo2 className="size-4" aria-hidden />
              Undo last
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                hideProfile(current.id);
                toast("Hidden. You won't see this person again.");
              }}
            >
              <EyeOff className="size-4" aria-hidden />
              Don't show me this person again
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            &ldquo;Pass for now&rdquo; is temporary — it lowers ranking for this cycle, it is not a
            permanent rejection.
          </p>
        </div>
      ) : null}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {open.name}, {open.age}
                </DialogTitle>
                <DialogDescription>
                  {open.occupation} · {open.city}
                </DialogDescription>
              </DialogHeader>
              <img
                src={open.photo}
                alt={open.name}
                width={768}
                height={1024}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <p className="text-[15px]">{open.bio}</p>
              <p className="text-sm font-semibold text-sage-foreground">{INTENT_LABEL[open.intent]}</p>
              <ul className="flex flex-wrap gap-2">
                {open.interests.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium"
                  >
                    {i}
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {open.prompt.question}
                </p>
                <p className="mt-1 text-[15px]">{open.prompt.answer}</p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
