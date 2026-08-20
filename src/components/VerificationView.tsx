import React from 'react';
import { ConicRingVisual } from './ConicRingVisual';
import { UserProfile } from '../types';
import { Fingerprint, Palette, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { getColorIdentity } from '../lib/colorSystem';

interface VerificationViewProps {
  currentUser: UserProfile;
}

export const VerificationView: React.FC<VerificationViewProps> = ({ currentUser }) => {
  const userColor = getColorIdentity(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300 relative">
      {/* Official Standardization Seal in Top Right (Angled Stamp) */}
      <div className="hidden sm:flex absolute top-6 right-6 md:right-12 z-20 pointer-events-none select-none">
        <div className="border border-dashed border-[#D97706]/60 rounded-xl p-3 transform rotate-6 bg-amber-50/50 backdrop-blur-xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#D97706]/60 flex items-center justify-center relative mb-1">
            <div className="w-8 h-8 rounded-full border border-[#D97706]/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#D97706]" />
            </div>
          </div>
          <div className="text-[9px] font-bold tracking-widest text-[#D97706] uppercase text-center leading-tight">
            OFFICIAL<br />
            CHROMATIC<br />
            CERTIFICATION
          </div>
        </div>
      </div>

      {/* Header Title & Subtitle */}
      <div className="mb-6 sm:mb-8 max-w-2xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-500/30 text-xs font-bold">
            <Palette className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Chromatic Identity Protocol</span>
          </div>

          {/* Mobile-only compact stamp badge */}
          <div className="sm:hidden text-[9px] font-bold text-[#D97706] px-2 py-0.5 rounded border border-dashed border-[#D97706]/60 bg-amber-50/70">
            OFFICIAL SEAL
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Proof of Chromatic Signature
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-relaxed">
          Standardized document asserting the authenticity and exact chromatic spectrum of the assigned Prism identity.
        </p>

        {/* PRISM ID & COLOR IDENTITY */}
        <div className="mt-4 flex flex-wrap gap-4 sm:gap-8 text-xs text-stone-600">
          <div>
            <span className="text-stone-400">PRISM ID:</span>{' '}
            <span className="font-bold text-stone-800">{currentUser.prismId}</span>
          </div>
          <div>
            <span className="text-stone-400">COLOR HARMONY:</span>{' '}
            <span className="font-bold text-[#D97706]">{userColor.harmonicTitle}</span>
          </div>
          <div>
            <span className="text-stone-400">STATUS:</span>{' '}
            <span className="font-bold text-emerald-700">Authenticated Spectrum</span>
          </div>
        </div>
      </div>

      {/* 2 Column Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: Conic Ring Render */}
        <div className="bg-gradient-to-b from-stone-100/90 to-stone-200/60 border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-800">
              Conic Spectrum Render
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-bold">
              Multi-Wavelength
            </span>
          </div>

          {/* Interactive Conic Ring Component */}
          <div className="my-6 flex items-center justify-center">
            <ConicRingVisual size={340} />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white/70 px-4 py-1.5 rounded-full border border-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chromatic Grade: Pure Prism Spectrum</span>
          </div>
        </div>

        {/* Right Card: Pure Color Palette & Signatory */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-800">
                Chromatic Spectrum Palette
              </h2>
              <span className="text-xs font-bold text-stone-400">
                Primary Colors
              </span>
            </div>

            {/* Pure Color Specification Rows - NO numbers, NO coordinates */}
            <div className="space-y-3.5">
              {/* Row 1: Solar Gold */}
              <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#D97706] shadow-sm flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                      SOLAR GOLD
                    </span>
                    <span className="text-[11px] text-amber-800/80">
                      Primary Drive & High Execution
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#D97706] text-white text-[10px] font-bold">
                    Radiant Hue
                  </span>
                </div>
              </div>

              {/* Row 2: Deep Teal */}
              <div className="flex items-center justify-between p-4 bg-teal-50/60 rounded-xl border border-teal-200/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0A6275] shadow-sm flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-950 block">
                      DEEP TEAL
                    </span>
                    <span className="text-[11px] text-teal-800/80">
                      Cognitive Depth & Systems Mastery
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#0A6275] text-white text-[10px] font-bold">
                    Deep Anchor
                  </span>
                </div>
              </div>

              {/* Row 3: Verdant Emerald */}
              <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#059669] shadow-sm flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 block">
                      VERDANT GREEN
                    </span>
                    <span className="text-[11px] text-emerald-800/80">
                      Philosophical Alignment & Safety
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#059669] text-white text-[10px] font-bold">
                    Harmonic Wave
                  </span>
                </div>
              </div>

              {/* Row 4: Royal Amethyst */}
              <div className="flex items-center justify-between p-4 bg-purple-50/60 rounded-xl border border-purple-200/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#7C3AED] shadow-sm flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-950 block">
                      ROYAL PURPLE
                    </span>
                    <span className="text-[11px] text-purple-800/80">
                      Visionary Imagination & Insight
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold">
                    Intuitive Tone
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Authorized Signatory Section */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="text-[11px] font-bold tracking-wider text-stone-400 uppercase mb-3">
              AUTHORIZED CHROMATIC SIGNATORY
            </div>

            <div className="flex items-center gap-4 bg-stone-50/80 p-4 rounded-xl border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-600">
                <Fingerprint className="w-6 h-6 stroke-1.5" />
              </div>
              <div>
                <div className="text-lg font-serif italic text-stone-900 leading-tight">
                  J. Doe Chromatics
                </div>
                <div className="text-[11px] text-stone-400">
                  Chief Standardization Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
