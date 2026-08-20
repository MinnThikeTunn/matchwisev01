import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectionCard } from "@/components/matchwise/AppShell";
import { useMatchwise } from "@/lib/matchwise/store";

export const Route = createFileRoute("/chats")({
  head: () => ({
    meta: [
      { title: "Chats — Matchwise" },
      {
        name: "description",
        content: "Conversations open only after both people accept an introduction.",
      },
      { property: "og:title", content: "Chats — Matchwise" },
      { property: "og:description", content: "Chat unlocks after two thoughtful yeses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chats,
});

function Chats() {
  const { matches, messages } = useMatchwise();

  return (
    <AppShell title="Chats" helper="A conversation exists only where both people accepted.">
      {matches.length === 0 ? (
        <SectionCard>
          <h2 className="text-2xl">No open conversations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accept an introduction, and if the other person accepts too, the chat opens here.
          </p>
        </SectionCard>
      ) : (
        <ul className="space-y-3">
          {matches.map((m) => {
            const thread = messages[m.profile.id] ?? [];
            const last = thread[thread.length - 1];
            return (
              <li key={m.profile.id}>
                <Link
                  to="/chat/$matchId"
                  params={{ matchId: m.profile.id }}
                  className="ink-hairline flex items-center gap-4 rounded-2xl bg-card p-4 shadow-paper transition-colors hover:bg-secondary/60"
                >
                  <img
                    src={m.profile.photo}
                    alt={m.profile.name}
                    width={768}
                    height={1024}
                    loading="lazy"
                    className="size-14 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-bold">{m.profile.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {last ? last.body : "You both chose this. Say hello."}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
