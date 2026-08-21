# Merge Verification into Profile as one Prism ID system

Today the app has two overlapping screens: **Profile** (hero card, editing, tabs for overview / spectrum / OCEAN / skills / verification) and **Verification** (a static certificate page with a conic ring render, a fixed palette list and a fake signatory). The verification content is largely decorative and already duplicated by the Profile screen's own Verification tab.

## What changes

One screen, one nav item: **Prism ID**. It becomes the universal identity record for a person — who they are, what shapes their matches, and the verifiable proof attached to it.

### Structure

- **Header card** (existing hero): avatar, name, title, location, availability, plus a prominent Prism ID chip with copy-to-clipboard and a share action.
- **Trust strip** under the hero: verified state, last authenticated time, profile completeness, and how many signals/introductions this identity has produced.
- **Tabs** (kept from Profile, verification folded in and renamed):
  - Overview — bio, intent, goals, editing
  - Traits — Big Five / personality readout
  - Strengths — offers, needs, domains
  - Prism ID — the verification tab, expanded (see below)

### The Prism ID tab (the "universal" part)

- Identity credential card: Prism ID, issue/verified timestamp, integrity hash, valid signature badge — keeps the existing style but drops the fictional "Chief Standardization Officer" signatory and the color-palette rows.
- Verification checklist: identity, preferences completed, intent declared, activity history — each with a clear met/unmet state so it reads as real trust signal rather than decoration.
- Portable record: a "Share Prism ID" action that copies a shareable identity link/summary, plus a short line explaining that the ID travels with the person across contexts (dating, collaboration, study, teams) without exposing private answers.
- Keeps the conic ring visual as a compact identity emblem next to the credential, not as a full-width certificate.

### Navigation

- Remove the standalone **Verification** nav item; Profile is renamed **Prism ID** in the header (desktop + mobile drawer) and keeps the avatar shortcut.
- Any in-app link that pointed to the verification view routes to the Prism ID tab of the merged screen.

## Technical notes

- `src/components/VerificationView.tsx` is deleted; the credential/checklist markup is rebuilt inside `ProfileView.tsx`'s existing `verification` tab (renamed `prism-id`), reusing `ConicRingVisual`.
- `ViewMode` in `src/types/index.ts` drops `'verification'`; `src/App.tsx` removes the branch and its import; `src/components/Header.tsx` drops the nav entry and relabels `profile`.
- Completeness/activity numbers come from the existing preferences and two-stage stores (`src/lib/preferences.ts`, `src/lib/twoStage.ts`) so the trust strip reflects real demo state.
- No color-system language reintroduced; existing stone/amber Prism styling is kept.
