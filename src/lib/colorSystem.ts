export interface ColorIdentity {
  primaryName: string;
  primaryColor: string; // Hex
  secondaryName: string;
  secondaryColor: string;
  harmonicTitle: string;
  gradientClass: string;
  bgGradient: string;
  auraClass: string;
  toneDescription: string;
  spectrumBars: { name: string; color: string; intensity: 'Full Luminous' | 'Deep Radiance' | 'Vibrant Tone' | 'Soft Aura' }[];
}

export const COLOR_PROFILES: Record<string, ColorIdentity> = {
  'user-current-alex': {
    primaryName: 'Solar Gold',
    primaryColor: '#D97706',
    secondaryName: 'Deep Teal',
    secondaryColor: '#0A6275',
    harmonicTitle: 'Solar Gold × Deep Teal Harmonic',
    gradientClass: 'from-[#D97706] via-[#0A6275] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(10,98,117,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-amber-500/20 text-amber-900 border-amber-500/30',
    toneDescription: 'Luminous Solar Energy grounded with Oceanic Teal depth and Emerald resonance.',
    spectrumBars: [
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Vibrant Tone' }
    ]
  },
  'user-sam-reed': {
    primaryName: 'Oceanic Teal',
    primaryColor: '#0A6275',
    secondaryName: 'Royal Amethyst',
    secondaryColor: '#7C3AED',
    harmonicTitle: 'Teal & Amethyst Synthesis',
    gradientClass: 'from-[#0A6275] via-[#7C3AED] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.15) 0%, rgba(124,58,237,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-teal-500/20 text-teal-900 border-teal-500/30',
    toneDescription: 'Deep cognitive cyan frequency with violet analytical clarity.',
    spectrumBars: [
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Soft Aura' }
    ]
  },
  'user-elias-thorne': {
    primaryName: 'Solar Amber',
    primaryColor: '#B45309',
    secondaryName: 'Electric Indigo',
    secondaryColor: '#312E81',
    harmonicTitle: 'Amber & Cobalt Matrix',
    gradientClass: 'from-[#B45309] via-[#4338CA] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(180,83,9,0.15) 0%, rgba(67,56,202,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-amber-600/20 text-amber-950 border-amber-600/30',
    toneDescription: 'High-voltage amber execution paired with impenetrable cobalt foundation.',
    spectrumBars: [
      { name: 'Solar Amber', color: '#B45309', intensity: 'Full Luminous' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Electric Indigo', color: '#4338CA', intensity: 'Deep Radiance' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Vibrant Tone' }
    ]
  },
  'user-aria-vance': {
    primaryName: 'Verdant Emerald',
    primaryColor: '#059669',
    secondaryName: 'Royal Purple',
    secondaryColor: '#8B5CF6',
    harmonicTitle: 'Emerald & Violet Prism',
    gradientClass: 'from-[#059669] via-[#8B5CF6] to-[#0A6275]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(10,98,117,0.05) 100%)',
    auraClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-500/30',
    toneDescription: 'Pure ethical green resonance woven with visionary violet intuition.',
    spectrumBars: [
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Purple', color: '#8B5CF6', intensity: 'Deep Radiance' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Solar Amber', color: '#D97706', intensity: 'Soft Aura' }
    ]
  },
  'user-julian-cross': {
    primaryName: 'Solar Gold',
    primaryColor: '#EA580C',
    secondaryName: 'Ruby Coral',
    secondaryColor: '#E11D48',
    harmonicTitle: 'Solar Orange & Coral Pulse',
    gradientClass: 'from-[#EA580C] via-[#E11D48] to-[#D97706]',
    bgGradient: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, rgba(225,29,72,0.1) 50%, rgba(217,119,6,0.05) 100%)',
    auraClass: 'bg-orange-500/20 text-orange-950 border-orange-500/30',
    toneDescription: 'Dynamic orange momentum and fiery coral operational drive.',
    spectrumBars: [
      { name: 'Solar Orange', color: '#EA580C', intensity: 'Full Luminous' },
      { name: 'Ruby Coral', color: '#E11D48', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Soft Aura' }
    ]
  },
  'user-elena-rostova': {
    primaryName: 'Royal Purple',
    primaryColor: '#7C3AED',
    secondaryName: 'Oceanic Teal',
    secondaryColor: '#0891B2',
    harmonicTitle: 'Purple & Cyan Cognitive Arc',
    gradientClass: 'from-[#7C3AED] via-[#0891B2] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(8,145,178,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-purple-500/20 text-purple-950 border-purple-500/30',
    toneDescription: 'Deep mystical purple neural intelligence intersecting cool cyan logic.',
    spectrumBars: [
      { name: 'Royal Purple', color: '#7C3AED', intensity: 'Full Luminous' },
      { name: 'Deep Cyan', color: '#0891B2', intensity: 'Full Luminous' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Deep Radiance' },
      { name: 'Solar Amber', color: '#D97706', intensity: 'Soft Aura' }
    ]
  },
  'user-marcus-chen': {
    primaryName: 'Amethyst Violet',
    primaryColor: '#9333EA',
    secondaryName: 'Verdant Mint',
    secondaryColor: '#10B981',
    harmonicTitle: 'Violet & Emerald Luminescence',
    gradientClass: 'from-[#9333EA] via-[#10B981] to-[#F59E0B]',
    bgGradient: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(16,185,129,0.1) 50%, rgba(245,158,11,0.05) 100%)',
    auraClass: 'bg-fuchsia-500/20 text-fuchsia-950 border-fuchsia-500/30',
    toneDescription: 'Vibrant artistic violet imagination counterbalanced by mint green harmony.',
    spectrumBars: [
      { name: 'Amethyst Violet', color: '#9333EA', intensity: 'Full Luminous' },
      { name: 'Verdant Mint', color: '#10B981', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#F59E0B', intensity: 'Vibrant Tone' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Soft Aura' }
    ]
  },
  'user-sophie-dubois': {
    primaryName: 'Verdant Mint',
    primaryColor: '#10B981',
    secondaryName: 'Oceanic Cyan',
    secondaryColor: '#06B6D4',
    harmonicTitle: 'Mint & Cyan Tactile Wave',
    gradientClass: 'from-[#10B981] via-[#06B6D4] to-[#0A6275]',
    bgGradient: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 50%, rgba(10,98,117,0.05) 100%)',
    auraClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-500/30',
    toneDescription: 'Luminous mint cognitive harmony woven with tactile cyan resonance.',
    spectrumBars: [
      { name: 'Verdant Mint', color: '#10B981', intensity: 'Full Luminous' },
      { name: 'Oceanic Cyan', color: '#06B6D4', intensity: 'Deep Radiance' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' }
    ]
  },
  'user-tariq-al-mansoor': {
    primaryName: 'Cobalt Blue',
    primaryColor: '#1D4ED8',
    secondaryName: 'Solar Gold',
    secondaryColor: '#D97706',
    harmonicTitle: 'Cobalt & Gold High-Throughput Matrix',
    gradientClass: 'from-[#1D4ED8] via-[#D97706] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, rgba(217,119,6,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-blue-600/20 text-blue-950 border-blue-600/30',
    toneDescription: 'High-resilience cobalt infrastructure powered by solar delivery drive.',
    spectrumBars: [
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Deep Radiance' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Soft Aura' }
    ]
  },
  'user-kenji-sato': {
    primaryName: 'Deep Teal',
    primaryColor: '#0A6275',
    secondaryName: 'Verdant Emerald',
    secondaryColor: '#059669',
    harmonicTitle: 'Teal & Emerald Spatial Canvas',
    gradientClass: 'from-[#0A6275] via-[#059669] to-[#7C3AED]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.15) 0%, rgba(5,150,105,0.1) 50%, rgba(124,58,237,0.05) 100%)',
    auraClass: 'bg-teal-600/20 text-teal-950 border-teal-600/30',
    toneDescription: 'Deep spatial teal coordinates merged with emerald clarity and violet optics.',
    spectrumBars: [
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Purple', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' }
    ]
  },
  'user-chloe-lin': {
    primaryName: 'Verdant Rose',
    primaryColor: '#059669',
    secondaryName: 'Rose Quartz',
    secondaryColor: '#E11D48',
    harmonicTitle: 'Verdant & Rose Empathic Arc',
    gradientClass: 'from-[#059669] via-[#E11D48] to-[#0A6275]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, rgba(225,29,72,0.1) 50%, rgba(10,98,117,0.05) 100%)',
    auraClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-500/30',
    toneDescription: 'Deep emotional empathy paired with rose warmth and thoughtful contemplative presence.',
    spectrumBars: [
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Rose Coral', color: '#E11D48', intensity: 'Deep Radiance' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Solar Amber', color: '#D97706', intensity: 'Soft Aura' }
    ]
  },
  'user-mateo-silva': {
    primaryName: 'Solar Emerald',
    primaryColor: '#10B981',
    secondaryName: 'Solar Amber',
    secondaryColor: '#D97706',
    harmonicTitle: 'Emerald & Amber Kinetic Vector',
    gradientClass: 'from-[#10B981] via-[#D97706] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(217,119,6,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-500/30',
    toneDescription: 'High vitality green stamina and kinetic amber agility for outdoor expeditions.',
    spectrumBars: [
      { name: 'Verdant Mint', color: '#10B981', intensity: 'Full Luminous' },
      { name: 'Solar Amber', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Vibrant Tone' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Soft Aura' }
    ]
  },
  'user-maya-patel': {
    primaryName: 'Oceanic Cobalt',
    primaryColor: '#0A6275',
    secondaryName: 'Royal Amethyst',
    secondaryColor: '#7C3AED',
    harmonicTitle: 'Teal & Amethyst Executive Anchor',
    gradientClass: 'from-[#0A6275] via-[#7C3AED] to-[#1D4ED8]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.15) 0%, rgba(124,58,237,0.1) 50%, rgba(29,78,216,0.05) 100%)',
    auraClass: 'bg-teal-600/20 text-teal-950 border-teal-600/30',
    toneDescription: 'Steadfast oceanic leadership with visionary violet mentorship insight.',
    spectrumBars: [
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Vibrant Tone' }
    ]
  },
  'user-zara-novak': {
    primaryName: 'Solar Gold',
    primaryColor: '#F59E0B',
    secondaryName: 'Royal Amethyst',
    secondaryColor: '#8B5CF6',
    harmonicTitle: 'Solar & Amethyst Velocity Matrix',
    gradientClass: 'from-[#F59E0B] via-[#8B5CF6] to-[#0A6275]',
    bgGradient: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(10,98,117,0.05) 100%)',
    auraClass: 'bg-amber-500/20 text-amber-950 border-amber-500/30',
    toneDescription: 'Hyper-velocity solar gold execution fused with lateral agentic innovation.',
    spectrumBars: [
      { name: 'Solar Gold', color: '#F59E0B', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#8B5CF6', intensity: 'Full Luminous' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  }
};

export interface ChromaticTestScores {
  solar: number;     // Execution Velocity & Drive (Gold/Amber)
  teal: number;      // Systems Architecture & Logic (Cyan/Teal)
  emerald: number;   // Empathic Resonance & Team Trust (Green/Mint)
  amethyst: number;  // Visionary Synthesis & Lateral Discovery (Violet/Purple)
  cobalt: number;    // Deterministic Stability & Infrastructure (Blue/Indigo)
}

export interface ChromaticAssessmentResult {
  scores: ChromaticTestScores;
  primaryKey: keyof ChromaticTestScores;
  secondaryKey: keyof ChromaticTestScores;
  archetypeName: string;
  archetypeTagline: string;
  archetypeDescription: string;
  superpower: string;
  blindspot: string;
  idealPartners: string[];
  identity: ColorIdentity;
}

const COLOR_CHANNEL_META: Record<keyof ChromaticTestScores, { name: string; hex: string; oklchHue: number }> = {
  solar: { name: 'Solar Gold', hex: '#D97706', oklchHue: 75 },
  teal: { name: 'Oceanic Teal', hex: '#0A6275', oklchHue: 195 },
  emerald: { name: 'Verdant Emerald', hex: '#059669', oklchHue: 155 },
  amethyst: { name: 'Royal Amethyst', hex: '#7C3AED', oklchHue: 290 },
  cobalt: { name: 'Cobalt Blue', hex: '#1D4ED8', oklchHue: 245 },
};

export function computeAssessmentResult(scores: ChromaticTestScores): ChromaticAssessmentResult {
  // Sort entries descending to find primary & secondary channels
  const entries = (Object.entries(scores) as [keyof ChromaticTestScores, number][])
    .sort((a, b) => b[1] - a[1]);

  const primaryKey = entries[0][0];
  const secondaryKey = entries[1][0];

  const prim = COLOR_CHANNEL_META[primaryKey];
  const sec = COLOR_CHANNEL_META[secondaryKey];

  // Map to Archetypes
  let archetypeName = 'The Solar Catalyst';
  let archetypeTagline = 'High-velocity execution and proactive unblocking';
  let archetypeDescription = 'You operate as a dynamic catalyst, translating abstract vision into concrete shipped artifacts with extraordinary momentum.';
  let superpower = 'Fierce execution velocity and rapid unblocking';
  let blindspot = 'Occasional impatience with long architecture deliberations';
  let idealPartners = ['Oceanic Teal (Architects)', 'Cobalt Blue (Reliability Guardians)'];

  if (primaryKey === 'teal') {
    archetypeName = 'The Oceanic Architect';
    archetypeTagline = 'Deep systems architecture and mathematical logic';
    archetypeDescription = 'You thrive on decomposing complex ambiguity into clean, resilient, self-healing systems and structured models.';
    superpower = 'Structural foresight and deterministic system modeling';
    blindspot = 'Risk of over-engineering before market validation';
    idealPartners = ['Solar Gold (High-Velocity Builders)', 'Verdant Emerald (People Leaders)'];
  } else if (primaryKey === 'emerald') {
    archetypeName = 'The Verdant Mediator';
    archetypeTagline = 'Empathic resonance, team equilibrium, and psychological safety';
    archetypeDescription = 'You foster high-trust environments where cross-functional friction dissolves and diverse minds achieve collective flow.';
    superpower = 'Deep interpersonal resonance and collaborative cohesion';
    blindspot = 'Can hesitate when tough, unpopular executive cuts are required';
    idealPartners = ['Solar Gold (Decisive Drivers)', 'Oceanic Teal (System Thinkers)'];
  } else if (primaryKey === 'amethyst') {
    archetypeName = 'The Violet Visionary';
    archetypeTagline = 'Frontier synthesis, lateral connections, and cross-domain invention';
    archetypeDescription = 'You perceive latent patterns across disparate fields, synthesizing visionary concepts that redefine category boundaries.';
    superpower = 'Breakthrough conceptual synthesis and rapid mental modeling';
    blindspot = 'Can lose interest once the initial frontier problem is solved';
    idealPartners = ['Cobalt Blue (Execution Anchors)', 'Oceanic Teal (Formal Builders)'];
  } else if (primaryKey === 'cobalt') {
    archetypeName = 'The Cobalt Anchor';
    archetypeTagline = 'Deterministic reliability, process rigor, and infrastructure resilience';
    archetypeDescription = 'You are the foundational cornerstone of any mission, ensuring 99.99% operational continuity and rock-solid execution discipline.';
    superpower = 'Fault-tolerant execution and operational governance';
    blindspot = 'Skepticism toward radically speculative or unproven paradigms';
    idealPartners = ['Royal Amethyst (Frontier Innovators)', 'Solar Gold (Momentum Drivers)'];
  }

  // Composite hybrid titles if secondary is strong (> 60% of primary)
  const isHybrid = entries[1][1] >= entries[0][1] * 0.75;
  const harmonicTitle = isHybrid 
    ? `${prim.name} × ${sec.name} Synthesis`
    : `${prim.name} Radiance`;

  const spectrumBars = entries.map(([key, score]) => {
    const meta = COLOR_CHANNEL_META[key];
    let intensity: 'Full Luminous' | 'Deep Radiance' | 'Vibrant Tone' | 'Soft Aura' = 'Soft Aura';
    if (score >= 80) intensity = 'Full Luminous';
    else if (score >= 60) intensity = 'Deep Radiance';
    else if (score >= 40) intensity = 'Vibrant Tone';
    return {
      name: meta.name,
      color: meta.hex,
      intensity
    };
  });

  const auraClass = primaryKey === 'solar'
    ? 'bg-amber-500/20 text-amber-900 border-amber-500/30'
    : primaryKey === 'teal'
    ? 'bg-teal-500/20 text-teal-900 border-teal-500/30'
    : primaryKey === 'emerald'
    ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/30'
    : primaryKey === 'amethyst'
    ? 'bg-purple-500/20 text-purple-900 border-purple-500/30'
    : 'bg-blue-600/20 text-blue-900 border-blue-600/30';

  const identity: ColorIdentity = {
    primaryName: prim.name,
    primaryColor: prim.hex,
    secondaryName: sec.name,
    secondaryColor: sec.hex,
    harmonicTitle,
    gradientClass: `from-[${prim.hex}] via-[${sec.hex}] to-[#059669]`,
    bgGradient: `radial-gradient(circle, ${prim.hex}26 0%, ${sec.hex}1A 50%, rgba(5,150,105,0.05) 100%)`,
    auraClass,
    toneDescription: `${archetypeName}: ${archetypeTagline}. Primary resonance in ${prim.name} backed by ${sec.name}.`,
    spectrumBars
  };

  return {
    scores,
    primaryKey,
    secondaryKey,
    archetypeName,
    archetypeTagline,
    archetypeDescription,
    superpower,
    blindspot,
    idealPartners,
    identity
  };
}

export function saveUserCustomColorIdentity(userId: string, identity: ColorIdentity) {
  try {
    localStorage.setItem(`matchwise_custom_color_${userId}`, JSON.stringify(identity));
  } catch {
    // ignore
  }
}

export function getColorIdentity(userId: string): ColorIdentity {
  try {
    const custom = localStorage.getItem(`matchwise_custom_color_${userId}`);
    if (custom) {
      return JSON.parse(custom);
    }
  } catch {
    // fallback
  }

  return COLOR_PROFILES[userId] || {
    primaryName: 'Solar Gold',
    primaryColor: '#D97706',
    secondaryName: 'Deep Teal',
    secondaryColor: '#0A6275',
    harmonicTitle: 'Solar-Teal Harmony',
    gradientClass: 'from-[#D97706] via-[#0A6275] to-[#059669]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(10,98,117,0.1) 50%, rgba(5,150,105,0.05) 100%)',
    auraClass: 'bg-amber-500/20 text-amber-900 border-amber-500/30',
    toneDescription: 'Harmonic multi-chromatic spectrum blend.',
    spectrumBars: [
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Deep Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Verdant Green', color: '#059669', intensity: 'Vibrant Tone' },
      { name: 'Royal Purple', color: '#7C3AED', intensity: 'Soft Aura' }
    ]
  };
}

export function getPairwiseColorHarmonics(userAId: string, userBId: string) {
  const colA = getColorIdentity(userAId);
  const colB = getColorIdentity(userBId);

  return {
    title: `${colA.primaryName} × ${colB.primaryName} Harmonic`,
    subLabel: `Chromatic Synthesis of ${colA.primaryName} & ${colB.primaryName}`,
    colorA: colA.primaryColor,
    nameA: colA.primaryName,
    colorB: colB.primaryColor,
    nameB: colB.primaryName,
    gradient: `linear-gradient(135deg, ${colA.primaryColor}, ${colB.primaryColor})`,
    resonanceLayers: [
      { name: `${colA.primaryName} Wave`, color: colA.primaryColor, tone: 'Luminous Resonance' },
      { name: `${colB.primaryName} Focus`, color: colB.primaryColor, tone: 'Deep Harmonic' },
      { name: 'Verdant Emerald Sync', color: '#059669', tone: 'Pure Balance' },
      { name: 'Royal Violet Arc', color: '#7C3AED', tone: 'Intuitive Synthesis' }
    ]
  };
}

/* ------------------------------------------------------------------
 * Profile-derived chromatic identity
 * Colors come from the user's own profile scores (execution / capability /
 * resonance) + OCEAN traits — not from a static id lookup table.
 * ----------------------------------------------------------------- */

type ChannelSeed = { name: string; color: string; value: number };

function intensityFor(value: number): ColorIdentity['spectrumBars'][number]['intensity'] {
  if (value >= 80) return 'Full Luminous';
  if (value >= 60) return 'Deep Radiance';
  if (value >= 40) return 'Vibrant Tone';
  return 'Soft Aura';
}

export function deriveColorIdentityFromProfile(profile: {
  executionScore?: number;
  capabilityScore?: number;
  resonanceScore?: number;
  ocean?: { openness?: number; conscientiousness?: number; extraversion?: number; agreeableness?: number; neuroticism?: number };
}): ColorIdentity {
  const execution = Math.max(0, Math.min(100, profile.executionScore ?? 50));
  const capability = Math.max(0, Math.min(100, profile.capabilityScore ?? 50));
  const resonance = Math.max(0, Math.min(100, profile.resonanceScore ?? 50));
  const openness = Math.max(0, Math.min(100, profile.ocean?.openness ?? 50));

  const seeds: ChannelSeed[] = [
    { name: 'Solar Gold', color: '#D97706', value: execution },
    { name: 'Deep Teal', color: '#0A6275', value: capability },
    { name: 'Verdant Emerald', color: '#059669', value: resonance },
    { name: 'Royal Amethyst', color: '#7C3AED', value: openness },
  ];

  const ranked = [...seeds].sort((a, b) => b.value - a.value);
  const primary = ranked[0];
  const secondary = ranked[1];
  const tertiary = ranked[2];

  const hexToRgb = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [pr, pg, pb] = hexToRgb(primary.color);
  const [sr, sg, sb] = hexToRgb(secondary.color);
  const [tr, tg, tb] = hexToRgb(tertiary.color);

  const spread = primary.value - ranked[3].value;
  const toneDescription =
    spread < 12
      ? `Evenly balanced spectrum — ${primary.name.toLowerCase()} and ${secondary.name.toLowerCase()} share the light.`
      : `${primary.name} leads at ${Math.round(primary.value)}, anchored by ${secondary.name} (${Math.round(secondary.value)}) and ${tertiary.name} (${Math.round(tertiary.value)}).`;

  return {
    primaryName: primary.name,
    primaryColor: primary.color,
    secondaryName: secondary.name,
    secondaryColor: secondary.color,
    harmonicTitle: `${primary.name} × ${secondary.name} Harmonic`,
    gradientClass: `from-[${primary.color}] via-[${secondary.color}] to-[${tertiary.color}]`,
    bgGradient: `radial-gradient(circle, rgba(${pr},${pg},${pb},0.18) 0%, rgba(${sr},${sg},${sb},0.12) 50%, rgba(${tr},${tg},${tb},0.06) 100%)`,
    auraClass: 'bg-stone-500/10 text-stone-900 border-stone-400/30',
    toneDescription,
    spectrumBars: ranked.map((s) => ({
      name: s.name,
      color: s.color,
      intensity: intensityFor(s.value),
    })),
  };
}
