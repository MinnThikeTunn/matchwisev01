import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { demoUser, INTENT_LABEL } from "@/lib/matchwise/data";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile and safety — Matchwise" },
      {
        name: "description",
        content: "Your profile summary, discovery preferences, safety controls, and demo reset.",
      },
      { property: "og:title", content: "Profile and safety — Matchwise" },
      { property: "og:description", content: "Preferences, safety controls, and demo reset." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const { blocked, reports, signals, restartDemo } = useMatchwise();
  const navigate = useNavigate();

  return (
    <AppShell title="Your profile" helper="Fictional demo account. No real personal data is stored.">
      <SectionCard className="flex gap-4">
        <img
          src={demoUser.photo}
          alt={demoUser.name}
          width={768}
          height={1024}
          loading="lazy"
          className="size-20 rounded-2xl object-cover"
        />
        <div>
          <h2 className="text-2xl leading-tight">
            {demoUser.name}, {demoUser.age}
          </h2>
          <p className="text-sm text-muted-foreground">
            {demoUser.occupation} · {demoUser.city}
          </p>
          <p className="mt-1 text-sm font-semibold text-sage-foreground">
            {INTENT_LABEL[demoUser.intent]}
          </p>
        </div>
      </SectionCard>

      <SectionCard className="mt-4">
        <h3 className="text-xl">Discovery preferences</h3>
        <div className="mt-3 space-y-3 text-sm">
          <Row label="Age range" value="21–29" />
          <Row label="Distance" value="Within Yangon" />
          <Row label="Shown to" value="Men, 18+" />
          <div className="flex items-center justify-between gap-4 pt-1">
            <Label htmlFor="discoverable">Discoverable</Label>
            <Switch id="discoverable" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="intent-gate">Intention is non-negotiable</Label>
            <Switch id="intent-gate" />
          </div>
        </div>
      </SectionCard>

      <SectionCard className="mt-4">
        <h3 className="text-xl">Your activity</h3>
        <div className="mt-3 space-y-3 text-sm">
          <Row label="Private signals sent" value={String(Object.keys(signals).length)} />
          <Row label="Blocked people" value={String(blocked.length)} />
          <Row label="Reports sent" value={String(reports.length)} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Nobody can see your Stage 1 signals or who you passed on. Rejections are never revealed.
        </p>
      </SectionCard>

      <SectionCard className="mt-4">
        <h3 className="text-xl">Safety</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>Block and report are available on every conversation.</li>
          <li>Meet in public, tell a friend, arrange your own transport.</li>
          <li>
            This prototype does not perform identity verification, background checks, or live
            tracking, and never claims to.
          </li>
        </ul>
      </SectionCard>

      <Button
        variant="outline"
        className="mt-4 h-12 w-full rounded-2xl border-2 font-bold"
        onClick={() => {
          restartDemo();
          toast("Demo reset to its initial state.");
          void navigate({ to: "/onboarding" });
        }}
      >
        Restart the guided demo
      </Button>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
