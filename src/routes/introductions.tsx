import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { REASON_CHIP } from "@/lib/matchwise/scoring";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/introductions")({
  head: () => ({
    meta: [
      { title: "Promising introductions — Matchwise" },
      {
        name: "description",
        content:
          "Stage 2: a short shortlist chosen from mutual eligibility, your profile, and private interest signals.",
      },
      { property: "og:title", content: "Promising introductions — Matchwise" },
      { property: "og:description", content: "A few explained introductions, not an endless feed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Introductions,
});

function Introductions() {
  const { recommendations, myDecisions, theirDecisions, setStep, demoMode } = useMatchwise();

  useEffect(() => {
    if (demoMode) setStep("introductions");
  }, [demoMode, setStep]);

  return (
    <AppShell
      title="Promising introductions."
      helper="Chosen from mutual eligibility, your profile, and private interest signals. At most three each week."
    >
      <ul className="space-y-4">
        {recommendations.map((rec) => {
          const mine = myDecisions[rec.profile.id];
          const theirs = theirDecisions[rec.profile.id];
          const status =
            mine === "reject" || theirs === "reject"
              ? "Closed"
              : mine === "accept" && theirs === "accept"
                ? "Matched"
                : mine === "accept"
                  ? "You accepted — waiting"
                  : "Waiting for your decision";

          return (
            <li key={rec.profile.id}>
              <SectionCard className="p-0 overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={rec.profile.photo}
                    alt={rec.profile.name}
                    width={768}
                    height={1024}
                    loading="lazy"
                    className="size-28 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                      {rec.label}
                    </span>
                    <h2 className="mt-1.5 text-2xl leading-tight">
                      {rec.profile.name}, {rec.profile.age}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {rec.profile.occupation} · {rec.profile.city}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {status}
                    </p>
                  </div>
                </div>

                <ul className="flex flex-wrap gap-2 px-4">
                  {rec.positiveReasons.map((code) => (
                    <li
                      key={code}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      <span className="text-muted-foreground">{REASON_CHIP[code].category}:</span>{" "}
                      {REASON_CHIP[code].label}
                    </li>
                  ))}
                </ul>

                <div className="p-4">
                  <Button asChild className="h-12 w-full rounded-2xl font-bold">
                    <Link to="/introduction/$id" params={{ id: rec.profile.id }}>
                      See why you two
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </SectionCard>
            </li>
          );
        })}
      </ul>

      {recommendations.length === 0 ? (
        <SectionCard>
          <h2 className="text-2xl">No introductions yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Signal on a few people in Discover and your shortlist will appear here.
          </p>
        </SectionCard>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground">
        Matchwise ranks introductions; it does not predict relationship success. We never show a
        compatibility percentage or a popularity score.
      </p>
    </AppShell>
  );
}
