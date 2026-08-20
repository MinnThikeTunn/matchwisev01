import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { demoUser } from "@/lib/matchwise/data";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Your demo profile — Matchwise" },
      {
        name: "description",
        content: "A prefilled fictional profile so the guided demo starts in seconds.",
      },
      { property: "og:title", content: "Your demo profile — Matchwise" },
      { property: "og:description", content: "Prefilled demo answers for the guided walkthrough." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const SUMMARY: [string, string][] = [
  ["Relationship goal", "Long-term, comfortable moving slowly"],
  ["Values", "Kindness, curiosity, growth"],
  ["Interests", "Product design, photography, cafés, live music"],
  ["Communication", "Thoughtful texting and in-person conversation"],
  ["Availability", "Weekday evenings and weekends"],
  ["Interaction style", "Plans important things, flexible about the rest"],
];

const SAMPLE_QUESTIONS = [
  "What are you hoping to find in the next year?",
  "Which three values would you not compromise on?",
  "How often do you like to message when you're getting to know someone?",
  "When are you usually free to meet people?",
  "Do you prefer plans made in advance or decided on the day?",
];

function Onboarding() {
  const { setStep, demoMode } = useMatchwise();
  const navigate = useNavigate();

  useEffect(() => {
    setStep("profile");
  }, [setStep]);

  return (
    <AppShell showNav={false}>
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          {demoMode ? "Step 1 of 6" : "Your profile"}
        </p>
        <h1 className="mt-2 text-4xl">Meet May</h1>
        <p className="mt-2 text-muted-foreground">
          22, interaction-design student in Yangon. Her answers are already filled in so the demo can
          start with the part that matters.
        </p>

        <SectionCard className="mt-6 overflow-hidden p-0">
          <img
            src={demoUser.photo}
            alt="May, 22"
            width={768}
            height={1024}
            className="aspect-[16/10] w-full object-cover object-top"
          />
          <dl className="divide-y divide-border">
            {SUMMARY.map(([k, v]) => (
              <div key={k} className="grid gap-0.5 px-5 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {k}
                </dt>
                <dd className="text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="h-14 rounded-2xl text-base font-bold"
            onClick={() => {
              setStep("discover");
              void navigate({ to: "/discover" });
            }}
          >
            Use this demo profile
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-11">
                See how the profile was built
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="mx-auto max-w-2xl rounded-t-3xl">
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl">How the profile was built</SheetTitle>
                <SheetDescription>
                  In the full product these answers come from a short guided questionnaire. Sample
                  questions:
                </SheetDescription>
              </SheetHeader>
              <ul className="space-y-2 px-4 pb-8 text-[15px]">
                {SAMPLE_QUESTIONS.map((q) => (
                  <li key={q} className="rounded-xl bg-secondary/70 px-4 py-3">
                    {q}
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </AppShell>
  );
}
