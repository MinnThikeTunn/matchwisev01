import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { demoUser, INTENT_LABEL } from "@/lib/matchwise/data";
import { REASON_CHIP, reasonSentence } from "@/lib/matchwise/scoring";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/introduction/$id")({
  head: () => ({
    meta: [
      { title: "Why you two — Matchwise" },
      {
        name: "description",
        content:
          "The reasons behind an introduction, then a private accept-or-reject decision. Chat opens only after both accept.",
      },
      { property: "og:title", content: "Why you two — Matchwise" },
      { property: "og:description", content: "Transparent reasons, then a deliberate decision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntroductionDetail,
});

function IntroductionDetail() {
  const { id } = useParams({ from: "/introduction/$id" });
  const {
    scoreFor,
    decide,
    receiveTheirDecision,
    myDecisions,
    theirDecisions,
    setStep,
    demoMode,
  } = useMatchwise();
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);

  const rec = scoreFor(id);
  const mine = myDecisions[id];
  const theirs = theirDecisions[id];

  useEffect(() => {
    if (demoMode) setStep("decision");
  }, [demoMode, setStep]);

  useEffect(() => {
    if (mine === "accept" && theirs === "accept") {
      void navigate({ to: "/chat/$matchId", params: { matchId: id } });
    }
  }, [mine, theirs, id, navigate]);

  if (!rec) {
    return (
      <AppShell title="Introduction unavailable">
        <p className="text-sm text-muted-foreground">This introduction is no longer active.</p>
      </AppShell>
    );
  }

  const other = rec.profile;

  return (
    <AppShell>
      <SectionCard className="overflow-hidden p-0">
        <img
          src={other.photo}
          alt={other.name}
          width={768}
          height={1024}
          className="aspect-[16/11] w-full object-cover object-top"
        />
        <div className="p-5">
          <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
            {rec.label}
          </span>
          <h1 className="mt-2 text-3xl">
            {other.name}, {other.age}
          </h1>
          <p className="text-sm text-muted-foreground">
            {other.occupation} · {other.city}
          </p>
          <p className="mt-3 text-[15px]">{other.bio}</p>
          <p className="mt-2 text-sm font-semibold text-sage-foreground">
            {INTENT_LABEL[other.intent]}
          </p>
        </div>
      </SectionCard>

      <h2 className="mt-8 text-2xl">Why you two</h2>
      <ul className="mt-3 space-y-3">
        {rec.positiveReasons.map((code) => (
          <li key={code} className="ink-hairline rounded-2xl bg-card p-4 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              {REASON_CHIP[code].category}
            </p>
            <p className="mt-1 text-[15px]">{reasonSentence(code, demoUser.name, other.name)}</p>
          </li>
        ))}
        {rec.nuance ? (
          <li className="rounded-2xl border border-dashed border-border bg-secondary/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Worth knowing
            </p>
            <p className="mt-1 text-[15px]">
              {reasonSentence(rec.nuance, demoUser.name, other.name)}
            </p>
          </li>
        ) : null}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Matchwise suggests promising introductions. Chemistry still happens between people.
      </p>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl gap-3">
          {mine === "accept" ? (
            <p className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-semibold">
              <Clock3 className="size-4" aria-hidden />
              {waiting ? "Your answer is private while we wait for theirs." : "You accepted."}
            </p>
          ) : mine === "reject" ? (
            <p className="w-full rounded-2xl bg-secondary py-3 text-center text-sm font-semibold">
              Closed. {other.name} will not be told who decided what.
            </p>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-2xl border-2 text-base font-bold"
                onClick={() => {
                  decide(id, "reject");
                  toast("Closed quietly. Nobody is told who decided what.");
                  void navigate({ to: "/introductions" });
                }}
              >
                Not for me
              </Button>
              <Button
                className="h-14 flex-1 rounded-2xl text-base font-bold"
                onClick={() => {
                  decide(id, "accept");
                  setWaiting(true);
                  toast("Your answer is private while we wait for theirs.");
                  // Demo mode simulates the other participant's decision.
                  window.setTimeout(() => receiveTheirDecision(id, "accept"), 1000);
                }}
              >
                I'd like to meet
              </Button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
