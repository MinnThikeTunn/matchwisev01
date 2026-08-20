import React, { useState } from 'react';
import { UserProfile, MatchResult } from '../types';
import { evaluatePairwiseMatch } from '../lib/algorithm';
import { 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Scale, 
  Circle, 
  Triangle, 
  Send, 
  Check, 
  RefreshCw,
  ArrowLeft,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getColorIdentity, getPairwiseColorHarmonics } from '../lib/colorSystem';

interface SynergyMatchViewProps {
  requester: UserProfile;
  candidate: UserProfile;
  onBack: () => void;
}

export const SynergyMatchView: React.FC<SynergyMatchViewProps> = ({
  requester,
  candidate,
  onBack
}) => {
  const [matchResult, setMatchResult] = useState<MatchResult>(() =>
    evaluatePairwiseMatch(requester, candidate)
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);

  const reqColor = getColorIdentity(requester.id);
  const candColor = getColorIdentity(candidate.id);
  const harmonic = getPairwiseColorHarmonics(requester.id, candidate.id);

  const [collaborationMessage, setCollaborationMessage] = useState(
    `Hi ${candidate.name},\n\nI reviewed our Matchwise Prism chromatic synergy (${harmonic.title}). I'd love to connect and harmonize across ${requester.needsOffers.offers[0]} and ${candidate.needsOffers.offers[0]}.\n\nBest,\n${requester.name}`
  );
  const [isSent, setIsSent] = useState(false);

  const handleRegenerateXai = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/explain-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userA: requester,
          userB: candidate,
          matchResult
        })
      });
      const data = await res.json();
      if (data?.explanation?.keyDrivers) {
        setMatchResult(prev => ({
          ...prev,
          synergyDescription: data.explanation.synergyDescription || prev.synergyDescription,
          keyDrivers: data.explanation.keyDrivers,
          isAiGeneratedExplanation: true
        }));
      }
    } catch (err) {
      console.warn('Failed to regenerate XAI explanation:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleInitiateCollaboration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowCollaborationModal(true);
  };

  const handleSendMessage = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowCollaborationModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        id="back-to-dashboard-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Section with Pure Color Harmony */}
      <div className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-500/30 text-xs font-bold mb-3 shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{harmonic.title}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Chromatic Synergy Resonance
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto">
          A seamless synthesis of {reqColor.primaryName} velocity and {candColor.primaryName} architecture. This pairing produces a luminous multi-spectral resonance across strategic and creative horizons.
        </p>
      </div>

      {/* Main Top Pair Dossier Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
          {/* Left User: Alex Mercer */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full p-1 mb-3 ring-4 shadow-sm"
              style={{ ['--tw-ring-color' as any]: reqColor.primaryColor }}
            >
              <img
                src={requester.avatar}
                alt={requester.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {requester.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {requester.title}
            </p>
            <span
              className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              style={{
                backgroundColor: `${reqColor.primaryColor}15`,
                color: reqColor.primaryColor,
                borderColor: `${reqColor.primaryColor}30`
              }}
            >
              {reqColor.primaryName} Spectrum
            </span>
          </div>

          {/* Center: Pure Chromatic Fusion Lens (NO NUMBERS) */}
          <div className="flex flex-col items-center justify-center py-4 border-y md:border-y-0 md:border-x border-stone-100">
            {/* Blending Multi-Color Fusion Sphere */}
            <div
              className="w-24 h-24 rounded-full shadow-lg p-1 flex items-center justify-center relative overflow-hidden animate-pulse"
              style={{ background: harmonic.gradient }}
            >
              <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reqColor.primaryColor }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: candColor.primaryColor }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                </div>
                <span className="text-[10px] font-black tracking-wider text-stone-900 uppercase">
                  COLOR FUSION
                </span>
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                  Dual Resonance
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              HOLISTIC CHROMATIC HARMONY
            </div>
          </div>

          {/* Right User: Candidate */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full p-1 mb-3 ring-4 shadow-sm"
              style={{ ['--tw-ring-color' as any]: candColor.primaryColor }}
            >
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {candidate.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {candidate.title}
            </p>
            <span
              className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              style={{
                backgroundColor: `${candColor.primaryColor}15`,
                color: candColor.primaryColor,
                borderColor: `${candColor.primaryColor}30`
              }}
            >
              {candColor.primaryName} Spectrum
            </span>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: XAI Key Drivers (Pure Color Drivers) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h2 className="text-base font-bold text-stone-800">
                XAI Chromatic Drivers
              </h2>
              <button
                onClick={handleRegenerateXai}
                disabled={isGeneratingAi}
                className="text-xs font-semibold text-[#D97706] hover:text-amber-700 flex items-center gap-1 disabled:opacity-50"
                title="Regenerate with AI"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Analyzing...' : 'AI Re-analyze'}</span>
              </button>
            </div>

            {/* Drivers List */}
            <div className="space-y-6">
              {/* Driver 1: Technical Overlap (Emerald Green) */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900">
                      Verdant Technical Overlap
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Extensive shared foundations in distributed architecture, interface design, and systems engineering.
                  </p>
                </div>
              </div>

              {/* Driver 2: Communication Latency (Deep Teal) */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-[#0A6275] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900">
                      Oceanic Communication Sync
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-[#0A6275]" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Complementary async-first communication rhythms with matched documentation and feedback cadence.
                  </p>
                </div>
              </div>

              {/* Driver 3: Risk Tolerance (Solar Gold) */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900">
                      Solar Risk & Strategy Balance
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Balanced equilibrium between rapid experimental innovation and deep architectural safety rails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Archetypal Resonance (Pure Color Bands, NO NUMBERS) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-base font-bold text-stone-800 pb-4 border-b border-stone-100 mb-6">
              Archetypal Color Resonance
            </h2>

            {/* Pure Color Gradient Bars */}
            <div className="space-y-6">
              {/* Row 1: Solar Gold (Focus & Execution) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                    <span>Solar Gold: Focus & Execution</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900">Luminous Radiance</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-[#D97706] shadow-xs" />
              </div>

              {/* Row 2: Deep Teal (Clarity & Structure) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0A6275]" />
                    <span>Deep Teal: Clarity & Structure</span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-900">Harmonic Depth</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-cyan-200 via-teal-400 to-[#0A6275] shadow-xs" />
              </div>

              {/* Row 3: Verdant Green (Agility & Vision) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#059669]" />
                    <span>Verdant Green: Agility & Vision</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-900">Pure Spark</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-[#059669] shadow-xs" />
              </div>

              {/* Row 4: Royal Purple (Intuition & Synergy) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <span>Royal Purple: Intuitive Synthesis</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-900">Vibrant Tone</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-purple-200 via-purple-400 to-[#7C3AED] shadow-xs" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <button
              onClick={handleInitiateCollaboration}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              id="initiate-collaboration-btn"
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span>Initiate Chromatic Collaboration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Dispatch Modal */}
      {showCollaborationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: candColor.primaryColor }} />
                <span>Connect with {candidate.name} ({candColor.primaryName})</span>
              </h3>
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Chromatic Synergy Proposal
              </label>
              <textarea
                rows={5}
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-[#D97706] transition-all leading-relaxed"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSent}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                id="confirm-send-collaboration-btn"
              >
                {isSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSent ? 'Sent' : 'Send Invitation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
