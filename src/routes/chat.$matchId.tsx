import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/matchwise/AppShell";
import { SafetySheet } from "@/components/matchwise/SafetySheet";
import { conversationStarters } from "@/lib/matchwise/data";
import { REASON_CHIP } from "@/lib/matchwise/scoring";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/chat/$matchId")({
  head: () => ({
    meta: [
      { title: "You both chose this — Matchwise" },
      {
        name: "description",
        content: "A conversation that starts with context, prewritten starters, and safety controls.",
      },
      { property: "og:title", content: "You both chose this — Matchwise" },
      { property: "og:description", content: "Chat opens after two thoughtful yeses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { matchId } = useParams({ from: "/chat/$matchId" });
  const { scoreFor, messages, sendMessage, setStep, demoMode } = useMatchwise();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [celebrate, setCelebrate] = useState(true);

  const rec = scoreFor(matchId);
  const thread = messages[matchId] ?? [];

  useEffect(() => {
    if (demoMode) setStep("chat");
    const t = window.setTimeout(() => setCelebrate(false), 2600);
    return () => window.clearTimeout(t);
  }, [demoMode, setStep]);

  if (!rec) {
    return (
      <AppShell title="Conversation unavailable">
        <p className="text-sm text-muted-foreground">This conversation is no longer active.</p>
      </AppShell>
    );
  }

  const other = rec.profile;

  const send = (body: string) => {
    const text = body.trim();
    if (!text) return;
    sendMessage(matchId, text);
    setDraft("");
  };

  return (
    <AppShell showNav={false}>
      <div className="-mt-2 mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/chats">
            <ChevronLeft className="size-4" aria-hidden />
            Chats
          </Link>
        </Button>
        <SafetySheet profileId={other.id} name={other.name} />
      </div>

      {celebrate ? (
        <div className="ink-hairline mb-4 rounded-3xl bg-accent p-5 text-accent-foreground shadow-paper">
          <h1 className="text-3xl">You both chose this.</h1>
          <p className="mt-1 text-sm">
            {other.name} accepted too. Chat is open because two people said yes — not because of a
            swipe.
          </p>
        </div>
      ) : null}

      <div className="ink-hairline flex items-center gap-3 rounded-2xl bg-card p-3 shadow-paper">
        <img
          src={other.photo}
          alt={other.name}
          width={768}
          height={1024}
          className="size-12 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="font-bold">
            {other.name}, {other.age}
          </p>
          <ul className="mt-0.5 flex flex-wrap gap-1.5">
            {rec.positiveReasons.slice(0, 3).map((code) => (
              <li
                key={code}
                className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {REASON_CHIP[code].label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-5 space-y-2 pb-4">
        {thread.map((m) => (
          <li
            key={m.id}
            className={
              m.from === "me"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-card px-4 py-2.5 ink-hairline"
            }
          >
            {m.body}
          </li>
        ))}
      </ul>

      {thread.length === 0 ? (
        <div className="mt-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Starters based on what you share
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {conversationStarters.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => send(s)}
                  className="ink-hairline w-full rounded-2xl bg-card px-4 py-3 text-left text-[15px] shadow-paper transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {thread.length > 0 && demoMode ? (
        <Button
          variant="ghost"
          className="mt-4 w-full"
          onClick={() => {
            setStep("complete");
            void navigate({ to: "/demo-complete" });
          }}
        >
          Finish the guided demo
        </Button>
      ) : null}

      <form
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <div className="mx-auto flex w-full max-w-2xl gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${other.name}`}
            className="h-12 rounded-2xl"
            aria-label="Message"
          />
          <Button type="submit" size="icon" className="size-12 rounded-2xl" aria-label="Send">
            <Send className="size-5" />
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
