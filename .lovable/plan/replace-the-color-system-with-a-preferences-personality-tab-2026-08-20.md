# Replace the Color System with a Preferences & Personality tab, and bring Dating into Discovery

## 1. New tab: "Preferences" (replaces "Color System")

The Color System tab today is a 800-line explainer about OKLCH perceptual colour theory plus a live colour simulator. It teaches a theory instead of improving anyone's matches. It gets replaced by a tab where the user actually answers things about themselves and sees where they stand.

The new tab has three parts on one page:

**Your stats (top).** A snapshot strip: profile completeness %, questions answered (e.g. 18/32), signals sent this week, introductions received, mutual matches, average response time, and a "match confidence" meter that visibly rises as more questions are answered. All demo values, computed from local state so they move when the user answers questions.

**Question sets (middle).** Grouped, tappable cards — answer inline, no modal, progress ring per set:
- Personality — 8 agree/disagree statements (energy from people, planning vs improvising, conflict style, novelty seeking, steadiness under stress).
- Relationship intent — what you're looking for, timeline, exclusivity, distance you'd travel.
- Values — 6 pick-what-matters items (family, faith/spirituality, ambition, politics-tolerance, honesty style, money attitude).
- Lifestyle — sleep rhythm, social battery, drinking/smoking, fitness, pets, kids.
- Communication — reply speed, texting vs calling, how you handle disagreement.
- Interests — multi-select chips (food, travel, music, film, gaming, outdoors, reading, sport).

Each set shows a one-line "why this helps" note and answers save instantly to local state.

**What this changed (bottom).** After answering, a short readout: your top three traits in plain words, the two things you weight most in a partner, and a line like "these answers now shape 6 of the 7 factors in your introductions." Plus a "Retake" and a "Reset answers" control.

The existing chromatic assessment modal is repurposed as the quick-start version of the Personality set, restyled to plain language (no colour naming) — or removed if it fights the new inline flow.

## 2. Removing colour-system language elsewhere

Colour is used as decorative identity throughout, which is fine; the pseudo-scientific framing is what goes. Changes:
- Header: "Color System" nav item becomes "Preferences"; "Chromatic Feed", "Chromatic Signature Verified", "View Chromatic Dossier" become plain wording.
- Dashboard: the "Matchwise Chromatic Behavioral Model / OKLCH Science" banner is replaced by a "Complete your preferences" prompt that deep-links into the new tab and shows remaining questions. "Resonant Colors" list becomes "People near your fit".
- Profile: the "Prism Spectrum" tab and "Chromatic Signature Profile" panel become "Traits & Preferences", showing the same bars labelled by behaviour (Drive, Depth, Warmth) rather than colour names.
- Synergy view: "Chromatic Synergy Resonance", "XAI Chromatic Drivers", "Initiate Chromatic Collaboration" reworded to human phrasing ("Why you two", "What drives this fit", "Send an introduction").
- Verification: "zero-leakage proof of chromatic spectrum" reworded.

Avatar accent colours and the ring visuals stay — they read as branding, not as a theory.

## 3. Dating in Discovery

Discovery currently offers only Collaborate, Study, Community, Teams — the romantic context is missing even though the product leads with dating. Fix:
- Add a **Dating** context as the first and default tab in Discovery, mapped to the `DATING` intent.
- The demo data has only one dating profile, so add 5–6 dating-intent demo people with photos, bios, ages, location and interests so the swipe deck has depth.
- Dating cards show what matters for dating: age, distance, looking-for, two shared interests, and one "worth knowing" line — not skills/domains.
- Ranking for the dating context weights values, lifestyle, communication and interests instead of the skill-exchange weights used by Collaborate/Teams.
- Introductions and the "Why you two" dossier show dating-appropriate reason chips when the introduction came from the dating context.

## Technical notes

- `DiscoveryContext` in `src/lib/discovery.ts` gains `'DATING'` mapped to `subMode: 'DATING'`, placed first in `DISCOVERY_CONTEXTS`; the default `useState` in `DiscoveryView` switches to it.
- Dating candidates are added to `src/data/mockData.ts` with `subMode: 'DATING'` and `tier: 'PERSONAL'`, plus generated portraits in `src/assets`.
- Context-aware scoring: extend `rankDiscovery` with a per-context weight table rather than branching inside the pairwise algorithm.
- New `src/components/PreferencesView.tsx` plus `src/lib/preferences.ts` (question definitions, answer storage in localStorage via the same `useSyncExternalStore` pattern as `twoStage.ts`, derived stats).
- `ViewMode` `'colors'` becomes `'preferences'`; `ColorSystemView.tsx` is deleted and `App.tsx`/`Header.tsx` rewired.
- `src/lib/colorSystem.ts` stays for avatar/ring accents; only its narrative surfaces go.
