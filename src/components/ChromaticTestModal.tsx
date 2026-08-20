import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Zap, 
  Brain, 
  Scale, 
  Compass, 
  ShieldCheck, 
  Palette,
  X
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  ChromaticTestScores, 
  ChromaticAssessmentResult, 
  computeAssessmentResult, 
  saveUserCustomColorIdentity 
} from '../lib/colorSystem';

interface QuestionOption {
  text: string;
  subtext: string;
  channel: keyof ChromaticTestScores;
  channelName: string;
  color: string;
  points: number;
}

interface TestQuestion {
  id: number;
  category: string;
  title: string;
  prompt: string;
  options: QuestionOption[];
}

const ASSESSMENT_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    category: 'EXECUTION VELOCITY & UNBLOCKING',
    title: 'Tight Deadline Under Ambiguity',
    prompt: 'When your team encounters an unexpected critical blocker 48 hours before an important launch, what is your default operational move?',
    options: [
      {
        channel: 'solar',
        channelName: 'Solar Gold',
        color: '#D97706',
        points: 25,
        text: 'Triage critical paths & ship an immediate unblocker',
        subtext: 'Strip away non-essential features, take direct personal agency, and push a working hotfix into production.'
      },
      {
        channel: 'teal',
        channelName: 'Oceanic Teal',
        color: '#0A6275',
        points: 25,
        text: 'Isolate root architectural causes and refactor cleanly',
        subtext: 'Step back, map out the underlying dependency model, and prevent recurring technical debt.'
      },
      {
        channel: 'emerald',
        channelName: 'Verdant Emerald',
        color: '#059669',
        points: 25,
        text: 'Align team morale, de-escalate tension & build consensus',
        subtext: 'Check in on team burnout, facilitate a psychological reset, and align everyone on a shared recovery plan.'
      },
      {
        channel: 'amethyst',
        channelName: 'Royal Amethyst',
        color: '#7C3AED',
        points: 25,
        text: 'Challenge baseline assumptions with a lateral workaround',
        subtext: 'Flip the problem on its head and invent an unconventional mechanism that completely bypasses the blocker.'
      }
    ]
  },
  {
    id: 2,
    category: 'SYSTEMS ARCHITECTURE & DEPTH',
    title: 'Designing From Scratch',
    prompt: 'When architecting a new core system or collaborative workspace, where does your mind naturally focus first?',
    options: [
      {
        channel: 'teal',
        channelName: 'Oceanic Teal',
        color: '#0A6275',
        points: 25,
        text: 'Modular schemas, data pipelines & formal contracts',
        subtext: 'Ensuring absolute structural integrity, deterministic state flow, and elegant interface boundaries.'
      },
      {
        channel: 'solar',
        channelName: 'Solar Gold',
        color: '#D97706',
        points: 25,
        text: 'Rapid interactive prototyping with instant feedback',
        subtext: 'Getting a raw, functioning MVP into the hands of real users as fast as humanly possible.'
      },
      {
        channel: 'cobalt',
        channelName: 'Cobalt Blue',
        color: '#1D4ED8',
        points: 25,
        text: 'Failover resilience, security policies & SLA guarantees',
        subtext: 'Building hardened infrastructure that guarantees 99.99% uptime and zero catastrophic data loss.'
      },
      {
        channel: 'amethyst',
        channelName: 'Royal Amethyst',
        color: '#7C3AED',
        points: 25,
        text: 'Cross-domain synthesis & category-defining capability',
        subtext: 'Infusing novel paradigms and frontier AI capabilities that create an entirely new competitive advantage.'
      }
    ]
  },
  {
    id: 3,
    category: 'COLLABORATIVE EQUILIBRIUM & CONFLICT',
    title: 'Navigating Divergent Perspectives',
    prompt: 'In a heated strategic disagreement where key collaborators hold opposing opinions, what role do you instinctively play?',
    options: [
      {
        channel: 'emerald',
        channelName: 'Verdant Emerald',
        color: '#059669',
        points: 25,
        text: 'The Empathetic Bridge',
        subtext: 'Translating each person’s core motivations, restoring mutual trust, and guiding the group to win-win alignment.'
      },
      {
        channel: 'solar',
        channelName: 'Solar Gold',
        color: '#D97706',
        points: 25,
        text: 'The Decisive Catalyst',
        subtext: 'Cutting through circular debates, setting a testable hypothesis, and forcing an actionable decision.'
      },
      {
        channel: 'teal',
        channelName: 'Oceanic Teal',
        color: '#0A6275',
        points: 25,
        text: 'The First-Principles Analyst',
        subtext: 'Dissecting arguments against empirical telemetry, mathematical probabilities, and objective criteria.'
      },
      {
        channel: 'cobalt',
        channelName: 'Cobalt Blue',
        color: '#1D4ED8',
        points: 25,
        text: 'The Governance Anchor',
        subtext: 'Evaluating risk exposure, operational compliance, and long-term execution feasibility.'
      }
    ]
  },
  {
    id: 4,
    category: 'FRONTIER EXPLORATION & RISK',
    title: 'Approaching Unproven Frontiers',
    prompt: 'When exploring an emerging technology or ambiguous new market thesis, how do you manage the uncertainty?',
    options: [
      {
        channel: 'amethyst',
        channelName: 'Royal Amethyst',
        color: '#7C3AED',
        points: 25,
        text: 'Embrace experimental ambiguity and follow intuition',
        subtext: 'Run rapid exploratory probes on the bleeding edge to uncover latent emergent opportunities.'
      },
      {
        channel: 'teal',
        channelName: 'Oceanic Teal',
        color: '#0A6275',
        points: 25,
        text: 'Deconstruct underlying mechanics from source papers',
        subtext: 'Deep-dive into technical whitepapers and verify mathematical constraints before committing.'
      },
      {
        channel: 'cobalt',
        channelName: 'Cobalt Blue',
        color: '#1D4ED8',
        points: 25,
        text: 'Benchmark benchmarks against proven standards & safety nets',
        subtext: 'Stress-test edge cases, establish guardrails, and mitigate failure modes before deployment.'
      },
      {
        channel: 'emerald',
        channelName: 'Verdant Emerald',
        color: '#059669',
        points: 25,
        text: 'Evaluate ethical alignment and human societal impact',
        subtext: 'Ensure the new capability empowers users fairly and promotes long-term ethical sustainability.'
      }
    ]
  },
  {
    id: 5,
    category: 'OPERATIONAL CADENCE & PEAK ENERGY',
    title: 'Sustained Flow State Conditions',
    prompt: 'Which working environment allows you to sustain peak intellectual focus for weeks without cognitive depletion?',
    options: [
      {
        channel: 'solar',
        channelName: 'Solar Gold',
        color: '#D97706',
        points: 25,
        text: 'High velocity, extreme autonomy & rapid daily ship cycles',
        subtext: 'Clear ownership, zero bureaucratic red tape, and immediate real-world validation of work.'
      },
      {
        channel: 'teal',
        channelName: 'Oceanic Teal',
        color: '#0A6275',
        points: 25,
        text: 'Uninterrupted deep focus blocks for hard problem solving',
        subtext: 'Asynchronous communication, minimal context switching, and time to craft pristine solutions.'
      },
      {
        channel: 'emerald',
        channelName: 'Verdant Emerald',
        color: '#059669',
        points: 25,
        text: 'A close-knit, psychologically safe team with shared ideals',
        subtext: 'High transparency, mutual gratitude, and working on missions that genuinely uplift people.'
      },
      {
        channel: 'cobalt',
        channelName: 'Cobalt Blue',
        color: '#1D4ED8',
        points: 25,
        text: 'Crystal-clear SLAs, structured roadmaps & dependable peers',
        subtext: 'Predictable execution rhythms, well-defined boundaries, and high operational excellence.'
      }
    ]
  }
];

interface ChromaticTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCompleteTest: (updatedUser: UserProfile, result: ChromaticAssessmentResult) => void;
  isFirstTimer?: boolean;
}

export const ChromaticTestModal: React.FC<ChromaticTestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCompleteTest,
  isFirstTimer = false
}) => {
  const [phase, setPhase] = useState<'intro' | 'test' | 'calculating' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, QuestionOption>>({});
  const [accumulatedScores, setAccumulatedScores] = useState<ChromaticTestScores>({
    solar: 20,
    teal: 20,
    emerald: 20,
    amethyst: 15,
    cobalt: 15
  });
  const [assessmentResult, setAssessmentResult] = useState<ChromaticAssessmentResult | null>(null);

  // If first timer and modal opened, start at intro
  useEffect(() => {
    if (isOpen) {
      // If user is retaking, they can still view intro or start immediately
      setPhase('intro');
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (option: QuestionOption) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQ.id]: option
    };
    setSelectedAnswers(updatedAnswers);

    // If on last question, compute result and show calculation phase
    if (currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1) {
      calculateAndFinish(updatedAnswers);
    } else {
      // Advance to next question after small delay for visual feedback
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 250);
    }
  };

  const calculateAndFinish = (answers: Record<number, QuestionOption>) => {
    setPhase('calculating');

    // Base baseline scores
    const rawScores: ChromaticTestScores = {
      solar: 15,
      teal: 15,
      emerald: 15,
      amethyst: 10,
      cobalt: 10
    };

    // Add points from answers
    Object.values(answers).forEach(ans => {
      rawScores[ans.channel] += ans.points;
    });

    // Normalize to 0-100 scales
    const maxVal = Math.max(...Object.values(rawScores));
    const normalized: ChromaticTestScores = {
      solar: Math.min(100, Math.round((rawScores.solar / maxVal) * 94)),
      teal: Math.min(100, Math.round((rawScores.teal / maxVal) * 92)),
      emerald: Math.min(100, Math.round((rawScores.emerald / maxVal) * 90)),
      amethyst: Math.min(100, Math.round((rawScores.amethyst / maxVal) * 88)),
      cobalt: Math.min(100, Math.round((rawScores.cobalt / maxVal) * 86))
    };

    const result = computeAssessmentResult(normalized);
    setAccumulatedScores(normalized);
    setAssessmentResult(result);

    // After brief simulated spectral calculation
    setTimeout(() => {
      setPhase('result');
    }, 1200);
  };

  const handleApplyResult = () => {
    if (!assessmentResult) return;

    // Save custom color identity to localStorage
    saveUserCustomColorIdentity(currentUser.id, assessmentResult.identity);

    // Mark test as completed in localStorage so user is not prompted again
    try {
      localStorage.setItem('matchwise_chromatic_test_completed', 'true');
    } catch {
      // ignore
    }

    // Update currentUser with calibrated values
    const newSolar = assessmentResult.scores.solar;
    const newTeal = assessmentResult.scores.teal;
    const newEmerald = assessmentResult.scores.emerald;
    const globalScore = Math.round((newSolar + newTeal + newEmerald) / 3);

    const updatedUser: UserProfile = {
      ...currentUser,
      title: `${assessmentResult.archetypeName} • ${assessmentResult.identity.primaryName}`,
      bio: assessmentResult.archetypeDescription,
      executionScore: newSolar,
      capabilityScore: newTeal,
      resonanceScore: newEmerald,
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: newSolar,
        deepTealAnchor: newTeal,
        verdantSpark: newEmerald,
        dominantSignature: assessmentResult.identity.harmonicTitle,
        globalSynergyScore: globalScore
      },
      ocean: {
        openness: Math.min(98, Math.max(40, assessmentResult.scores.amethyst + 10)),
        conscientiousness: Math.min(98, Math.max(40, assessmentResult.scores.solar + 5)),
        extraversion: Math.min(98, Math.max(35, assessmentResult.scores.solar > 70 ? 82 : 65)),
        agreeableness: Math.min(98, Math.max(45, assessmentResult.scores.emerald + 8)),
        neuroticism: Math.max(15, Math.min(50, 100 - assessmentResult.scores.cobalt))
      }
    };

    onCompleteTest(updatedUser, assessmentResult);
    onClose();
  };

  const handleSkipTest = () => {
    try {
      localStorage.setItem('matchwise_chromatic_test_completed', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 border border-stone-200 relative my-8">
        
        {/* Close / Skip button */}
        <button
          onClick={isFirstTimer ? handleSkipTest : onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors z-10"
          id="chromatic-modal-close-btn"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* PHASE 1: INTRO */}
        {phase === 'intro' && (
          <div className="text-center py-4 space-y-6 animate-in fade-in duration-300">
            {/* Ambient Orb */}
            <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#059669] shadow-lg flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Palette className="w-8 h-8 text-[#D97706]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Behavioral Chromatic Assessment</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Calibrate Your Chromatic Spectrum
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Matchwise replaces crude personality categories with continuous <strong>OKLCH Perceptual Color Vectors</strong>. Take a 90-second scenario assessment to discover your cognitive archetype and dominant behavioral hue.
              </p>
            </div>

            {/* 5 Core Channels Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-left pt-2">
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="w-3 h-3 rounded-full bg-[#D97706] mb-1.5" />
                <span className="block text-[11px] font-bold text-amber-950">Solar Gold</span>
                <span className="block text-[10px] text-amber-900/70">Execution Drive</span>
              </div>
              <div className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/50">
                <div className="w-3 h-3 rounded-full bg-[#0A6275] mb-1.5" />
                <span className="block text-[11px] font-bold text-teal-950">Deep Teal</span>
                <span className="block text-[10px] text-teal-900/70">Systems Logic</span>
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="w-3 h-3 rounded-full bg-[#059669] mb-1.5" />
                <span className="block text-[11px] font-bold text-emerald-950">Verdant Mint</span>
                <span className="block text-[10px] text-emerald-900/70">Empathic Trust</span>
              </div>
              <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="w-3 h-3 rounded-full bg-[#7C3AED] mb-1.5" />
                <span className="block text-[11px] font-bold text-purple-950">Royal Amethyst</span>
                <span className="block text-[10px] text-purple-900/70">Visionary Mind</span>
              </div>
              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 col-span-2 sm:col-span-1">
                <div className="w-3 h-3 rounded-full bg-[#1D4ED8] mb-1.5" />
                <span className="block text-[11px] font-bold text-blue-950">Cobalt Blue</span>
                <span className="block text-[10px] text-blue-900/70">Reliability Anchor</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setPhase('test')}
                className="w-full sm:w-auto px-6 py-3 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                id="start-chromatic-test-btn"
              >
                <span>Begin Assessment (5 Scenarios)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSkipTest}
                className="w-full sm:w-auto px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold rounded-xl transition-colors"
                id="skip-chromatic-test-btn"
              >
                Skip & Use Default Profile
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: QUESTION FLOW */}
        {phase === 'test' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header: Step & Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span className="flex items-center gap-1 text-[#D97706]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}</span>
                </span>
                <span className="font-mono text-stone-400">{progressPercent}% complete</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D97706] via-[#0A6275] to-[#059669] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Details */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                {currentQ.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id]?.text === option.text;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#D97706] bg-amber-50/40 shadow-xs ring-1 ring-[#D97706]/30'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 bg-white'
                    }`}
                    id={`test-opt-${currentQ.id}-${idx}`}
                  >
                    {/* Color dot indicator */}
                    <div 
                      className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-white text-[10px] font-bold shadow-2xs"
                      style={{ backgroundColor: option.color }}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-stone-950">
                          {option.text}
                        </span>
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                          style={{ 
                            backgroundColor: `${option.color}15`, 
                            color: option.color 
                          }}
                        >
                          +{option.channelName}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {option.subtext}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentQuestionIndex === 0 
                    ? 'text-stone-300 cursor-not-allowed' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                id="test-prev-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-[11px] text-stone-400">
                Select the option that best mirrors your instinctive action
              </span>
            </div>
          </div>
        )}

        {/* PHASE 3: CALCULATING / SYNTHESIS */}
        {phase === 'calculating' && (
          <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-24 h-24 rounded-full mx-auto p-1.5 bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#7C3AED] shadow-xl flex items-center justify-center animate-spin">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D97706]" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-stone-900">
                Synthesizing OKLCH Color Spectrum...
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Decomposing cognitive velocity, systems depth, and empathic vectors into perceptual wavelengths.
              </p>
            </div>
          </div>
        )}

        {/* PHASE 4: BIG REVEAL & ACCEPT */}
        {phase === 'result' && assessmentResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Reveal Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                <span>Calibration Complete</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {assessmentResult.archetypeName}
              </h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {assessmentResult.archetypeTagline}
              </p>
            </div>

            {/* Central Color Aura Display */}
            <div 
              className="p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden"
              style={{ background: assessmentResult.identity.bgGradient }}
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs"
                    style={{ 
                      backgroundColor: `${assessmentResult.identity.primaryColor}20`,
                      color: assessmentResult.identity.primaryColor,
                      borderColor: `${assessmentResult.identity.primaryColor}40`
                    }}
                  >
                    Primary: {assessmentResult.identity.primaryName}
                  </span>
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs"
                    style={{ 
                      backgroundColor: `${assessmentResult.identity.secondaryColor}20`,
                      color: assessmentResult.identity.secondaryColor,
                      borderColor: `${assessmentResult.identity.secondaryColor}40`
                    }}
                  >
                    Secondary: {assessmentResult.identity.secondaryName}
                  </span>
                </div>

                <h4 className="text-base font-bold text-stone-900">
                  {assessmentResult.identity.harmonicTitle}
                </h4>
                <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
                  {assessmentResult.archetypeDescription}
                </p>
              </div>

              {/* Radiant Swatch Orb */}
              <div 
                className="w-24 h-24 rounded-full p-2 shadow-xl shrink-0 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${assessmentResult.identity.primaryColor}, ${assessmentResult.identity.secondaryColor})` 
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <span className="text-[10px] font-black text-stone-900 uppercase tracking-tighter">
                    OKLCH
                  </span>
                  <span className="text-[9px] font-mono text-stone-500">
                    CALIBRATED
                  </span>
                </div>
              </div>
            </div>

            {/* Spectrum Breakdown Bars */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Cognitive Channel Distribution
              </h4>

              <div className="space-y-2">
                {Object.entries(assessmentResult.scores).map(([key, score]) => {
                  const meta: Record<string, { label: string; color: string }> = {
                    solar: { label: 'Solar Gold (Velocity)', color: '#D97706' },
                    teal: { label: 'Oceanic Teal (Architecture)', color: '#0A6275' },
                    emerald: { label: 'Verdant Mint (Empathy)', color: '#059669' },
                    amethyst: { label: 'Royal Amethyst (Vision)', color: '#7C3AED' },
                    cobalt: { label: 'Cobalt Blue (Reliability)', color: '#1D4ED8' }
                  };
                  const item = meta[key];

                  return (
                    <div key={key}>
                      <div className="flex justify-between text-[11px] font-bold text-stone-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.label}
                        </span>
                        <span style={{ color: item.color }}>{score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${score}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Superpower & Blindspot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-[#059669]" />
                  Core Superpower
                </span>
                <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                  {assessmentResult.superpower}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-amber-950 flex items-center gap-1 mb-1">
                  <Brain className="w-3.5 h-3.5 text-[#D97706]" />
                  Growth Blindspot
                </span>
                <p className="text-amber-900/80 leading-relaxed text-[11px]">
                  {assessmentResult.blindspot}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => {
                  setPhase('test');
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                id="retake-assessment-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <button
                onClick={handleApplyResult}
                className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                id="apply-calibrated-color-btn"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Apply Color & Enter Workspace</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
