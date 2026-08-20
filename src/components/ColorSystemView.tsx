import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Sparkles, 
  Brain, 
  Sliders, 
  ArrowRight, 
  Check, 
  Info 
} from 'lucide-react';

interface Archetype {
  id: string;
  name: string;
  title: string;
  primaryColor: string;
  secondaryColor: string;
  gradientClass: string;
  bgGradient: string;
  tagline: string;
  behaviorSummary: string;
  cadence: {
    communication: string;
    velocity: string;
    riskProfile: string;
    decisionMaking: string;
  };
  oceanProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    stability: number;
  };
  strengths: string[];
  blindspots: string[];
  optimalCounterpart: string;
}

const CHROMATIC_ARCHETYPES: Archetype[] = [
  {
    id: 'solar-catalyst',
    name: 'The Solar Catalyst',
    title: 'High-Velocity Execution Driver',
    primaryColor: '#D97706',
    secondaryColor: '#EA580C',
    gradientClass: 'from-[#D97706] to-[#EA580C]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(234,88,12,0.08) 100%)',
    tagline: 'Translates ambiguity into tangible velocity within hours.',
    behaviorSummary: 'Possesses exceptional directive agency and bias for shipping. Excels at unblocking stalled initiatives, driving sprint deadlines, and turning abstract strategies into running software.',
    cadence: {
      communication: 'Direct, synchronous-friendly, punchy summaries',
      velocity: 'Rapid iterative cycles (hours to days)',
      riskProfile: 'High experimental risk tolerance',
      decisionMaking: 'Intuitive execution grounded in immediate feedback'
    },
    oceanProfile: {
      openness: 72,
      conscientiousness: 88,
      extraversion: 78,
      agreeableness: 65,
      stability: 82
    },
    strengths: ['0-to-1 Momentum', 'Unblocking Teams', 'Bias for Action', 'Decisive Prioritization'],
    blindspots: ['May bypass edge-case documentation', 'Impatient with prolonged consensus'],
    optimalCounterpart: 'The Oceanic Architect (Deep Teal) to ensure structural longevity'
  },
  {
    id: 'oceanic-architect',
    name: 'The Oceanic Architect',
    title: 'Systems & Cognitive Theorist',
    primaryColor: '#0A6275',
    secondaryColor: '#0891B2',
    gradientClass: 'from-[#0A6275] to-[#0891B2]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.15) 0%, rgba(8,145,178,0.08) 100%)',
    tagline: 'Builds fault-tolerant abstractions designed to scale for decades.',
    behaviorSummary: 'Characterized by high analytical bandwidth and structural precision. Prefers deep async memos, formal system specifications, and meticulous root-cause investigations.',
    cadence: {
      communication: 'Async-first, structured technical memos, thorough PR reviews',
      velocity: 'Calculated, high-fidelity long-range cycles',
      riskProfile: 'Measured, mathematically bounded risk',
      decisionMaking: 'First-principles analytical synthesis'
    },
    oceanProfile: {
      openness: 86,
      conscientiousness: 94,
      extraversion: 45,
      agreeableness: 72,
      stability: 88
    },
    strengths: ['Distributed Architecture', 'Fault-Tolerant Schemas', 'Root-Cause Analysis', 'Deep async documentation'],
    blindspots: ['Risk of over-engineering early prototypes', 'Slower initial momentum'],
    optimalCounterpart: 'The Solar Catalyst (Solar Gold) to accelerate time-to-market'
  },
  {
    id: 'verdant-mediator',
    name: 'The Verdant Mediator',
    title: 'Ethical & Psychological Anchor',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    gradientClass: 'from-[#059669] to-[#10B981]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, rgba(16,185,129,0.08) 100%)',
    tagline: 'Maintains psychological safety and ethical congruence under extreme stress.',
    behaviorSummary: 'The emotional and cultural bedrock of high-performing collectives. Excels at active listening, de-escalating friction, facilitating consensus, and safeguarding long-term member wellbeing.',
    cadence: {
      communication: 'High-empathy, diplomatic, bilateral check-ins',
      velocity: 'Steady, sustainable, burnout-resistant pace',
      riskProfile: 'Human-centric cautious risk',
      decisionMaking: 'Consensus-oriented with long-term ethical horizon'
    },
    oceanProfile: {
      openness: 70,
      conscientiousness: 76,
      extraversion: 68,
      agreeableness: 96,
      stability: 90
    },
    strengths: ['Conflict Resolution', 'Psychological Safety', 'Values Alignment', 'Stakeholder Empathy'],
    blindspots: ['May hesitate to deliver harsh direct critiques', 'Slow to enforce drastic cutbacks'],
    optimalCounterpart: 'The Solar Catalyst or Cobalt Anchor to enforce hard operational constraints'
  },
  {
    id: 'violet-visionary',
    name: 'The Violet Visionary',
    title: 'Lateral Explorer & Paradigm Pioneer',
    primaryColor: '#7C3AED',
    secondaryColor: '#9333EA',
    gradientClass: 'from-[#7C3AED] to-[#9333EA]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(147,51,234,0.08) 100%)',
    tagline: 'Discovers uncharted vectors at the boundary of disparate domains.',
    behaviorSummary: 'Driven by intense intellectual curiosity and lateral pattern matching. Challenges legacy assumptions, anticipates macroeconomic shifts, and conceives novel interface paradigms.',
    cadence: {
      communication: 'Conceptual, visual frameworks, speculative whitepapers',
      velocity: 'Non-linear breakthrough bursts',
      riskProfile: 'Frontier exploratory risk appetite',
      decisionMaking: 'Intuitive pattern synthesis and counter-consensus insights'
    },
    oceanProfile: {
      openness: 98,
      conscientiousness: 65,
      extraversion: 62,
      agreeableness: 74,
      stability: 76
    },
    strengths: ['Novel Product Concepts', 'Cross-Domain Synthesis', 'Zero-to-One Innovation', 'Macro Vision'],
    blindspots: ['May lose interest once routine maintenance begins', 'Can generate too many parallel hypotheses'],
    optimalCounterpart: 'The Cobalt Anchor (Cobalt Blue) to ground breakthrough visions in rock-solid execution'
  },
  {
    id: 'cobalt-anchor',
    name: 'The Cobalt Anchor',
    title: 'High-Resilience Operational Guardian',
    primaryColor: '#1D4ED8',
    secondaryColor: '#312E81',
    gradientClass: 'from-[#1D4ED8] to-[#312E81]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, rgba(49,46,129,0.08) 100%)',
    tagline: 'Upholds zero-defect standards and immutable operational discipline.',
    behaviorSummary: 'The ultimate stabilizer for mission-critical operations. Ensures uptime, security compliance, regression testing, and relentless adherence to contract commitments.',
    cadence: {
      communication: 'Precise, factual, telemetry-backed updates',
      velocity: 'Deterministic, milestone-driven reliability',
      riskProfile: 'Zero-tolerance for unmitigated failure',
      decisionMaking: 'Empirical verification and stress-testing'
    },
    oceanProfile: {
      openness: 60,
      conscientiousness: 98,
      extraversion: 48,
      agreeableness: 70,
      stability: 96
    },
    strengths: ['Zero-Downtime Operations', 'Security & Compliance', 'Stress Resilience', 'Contractual Rigor'],
    blindspots: ['Can be resistant to radical paradigm shifts', 'Heavy process overhead for lightweight tasks'],
    optimalCounterpart: 'The Violet Visionary (Royal Violet) to inject fresh lateral exploration'
  },
  {
    id: 'solar-teal-polymath',
    name: 'The Amber-Teal Polymath',
    title: 'Dual-Engine Product Engineer',
    primaryColor: '#D97706',
    secondaryColor: '#0A6275',
    gradientClass: 'from-[#D97706] to-[#0A6275]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(10,98,117,0.1) 100%)',
    tagline: 'Seamlessly bridges high-speed shipping with architectural integrity.',
    behaviorSummary: 'A rare hybrid capable of drafting distributed systems whitepapers in the morning and shipping polished client-side React code in the afternoon. High autonomy and versatile bandwidth.',
    cadence: {
      communication: 'Adaptive async memos paired with rapid pairing sessions',
      velocity: 'High-velocity sustainable cadence',
      riskProfile: 'Calculated aggressive risk',
      decisionMaking: 'Full-stack pragmatic optimization'
    },
    oceanProfile: {
      openness: 88,
      conscientiousness: 90,
      extraversion: 64,
      agreeableness: 80,
      stability: 86
    },
    strengths: ['Full-Stack Agility', 'Pragmatic Trade-offs', 'Self-Directed Autonomy', 'Technical Leadership'],
    blindspots: ['Risk of bottlenecking work due to excessive solo capacity'],
    optimalCounterpart: 'The Verdant Mediator to ensure team-wide scaling and alignment'
  }
];

const HARMONIC_PAIRS = [
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Oceanic Architect',
    colorB: '#0A6275',
    synergyScore: 96,
    synergyTitle: 'Solar-Oceanic Velocity Engine',
    description: 'The definitive founder combination. Solar drive forces rapid market validation while Oceanic rigor guarantees zero technical debt. Friction is practically non-existent when roles are clearly segmented.',
    frictionRisk: 'Low (Occasional timeline debate over prototype vs perfection)'
  },
  {
    archetypeA: 'The Violet Visionary',
    colorA: '#7C3AED',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 92,
    synergyTitle: 'Vision-To-Infrastructure Bridge',
    description: 'Bridges radical creative breakthrough with rock-solid execution. Visionary generates breakthrough concepts, while Anchor filters, stabilizes, and scales them into enterprise-ready reality.',
    frictionRisk: 'Medium (Requires mutual respect: Visionary must not view Anchor as rigid; Anchor must not dismiss Visionary as chaotic)'
  },
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Verdant Mediator',
    colorB: '#059669',
    synergyScore: 90,
    synergyTitle: 'Harmonic Execution & Culture',
    description: 'Prevents founder burnout and team turnover during intense crunch cycles. Solar provides execution velocity while Verdant safeguards empathy, psychological safety, and collective morale.',
    frictionRisk: 'Low (High mutual appreciation of complementary values)'
  },
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Solar Catalyst',
    colorB: '#EA580C',
    synergyScore: 78,
    synergyTitle: 'Dual Solar Pulse (High Voltage)',
    description: 'Unmatched raw speed, but high potential for overlapping authority. Thrives only when divided strictly across separate sub-domains (e.g. Founder A = Product, Founder B = Go-To-Market).',
    frictionRisk: 'High (Risk of ego collisions and duplicate effort without explicit ownership boundaries)'
  }
];

interface ColorSystemViewProps {
  onOpenChromaticTest?: () => void;
}

export const ColorSystemView: React.FC<ColorSystemViewProps> = ({
  onOpenChromaticTest
}) => {
  const [activeTab, setActiveTab] = useState<'archetypes' | 'simulator' | 'harmonics'>('archetypes');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>(CHROMATIC_ARCHETYPES[0]);
  
  // Interactive Simulator State
  const [simDrive, setSimDrive] = useState(82);       // Solar Gold
  const [simLogic, setSimLogic] = useState(75);       // Deep Teal
  const [simEmpathy, setSimEmpathy] = useState(88);   // Verdant Emerald
  const [simVision, setSimVision] = useState(68);     // Royal Amethyst
  const [simStability, setSimStability] = useState(85); // Cobalt Blue

  // Derived simulator values
  const simulatedColor = useMemo(() => {
    // Determine dominant channel
    const maxVal = Math.max(simDrive, simLogic, simEmpathy, simVision, simStability);
    let primaryName = 'Solar Gold';
    let primaryHex = '#D97706';
    let secondaryName = 'Deep Teal';
    let secondaryHex = '#0A6275';
    let archetypeLabel = 'The Balanced Synthesizer';
    let oklchHue = 45; // Golden amber in OKLCH

    if (maxVal === simDrive) {
      primaryName = 'Solar Gold';
      primaryHex = '#D97706';
      oklchHue = 45;
      if (simLogic > simEmpathy) {
        secondaryName = 'Deep Teal';
        secondaryHex = '#0A6275';
        archetypeLabel = 'Solar-Teal High-Velocity Architect';
      } else {
        secondaryName = 'Verdant Emerald';
        secondaryHex = '#059669';
        archetypeLabel = 'Solar-Verdant Empathetic Catalyst';
      }
    } else if (maxVal === simLogic) {
      primaryName = 'Deep Teal';
      primaryHex = '#0A6275';
      oklchHue = 210;
      secondaryName = simVision > simDrive ? 'Royal Amethyst' : 'Solar Gold';
      secondaryHex = simVision > simDrive ? '#7C3AED' : '#D97706';
      archetypeLabel = 'Oceanic Systems & Cognitive Theorist';
    } else if (maxVal === simEmpathy) {
      primaryName = 'Verdant Emerald';
      primaryHex = '#059669';
      oklchHue = 150;
      secondaryName = simLogic > simDrive ? 'Deep Teal' : 'Solar Gold';
      secondaryHex = simLogic > simDrive ? '#0A6275' : '#D97706';
      archetypeLabel = 'Verdant Ethical & Psychological Mediator';
    } else if (maxVal === simVision) {
      primaryName = 'Royal Amethyst';
      primaryHex = '#7C3AED';
      oklchHue = 295;
      secondaryName = simLogic > simDrive ? 'Deep Teal' : 'Solar Gold';
      secondaryHex = simLogic > simDrive ? '#0A6275' : '#D97706';
      archetypeLabel = 'Violet Lateral Explorer & Frontier Pioneer';
    } else {
      primaryName = 'Cobalt Blue';
      primaryHex = '#1D4ED8';
      oklchHue = 260;
      secondaryName = 'Solar Gold';
      secondaryHex = '#D97706';
      archetypeLabel = 'Cobalt High-Resilience Infrastructure Guardian';
    }

    const lightness = 0.65 + ((simEmpathy + simVision) / 500) * 0.15;
    const chroma = 0.16 + (maxVal / 100) * 0.08;

    return {
      primaryName,
      primaryHex,
      secondaryName,
      secondaryHex,
      archetypeLabel,
      oklchCoords: `oklch(${lightness.toFixed(2)} ${chroma.toFixed(2)} ${oklchHue})`,
      gradient: `linear-gradient(135deg, ${primaryHex}, ${secondaryHex})`,
      bgAura: `radial-gradient(circle, ${primaryHex}25 0%, ${secondaryHex}12 60%, transparent 100%)`
    };
  }, [simDrive, simLogic, simEmpathy, simVision, simStability]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-6 sm:mb-8 relative overflow-hidden">
        {/* Chromatic ambient glow */}
        <div 
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #D97706 0%, #0A6275 40%, #059669 80%, transparent 100%)'
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] text-xs font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>Matchwise Behavioral Chromatics (OKLCH Standard)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            How We Define Human Behavior with Perceptual Color
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Human personality and collaboration chemistry cannot be reduced to a single 1-to-10 rating or a rigid 4-letter box. Matchwise maps cognitive cadence, execution velocity, ethical alignment, and visionary intuition into continuous <strong>OKLCH Perceptual Color Space</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              Solar Gold (Execution)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
              Deep Teal (Systems Logic)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              Verdant Emerald (Empathy)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
              Royal Amethyst (Vision)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
              Cobalt Blue (Resilience)
            </span>
          </div>

          {onOpenChromaticTest && (
            <div className="pt-3">
              <button
                onClick={onOpenChromaticTest}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
                id="colorsystem-take-assessment-btn"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Take Mock Behavioral Test (Determine Your Color)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('archetypes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'archetypes'
              ? 'bg-[#0A6275] text-white shadow-xs'
              : 'bg-teal-50 text-[#0A6275] hover:bg-teal-100'
          }`}
          id="color-tab-archetypes"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Behavioral Archetypes</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-emerald-50 text-[#059669] hover:bg-emerald-100'
          }`}
          id="color-tab-simulator"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Live Color Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('harmonics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'harmonics'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'bg-purple-50 text-[#7C3AED] hover:bg-purple-100'
          }`}
          id="color-tab-harmonics"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synergy & Friction Matrix</span>
        </button>
      </div>

      {/* Behavioral Archetypes Catalog */}
      {activeTab === 'archetypes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          {/* Left: Archetype List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Select Behavioral Profile:
            </h3>
            {CHROMATIC_ARCHETYPES.map((arch) => (
              <button
                key={arch.id}
                onClick={() => setSelectedArchetype(arch)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedArchetype.id === arch.id
                    ? 'bg-white border-stone-900 ring-2 ring-stone-900 shadow-md'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
                id={`arch-select-${arch.id}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0"
                    style={{ backgroundColor: arch.primaryColor }}
                  >
                    {arch.name[4] || 'A'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{arch.name}</h4>
                    <p className="text-[11px] text-stone-500">{arch.title}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${
                  selectedArchetype.id === arch.id ? 'translate-x-1 text-stone-900' : 'text-stone-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Right: Archetype Deep-Dive Detail View */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Banner */}
            <div 
              className="p-6 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between min-h-[140px]"
              style={{
                background: `linear-gradient(135deg, ${selectedArchetype.primaryColor}, ${selectedArchetype.secondaryColor})`
              }}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  CHROMATIC ARCHETYPE DOSSIER
                </span>
                <h2 className="text-2xl font-black mt-2 tracking-tight">{selectedArchetype.name}</h2>
                <p className="text-xs text-white/90 font-medium">{selectedArchetype.title}</p>
              </div>

              <p className="text-xs text-white/80 italic pt-3 border-t border-white/20">
                "{selectedArchetype.tagline}"
              </p>
            </div>

            {/* Behavioral Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Behavioral Core & Operating Mode
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedArchetype.behaviorSummary}
              </p>
            </div>

            {/* Operational Cadence Matrix */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Communication Rhythm</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">{selectedArchetype.cadence.communication}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Velocity Cycle</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">{selectedArchetype.cadence.velocity}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Risk Tolerance</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">{selectedArchetype.cadence.riskProfile}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Decision Protocol</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">{selectedArchetype.cadence.decisionMaking}</span>
              </div>
            </div>

            {/* Strengths and Blindspots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Key Strengths
                </h5>
                <ul className="space-y-1 text-emerald-950 text-[11px]">
                  {selectedArchetype.strengths.map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Potential Blindspots
                </h5>
                <ul className="space-y-1 text-amber-950 text-[11px]">
                  {selectedArchetype.blindspots.map((b, idx) => (
                    <li key={idx}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Optimal Pairing Recommendation */}
            <div className="p-4 rounded-xl bg-stone-900 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
                  Harmonic Complement
                </span>
                <p className="text-xs font-semibold mt-0.5">
                  {selectedArchetype.optimalCounterpart}
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[#D97706] shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Chromatic Simulator */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Interactive Chromatic Behavioral Synthesizer
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Adjust the 5 cognitive vectors to see live real-time synthesis in OKLCH perceptual color space and behavioral archetype prediction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sliders Form */}
            <div className="lg:col-span-7 space-y-5">
              {/* Drive */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    Execution Drive & Momentum (Solar Gold)
                  </span>
                  <span className="text-[#D97706] font-mono">{simDrive}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simDrive}
                  onChange={(e) => setSimDrive(Number(e.target.value))}
                  className="w-full accent-[#D97706] cursor-pointer"
                  id="sim-slider-drive"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Methodical Pace</span>
                  <span>High-Velocity Sprinting</span>
                </div>
              </div>

              {/* Logic */}
              <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
                    Systems Logic & Schema Rigor (Deep Teal)
                  </span>
                  <span className="text-[#0A6275] font-mono">{simLogic}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simLogic}
                  onChange={(e) => setSimLogic(Number(e.target.value))}
                  className="w-full accent-[#0A6275] cursor-pointer"
                  id="sim-slider-logic"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Pragmatic Hacker</span>
                  <span>Formal Systems Architect</span>
                </div>
              </div>

              {/* Empathy */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                    Psychological Safety & Empathy (Verdant Emerald)
                  </span>
                  <span className="text-[#059669] font-mono">{simEmpathy}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simEmpathy}
                  onChange={(e) => setSimEmpathy(Number(e.target.value))}
                  className="w-full accent-[#059669] cursor-pointer"
                  id="sim-slider-empathy"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Direct Task Focus</span>
                  <span>Empathetic Culture Anchor</span>
                </div>
              </div>

              {/* Vision */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                    Lateral Exploration & Vision (Royal Amethyst)
                  </span>
                  <span className="text-[#7C3AED] font-mono">{simVision}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simVision}
                  onChange={(e) => setSimVision(Number(e.target.value))}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                  id="sim-slider-vision"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Linear Incrementalism</span>
                  <span>Radical Paradigm Synthesis</span>
                </div>
              </div>

              {/* Stability */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                    Operational Resilience & Stability (Cobalt Blue)
                  </span>
                  <span className="text-[#1D4ED8] font-mono">{simStability}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simStability}
                  onChange={(e) => setSimStability(Number(e.target.value))}
                  className="w-full accent-[#1D4ED8] cursor-pointer"
                  id="sim-slider-stability"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Flexible Fluidity</span>
                  <span>Immutable Infrastructure Anchor</span>
                </div>
              </div>
            </div>

            {/* Synthesized Output Display */}
            <div className="lg:col-span-5 space-y-6">
              <div 
                className="rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg text-white space-y-6 relative overflow-hidden transition-all duration-300"
                style={{ background: simulatedColor.gradient }}
              >
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs">
                    REAL-TIME OKLCH SYNTHESIS
                  </span>
                  <h3 className="text-2xl font-black tracking-tight pt-2">
                    {simulatedColor.primaryName} × {simulatedColor.secondaryName}
                  </h3>
                  <p className="text-xs text-white/90 font-medium">
                    {simulatedColor.archetypeLabel}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/70">OKLCH Spectrum:</span>
                    <span className="font-bold text-white">{simulatedColor.oklchCoords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Primary Hex:</span>
                    <span className="font-bold text-white">{simulatedColor.primaryHex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Secondary Hex:</span>
                    <span className="font-bold text-white">{simulatedColor.secondaryHex}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 text-xs text-white/90 leading-relaxed">
                  <span className="font-bold block mb-1">Collaborative Footprint:</span>
                  Combines high-luminous {simulatedColor.primaryName} agency with deep {simulatedColor.secondaryName} perspective. Highly effective in distributed agile squads.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Synergy & Friction Matrix */}
      {activeTab === 'harmonics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Pairwise Color Harmonics & Friction Mechanics
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              Just like musical intervals or complementary color wheels, certain personality frequencies create natural resonance while others can produce harmonic dissonance unless managed with conscious role boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HARMONIC_PAIRS.map((pair, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: pair.colorA }} />
                        <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: pair.colorB }} />
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">{pair.synergyTitle}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {pair.synergyScore}% Synergy
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {pair.description}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px]">
                  <span className="font-bold text-stone-700 block mb-0.5">Potential Friction Point:</span>
                  <span className="text-stone-500">{pair.frictionRisk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
