import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { UserProfile } from '../types';
import {
  ConnectionGoal,
  DEFAULT_FEATURES,
  GOAL_TO_SUBMODE,
  MATCH_FEATURES_STORAGE_KEY,
  MatchFeatures,
} from '../lib/onboardingStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onComplete: (updated: UserProfile, features: MatchFeatures) => void;
}

const GOALS: { id: ConnectionGoal; label: string }[] = [
  { id: 'FRIENDSHIP', label: 'Friendship' },
  { id: 'DATING', label: 'Dating' },
  { id: 'STUDY_PARTNERS', label: 'Study partners' },
  { id: 'HACKATHON_TEAMS', label: 'Hackathon / project teams' },
  { id: 'GAMING', label: 'Gaming partners' },
  { id: 'NETWORKING', label: 'Networking' },
  { id: 'MENTORSHIP', label: 'Mentorship' },
];

const INTEREST_GROUPS: { group: string; items: string[] }[] = [
  { group: 'Tech & Creativity', items: ['Programming', 'AI / ML', 'Design', 'Photography', 'Writing', 'Music', 'Film'] },
  { group: 'Play', items: ['Gaming', 'Esports', 'Board games', 'Anime', 'Cosplay'] },
  { group: 'Body & Outdoors', items: ['Sports', 'Gym', 'Running', 'Hiking', 'Travel'] },
  { group: 'Mind', items: ['Reading', 'Startups', 'Finance', 'Languages', 'Volunteering'] },
];

const VALUES = ['Career Growth', 'Family', 'Learning', 'Adventure', 'Creativity', 'Stability', 'Impact', 'Independence'];
const CHANNELS = ['Text', 'Voice call', 'Video call', 'In person'];
const CONVO = ['Small talk', 'Deep conversation', 'Balanced'];
const REPLY = ['Immediate', 'Within hours', 'Daily'];

const TEAM_ROLES = ['Leader', 'Supporter', 'Organizer', 'Idea generator'];
const SKILLS = ['Frontend', 'Backend', 'Mobile', 'Design / UX', 'Data / ML', 'Product', 'Marketing', 'Research'];
const CREATIVITY_ROLES = ['Idea generator', 'Refiner', 'Executor', 'Critic'];
const EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced', 'Mentor'];

const SLEEP = ['Morning person', 'Night owl', 'Flexible'];
const EXERCISE = ['Everyday', 'Often', 'Sometimes', 'Never'];
const WORK_STYLE = ['Deep focus blocks', 'Short sprints', 'Pair working', 'Async solo'];
const SOCIAL_ENERGY = ['Recharge alone', 'Recharge with people', 'Depends on the day'];

const DAYS = ['Weekdays', 'Weekends'];
const TIME_BLOCKS = ['Early morning', 'Morning', 'Afternoon', 'Evening', 'Late night'];
const LANGUAGES = ['English', 'Burmese', 'Mandarin', 'Japanese', 'Korean', 'Thai', 'Spanish', 'French'];

const OCEAN_ITEMS: { key: keyof MatchFeatures['ocean']; label: string; hint: string; color: string }[] = [
  { key: 'openness', label: 'Openness', hint: 'Curiosity for new ideas and experiments', color: '#0A6275' },
  { key: 'conscientiousness', label: 'Conscientiousness', hint: 'Structure, follow-through and deadlines', color: '#D97706' },
  { key: 'extraversion', label: 'Extraversion', hint: 'Energy from group interaction', color: '#7C3AED' },
  { key: 'agreeableness', label: 'Agreeableness', hint: 'Cooperation and trust in conflict', color: '#059669' },
  { key: 'neuroticism', label: 'Emotional reactivity', hint: 'Sensitivity to stress and pressure', color: '#DC2626' },
];

type StepId =
  | 'identity' | 'goals' | 'interests' | 'values' | 'communication' | 'personality'
  | 'complementarity' | 'lifestyle' | 'availability' | 'constraints' | 'review';

const STEPS: { id: StepId; title: string; subtitle: string; skippable: boolean }[] = [
  { id: 'identity', title: 'Tell us who you are', subtitle: 'This is the identity shown on your Prism dossier and match cards.', skippable: false },
  { id: 'goals', title: 'What are you looking for?', subtitle: 'Each connection type uses different scoring weights.', skippable: false },
  { id: 'interests', title: 'What are you into?', subtitle: 'Pick up to 10 interests. Scored with Jaccard similarity (30%).', skippable: true },
  { id: 'values', title: 'What matters most to you?', subtitle: 'Shared values and goals carry 15% of the similarity score.', skippable: true },
  { id: 'communication', title: "How do you communicate?", subtitle: 'Channel, depth and reply speed — 15% of the score.', skippable: true },
  { id: 'personality', title: 'A few things about you', subtitle: 'Big Five (OCEAN) traits — 25% of the score.', skippable: false },
  { id: 'complementarity', title: 'How do you work with others?', subtitle: 'Complementary roles and skills, weighted by connection type.', skippable: true },
  { id: 'lifestyle', title: "Let's talk lifestyle habits", subtitle: 'Rhythm and energy compatibility — 10%.', skippable: true },
  { id: 'availability', title: 'When are you free?', subtitle: 'Overlapping schedules — 5%.', skippable: true },
  { id: 'constraints', title: 'Your matching boundaries', subtitle: 'Hard rules that filter or penalise matches.', skippable: true },
  { id: 'review', title: 'Your matching profile', subtitle: 'This feeds directly into the compatibility pipeline.', skippable: false },
];

const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm transition-all border ${
      active
        ? 'bg-[#D97706]/10 border-[#D97706] text-[#92400E] font-semibold'
        : 'bg-stone-100 border-transparent text-stone-600 hover:bg-stone-200'
    }`}
  >
    {children}
  </button>
);

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-stone-100 border border-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#D97706] transition-colors';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-bold text-stone-800 mb-2.5">{children}</h3>
);

export const OnboardingQuestionnaire: React.FC<Props> = ({ isOpen, onClose, currentUser, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [f, setF] = useState<MatchFeatures>(() => {
    try {
      const saved = localStorage.getItem(MATCH_FEATURES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_FEATURES,
          ...parsed,
          identity: { ...DEFAULT_FEATURES.identity, ...(parsed.identity ?? {}) },
        };
      }
    } catch { /* ignore */ }
    return {
      ...DEFAULT_FEATURES,
      ocean: { ...currentUser.ocean },
      identity: {
        ...DEFAULT_FEATURES.identity,
        name: currentUser.name ?? '',
        title: currentUser.title ?? '',
        location: currentUser.location ?? '',
        bio: currentUser.bio ?? '',
        avatar: currentUser.avatar ?? '',
      },
    };
  });

  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const toggle = (list: string[], value: string, max?: number) =>
    list.includes(value)
      ? list.filter(v => v !== value)
      : max && list.length >= max
        ? list
        : [...list, value];

  const canContinue = useMemo(() => {
    if (step.id === 'identity') return f.identity.name.trim().length > 1;
    if (step.id === 'goals') return f.connectionGoals.length > 0;
    return true;
  }, [step.id, f.connectionGoals, f.identity.name]);

  if (!isOpen) return null;

  const finish = () => {
    const features: MatchFeatures = { ...f, completedAt: new Date().toISOString() };
    try {
      localStorage.setItem(MATCH_FEATURES_STORAGE_KEY, JSON.stringify(features));
    } catch { /* ignore */ }

    const primaryGoal = features.connectionGoals[0];
    const execution = Math.round(features.ocean.conscientiousness * 0.7 + features.ocean.openness * 0.3);
    const capability = Math.round(features.ocean.openness * 0.6 + features.ocean.conscientiousness * 0.4);
    const resonance = Math.round(features.ocean.agreeableness * 0.7 + (100 - features.ocean.neuroticism) * 0.3);

    const identity = features.identity;
    const updated: UserProfile = {
      ...currentUser,
      name: identity.name.trim() || currentUser.name,
      title: identity.title.trim() || currentUser.title,
      location: identity.location.trim() || currentUser.location,
      bio: identity.bio.trim() || currentUser.bio,
      avatar: identity.avatar.trim() || currentUser.avatar,
      ocean: features.ocean,
      subMode: primaryGoal ? GOAL_TO_SUBMODE[primaryGoal] : currentUser.subMode,
      availabilityHoursPerWeek: features.availability.hoursPerWeek,
      communicationLatency: features.communication.replySpeed || currentUser.communicationLatency,
      needsOffers: {
        ...currentUser.needsOffers,
        offers: features.complementarity.skills.length ? features.complementarity.skills : currentUser.needsOffers.offers,
        domains: features.interests.length ? features.interests : currentUser.needsOffers.domains,
      },
      constraints: {
        ...currentUser.constraints,
        languages: features.constraints.languages,
        minAge: features.constraints.minAge,
        maxAge: features.constraints.maxAge,
        maxDistanceKm: features.constraints.maxDistanceKm,
        connectionGoals: features.connectionGoals,
      },
      executionScore: execution,
      capabilityScore: capability,
      resonanceScore: resonance,
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: execution,
        deepTealAnchor: capability,
        verdantSpark: resonance,
        globalSynergyScore: Math.round((execution + capability + resonance) / 3),
      },
    };

    onComplete(updated, features);
    onClose();
  };

  const next = () => (stepIndex === STEPS.length - 1 ? finish() : setStepIndex(i => i + 1));
  const back = () => (stepIndex === 0 ? onClose() : setStepIndex(i => i - 1));

  const setIdentity = (patch: Partial<MatchFeatures['identity']>) =>
    setF({ ...f, identity: { ...f.identity, ...patch } });

  const renderStep = () => {
    switch (step.id) {
      case 'identity':
        return (
          <div className="space-y-5">
            <div>
              <SectionLabel>Full name *</SectionLabel>
              <input
                type="text"
                value={f.identity.name}
                onChange={e => setIdentity({ name: e.target.value })}
                placeholder="Alex Mercer"
                className={inputClass}
              />
            </div>
            <div>
              <SectionLabel>Headline / role</SectionLabel>
              <input
                type="text"
                value={f.identity.title}
                onChange={e => setIdentity({ title: e.target.value })}
                placeholder="Design Technologist"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SectionLabel>Location</SectionLabel>
                <input
                  type="text"
                  value={f.identity.location}
                  onChange={e => setIdentity({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div>
                <SectionLabel>Age</SectionLabel>
                <input
                  type="number"
                  min={13}
                  max={100}
                  value={f.identity.age ?? ''}
                  onChange={e => setIdentity({ age: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="28"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <SectionLabel>Short bio</SectionLabel>
              <textarea
                rows={4}
                value={f.identity.bio}
                onChange={e => setIdentity({ bio: e.target.value })}
                placeholder="What you build, what you're looking for, and how you like to collaborate."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <SectionLabel>Avatar image URL</SectionLabel>
              <div className="flex items-center gap-3">
                {f.identity.avatar ? (
                  <img src={f.identity.avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-stone-200" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-400">
                    {f.identity.name.trim().charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <input
                  type="url"
                  value={f.identity.avatar}
                  onChange={e => setIdentity({ avatar: e.target.value })}
                  placeholder="https://…"
                  className={`${inputClass} flex-1`}
                />
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => {
              const active = f.connectionGoals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setF({ ...f, connectionGoals: toggle(f.connectionGoals, g.id) as ConnectionGoal[] })}
                  className={`h-24 rounded-2xl text-sm text-left p-4 border transition-all ${
                    active
                      ? 'border-[#D97706] bg-[#D97706]/10 text-[#92400E] font-semibold'
                      : 'border-transparent bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            {INTEREST_GROUPS.map(grp => (
              <div key={grp.group}>
                <SectionLabel>{grp.group}</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {grp.items.map(item => (
                    <Pill
                      key={item}
                      active={f.interests.includes(item)}
                      onClick={() => setF({ ...f, interests: toggle(f.interests, item, 10) })}
                    >
                      {item}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'values':
        return (
          <div className="flex flex-wrap gap-2">
            {VALUES.map(v => (
              <Pill key={v} active={f.values.includes(v)} onClick={() => setF({ ...f, values: toggle(f.values, v, 5) })}>
                {v}
              </Pill>
            ))}
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Preferred channels</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.channels.includes(c)}
                    onClick={() => setF({ ...f, communication: { ...f.communication, channels: toggle(f.communication.channels, c) } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Conversation preference</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CONVO.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.conversationPreference === c}
                    onClick={() => setF({ ...f, communication: { ...f.communication, conversationPreference: c } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Reply speed</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {REPLY.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.replySpeed === c}
                    onClick={() => setF({ ...f, communication: { ...f.communication, replySpeed: c } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        );

      case 'personality':
        return (
          <div className="space-y-5">
            {OCEAN_ITEMS.map(item => (
              <div key={String(item.key)}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <div className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{item.hint}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{f.ocean[item.key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={f.ocean[item.key]}
                  onChange={e => setF({ ...f, ocean: { ...f.ocean, [item.key]: parseInt(e.target.value) } })}
                  className="w-full"
                  style={{ accentColor: item.color }}
                />
              </div>
            ))}
          </div>
        );

      case 'complementarity':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Your team role</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TEAM_ROLES.map(r => (
                  <Pill key={r} active={f.complementarity.teamRole === r} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, teamRole: r } })}>{r}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Skills you bring</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <Pill key={s} active={f.complementarity.skills.includes(s)} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, skills: toggle(f.complementarity.skills, s) } })}>{s}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>In a creative process you are</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CREATIVITY_ROLES.map(s => (
                  <Pill key={s} active={f.complementarity.creativityRole === s} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, creativityRole: s } })}>{s}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Experience level</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE.map(s => (
                  <Pill key={s} active={f.complementarity.experienceLevel === s} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, experienceLevel: s } })}>{s}</Pill>
                ))}
              </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Sleep schedule</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SLEEP.map(s => <Pill key={s} active={f.lifestyle.sleepSchedule === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, sleepSchedule: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Exercise frequency</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {EXERCISE.map(s => <Pill key={s} active={f.lifestyle.exerciseFrequency === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, exerciseFrequency: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Work style</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {WORK_STYLE.map(s => <Pill key={s} active={f.lifestyle.workStyle === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, workStyle: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Social energy</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_ENERGY.map(s => <Pill key={s} active={f.lifestyle.socialEnergy === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, socialEnergy: s } })}>{s}</Pill>)}
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Days</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(d => <Pill key={d} active={f.availability.days.includes(d)} onClick={() => setF({ ...f, availability: { ...f.availability, days: toggle(f.availability.days, d) } })}>{d}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Time blocks</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TIME_BLOCKS.map(d => <Pill key={d} active={f.availability.timeBlocks.includes(d)} onClick={() => setF({ ...f, availability: { ...f.availability, timeBlocks: toggle(f.availability.timeBlocks, d) } })}>{d}</Pill>)}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Hours available per week</span>
                <span className="text-[#D97706]">{f.availability.hoursPerWeek} hrs</span>
              </div>
              <input
                type="range" min={1} max={40}
                value={f.availability.hoursPerWeek}
                onChange={e => setF({ ...f, availability: { ...f.availability, hoursPerWeek: parseInt(e.target.value) } })}
                className="w-full accent-[#D97706]"
              />
            </div>
          </div>
        );

      case 'constraints':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Languages you can connect in</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <Pill key={l} active={f.constraints.languages.includes(l)} onClick={() => setF({ ...f, constraints: { ...f.constraints, languages: toggle(f.constraints.languages, l) } })}>{l}</Pill>
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-2">No shared language eliminates a match entirely.</p>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Age preference</span>
                <span className="text-[#D97706]">{f.constraints.minAge}–{f.constraints.maxAge}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="range" min={18} max={80} value={f.constraints.minAge}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, minAge: Math.min(parseInt(e.target.value), f.constraints.maxAge) } })}
                  className="w-full accent-[#D97706]" />
                <input type="range" min={18} max={80} value={f.constraints.maxAge}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, maxAge: Math.max(parseInt(e.target.value), f.constraints.minAge) } })}
                  className="w-full accent-[#D97706]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Distance preference</span>
                <span className="text-[#D97706]">{f.constraints.maxDistanceKm} km</span>
              </div>
              <input type="range" min={5} max={500} step={5} value={f.constraints.maxDistanceKm}
                onChange={e => setF({ ...f, constraints: { ...f.constraints, maxDistanceKm: parseInt(e.target.value) } })}
                className="w-full accent-[#D97706]" />
              <label className="flex items-center gap-2 mt-3 text-sm text-stone-600">
                <input type="checkbox" checked={f.constraints.locationFlexible}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, locationFlexible: e.target.checked } })}
                  className="accent-[#D97706] w-4 h-4" />
                Remote-friendly — distance is a soft penalty, not a hard filter
              </label>
            </div>
          </div>
        );

      case 'review': {
        const rows: [string, string][] = [
          ['Identity', [f.identity.name, f.identity.title, f.identity.location, f.identity.age ? `${f.identity.age}` : ''].filter(Boolean).join(' · ') || '—'],
          ['Connection goals', f.connectionGoals.map(g => GOALS.find(x => x.id === g)?.label).join(', ') || '—'],
          ['Interests (30%)', f.interests.join(', ') || '—'],
          ['Values (15%)', f.values.join(', ') || '—'],
          ['Communication (15%)', [f.communication.conversationPreference, f.communication.replySpeed, ...f.communication.channels].filter(Boolean).join(' · ') || '—'],
          ['Personality (25%)', OCEAN_ITEMS.map(i => `${i.label.slice(0, 4)} ${f.ocean[i.key]}`).join(' · ')],
          ['Complementarity', [f.complementarity.teamRole, f.complementarity.experienceLevel, ...f.complementarity.skills].filter(Boolean).join(' · ') || '—'],
          ['Lifestyle (10%)', Object.values(f.lifestyle).filter(Boolean).join(' · ') || '—'],
          ['Availability (5%)', [...f.availability.days, ...f.availability.timeBlocks, `${f.availability.hoursPerWeek} hrs/wk`].join(' · ')],
          ['Constraints', `${f.constraints.languages.join(', ') || '—'} · ${f.constraints.minAge}–${f.constraints.maxAge} · ${f.constraints.maxDistanceKm} km`],
        ];
        return (
          <div className="space-y-3">
            {rows.map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{k}</div>
                <div className="text-sm text-stone-800 mt-0.5 break-words">{v}</div>
              </div>
            ))}
            <p className="text-xs text-stone-500 pt-1">
              Compatibility = Similarity × Complementarity − Constraint penalties. Weights are configurable per connection type.
            </p>
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-lg sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <button onClick={back} className="text-stone-700 p-1 -ml-1" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 h-1 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-[#D97706] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          {step.skippable ? (
            <button onClick={next} className="text-sm font-semibold text-stone-500 hover:text-stone-800">Skip</button>
          ) : (
            <button onClick={onClose} className="text-sm font-semibold text-stone-400 hover:text-stone-700">Close</button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <h2 className="text-3xl font-bold text-stone-900 leading-tight tracking-tight">{step.title}</h2>
          <p className="text-sm text-stone-500 mt-1.5 mb-6">{step.subtitle}</p>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 bg-white border-t border-stone-100">
          <button
            onClick={next}
            disabled={!canContinue}
            className={`w-full py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              canContinue ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {stepIndex === STEPS.length - 1 ? (<><Check className="w-4 h-4" /> Finish & score my matches</>) : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
