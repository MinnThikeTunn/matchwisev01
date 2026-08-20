# Matchwise Prism — review and next steps

## Where the app stands

The two-stage layer is now genuinely inside the Prism app: Discovery records private signals, Introductions shows banded shortlists, the Synergy view carries the "Why you two" decision panel, and Conversations open only after a mutual yes. Landing page, guided demo strip, safety sheet, undo, and the "this is not a match" toast all exist.

Against the build plan, these gaps remain.

### 1. Broken route (highest priority)
`/onboarding` returns 404 — that is the page currently open in the preview. Any link or bookmark pointing there dead-ends. Onboarding lives inside the app shell, so `/onboarding` should redirect into the app's onboarding step (or be removed from wherever it is still linked).

### 2. Demo data is browser-only
Signal, decision, and match state live only in `localStorage`. The plan calls for Supabase-backed fictional demo records so a judge on any device sees the same seeded people and so a refresh mid-demo is safe. Seed demo profiles into the existing `anon_profiles` tables and read them at demo start, keeping local state as the fast path.

### 3. Demo robustness for the pitch
- Restart / reset control reachable from every screen, not just Profile.
- Skip/back protection so an accidental browser Back does not desync the guided strip.
- A predictable end state that loops cleanly back to the landing page.

### 4. Spec details not yet honoured
- Photo pagination dots and "tap to open full profile" separated from drag on Discovery cards.
- Explicit "Waiting for your decision / You accepted / Matched / Closed" status on every Introduction card.
- The "Nuance" line ("treat this as a conversation point, not a prediction") in the Why-you-two dossier.
- Report and Block as distinct actions with confirmation, not only a combined safety sheet.

### 5. Consistency and polish
Colours are hardcoded hex values across ~19 components (Header alone has 23). This blocks theming and makes the newer two-stage components drift from the Prism palette. Move the Prism palette into CSS tokens in `src/styles.css` and swap components over.

Also: `src/components/stage/` still holds leftovers from the earlier parallel build; `useStage.ts` and `SafetySheet.tsx` should move next to the other components and the folder be removed.

## Suggested order

1. Fix `/onboarding` and clear the orphan `stage/` folder.
2. Demo robustness: global restart, back protection, clean loop-back.
3. Spec details on Discovery, Introductions, and the dossier.
4. Supabase-seeded demo records.
5. Palette tokens and hex cleanup.

Steps 1–3 are the ones that most affect how the demo reads to a judge; 4 and 5 are durability work.

## Technical notes

- Route fix: add `src/routes/onboarding.tsx` that redirects to `/app` with an onboarding flag, or drop the stale link.
- Demo state: keep `useSyncExternalStore` in `src/lib/twoStage.ts`; add a hydrate-from-Supabase call at demo start and guard against overwriting an in-progress run.
- Seeding: literal INSERT statements in a migration for the demo people, with anon SELECT grants and policies.
- Tokens: define Prism colours as CSS variables in `src/styles.css`, then replace hex literals component by component starting with Header, ProfileView, and the two-stage components.
