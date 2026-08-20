# Integrate two-stage matching into Prism Match

The two-stage flow currently lives as a parallel mini-app (`/discover`, `/introductions`, `/chats`, `/profile`) with its own shell, typography and mock data, while the real Prism Match app is hidden at `/app`. This plan folds the two-stage features into the original app and deletes the parallel UI.

## End state

- `/` = the editorial landing page (kept) with sign-in and "Start the 3-minute guided demo".
- `/app` = the real Prism Match app, now containing every two-stage feature as views in its own Header navigation.
- No separate stage shell, no duplicate profile/chat screens, no Playfair/persimmon styling. Everything uses the existing Prism Header, Footer, cards, aura/color system and high-contrast toggle.

## What changes in the original app

New entries in `ViewMode` and the Header nav, rendered by `App.tsx` like the existing views:

- **Discovery (existing view, upgraded)** — a swipe stops being a match. Like/pass is recorded both as today's `SwipeRecord` (so learned tags keep working) and as a private two-stage signal, with copy that says "private signal — not a match". Existing context tabs, undo and learned-preference panel stay as they are.
- **Introductions (new view)** — the curated shortlist built by the existing Prism engine (`evaluatePairwiseMatch`) plus a small signal component, shown with honest band labels ("Top fit this week", "Strong overlap"), never raw percentages. Cards reuse `ProfileSummaryCard` styling.
- **Why you two (reuses `SynergyMatchView`)** — instead of a separate detail route, the existing synergy screen gains a two-stage block: reason chips (intent, values, communication, timing), one honest nuance/uncertainty, and Accept / Decline. Chat opens only after two independent yeses; in demo mode the other side's decision is simulated.
- **Conversations (new view)** — thread list plus thread, styled with the app's cards; openers seeded from the match reasons.
- **Safety** — report / block / leave available from introduction, synergy and chat surfaces, using the existing `SafetySheet` restyled to the Prism look.
- **Guided demo** — a dismissible progress strip inside the app shell (not separate screens). Landing "start demo" sets demo mode, opens the app, and the strip walks Dashboard → Discovery → Introductions → Why you two → Two yeses → Chat → Safety → Recap. Recap is a modal, not a route.

## Removals

Delete `src/routes/discover.tsx`, `introductions.tsx`, `introduction.$id.tsx`, `chats.tsx`, `chat.$matchId.tsx`, `profile.tsx`, `onboarding.tsx`, `demo-complete.tsx` and `src/components/stage/StageShell.tsx`. Onboarding stays the app's existing `OnboardingQuestionnaire` modal.

## Technical notes

- `src/lib/twoStage.ts` is kept as the state store (signals, decisions, messages, blocks, demo step) but loses UI-specific assumptions; it reads the real `candidatePool` from `App.tsx` (cloud profiles + mock fallback) rather than `MOCK_PROFILES` directly.
- `src/lib/discovery.ts` swipe recording and `twoStage` signal recording are wired through one handler in `DiscoveryView` so both stores stay consistent.
- Introduction ranking = `evaluatePairwiseMatch` final score (hard gates respected) with a bounded signal nudge, same pattern as `rankDiscovery`'s behaviour adjustment.
- `ViewMode` gains `'introductions' | 'chats'`; Header nav and mobile drawer get the two items.
- Stage state stays in localStorage; no schema changes.
- Verification: typecheck plus a Playwright pass through landing → demo → discovery signal → introductions → accept → chat → safety, checking the console is clean.
