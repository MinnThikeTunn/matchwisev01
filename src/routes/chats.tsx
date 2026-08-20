import React, { useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CURRENT_USER, MOCK_PROFILES } from '../data/mockData';
import { StageShell } from '../components/stage/StageShell';
import { useStage } from '../components/stage/useStage';
import { buildIntroductions } from '../lib/twoStage';

export const Route = createFileRoute('/chats')({
  head: () => ({
    meta: [
      { title: 'Conversations — Matchwise' },
      {
        name: 'description',
        content: 'Conversations open only after two independent yeses. Leave any of them at any time.',
      },
      { property: 'og:title', content: 'Conversations — Matchwise' },
      { property: 'og:description', content: 'Only mutual, deliberate matches appear here.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Chats,
});

function Chats() {
  const stage = useStage();
  const matched = useMemo(
    () =>
      buildIntroductions(CURRENT_USER, MOCK_PROFILES, stage, 6).filter(
        (i) => i.status === 'matched',
      ),
    [stage],
  );

  return (
    <StageShell title="Conversations" helper="Open only where you both said yes.">
      {matched.length === 0 ? (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-stone-500">
          No conversations yet. Accept an introduction, and if they accept too, it opens here.
        </p>
      ) : (
        <div className="space-y-3">
          {matched.map((intro) => {
            const thread = stage.messages[intro.candidate.id] ?? [];
            const last = thread[thread.length - 1];
            return (
              <Link
                key={intro.candidate.id}
                to="/chat/$matchId"
                params={{ matchId: intro.candidate.id }}
                className="flex items-center gap-4 rounded-2xl border border-stone-900/10 bg-white p-4 hover:border-stone-900/25"
              >
                <img
                  src={intro.candidate.avatar}
                  alt={intro.candidate.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="font-[Playfair_Display] text-lg leading-none">
                    {intro.candidate.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-stone-500">
                    {last?.text ?? 'Say hello whenever you are ready.'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </StageShell>
  );
}
