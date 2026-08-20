import React from 'react';
import { Zap, Infinity as InfinityIcon, Scale, SlidersHorizontal, Sparkles, Palette, ArrowRight, Brain, Globe, Heart, Briefcase } from 'lucide-react';
import { UserProfile, EngineTier } from '../types';
import { getColorIdentity } from '../lib/colorSystem';
import { ProfileHeroCard } from './ProfileHeroCard';

interface DashboardViewProps {
  currentUser: UserProfile;
  quickMatches: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
  onOpenNetworkModal: () => void;
  onOpenCustomMatch: () => void;
  onNavigateToColors?: () => void;
  onNavigateToMaps?: (tier?: EngineTier) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  quickMatches,
  onSelectCandidate,
  onOpenNetworkModal,
  onNavigateToColors,
  onNavigateToMaps
}) => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Your Profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-2xl">
            Everything the matching engine reads about you: who you are, what you offer, what you need, and how you work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">Looking for:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-stone-800 animate-pulse" />
            {currentUser.subMode.replace(/_/g, ' ')}
          </span>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (8 cols): Large Global Synergy Ring + 3 Metric Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chromatic dossier hero (swapped in from the profile page) */}
          <ProfileHeroCard profile={currentUser} />




          {/* Dedicated Color System & Behavioral Science Banner Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>Matchwise Chromatic Behavioral Model</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100/70 text-[#D97706]">
                    OKLCH Science
                  </span>
                </h4>
                <p className="text-xs text-stone-500 max-w-xl">
                  Learn how perceptual color frequencies define execution speed, systems thinking, empathy, and visionary intuition across team dynamics.
                </p>
              </div>
            </div>

            {onNavigateToColors && (
              <button
                onClick={onNavigateToColors}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
                id="dashboard-explore-color-system-btn"
              >
                <span>Explore Color System</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>

          {/* 3 Types of Maps Spatial Grid Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    Spatial Constellation Grid
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-white">
                  3 Purpose-Aligned Maps
                </h3>
                <p className="text-xs text-stone-300 max-w-lg">
                  Explore global nodes across Personal, Professional, and Collaborative spatial cartographies with sub-purpose filtering.
                </p>
              </div>

              {onNavigateToMaps && (
                <button
                  onClick={() => onNavigateToMaps()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                  id="dashboard-open-maps-btn"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Launch Maps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('PERSONAL')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Personal Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Dating, friendship & activity partners</p>
              </button>

              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('PROFESSIONAL')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Professional Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Networking, mentorship & study cohorts</p>
              </button>

              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('COLLABORATIVE')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Collaborative Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Hackathon squads & venture co-founders</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Matches Card with Color Spectrum Identifiers */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <h2 className="text-base font-bold text-stone-900">
                    Resonant Colors
                  </h2>
                </div>
                <button
                  onClick={onOpenNetworkModal}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label="Filter quick matches"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Match Items List with Pure Color Identifiers */}
              <div className="mt-3 divide-y divide-stone-100">
                {quickMatches.map((profile) => {
                  const profColor = getColorIdentity(profile.id);

                  return (
                    <div
                      key={profile.id}
                      onClick={() => onSelectCandidate(profile)}
                      className="py-3.5 flex items-center justify-between hover:bg-stone-50/80 px-2 rounded-xl transition-all cursor-pointer group"
                      id={`quick-match-card-${profile.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover ring-2"
                            style={{ borderColor: profColor.primaryColor }}
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: profColor.primaryColor }}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                            {profile.name}
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            {profile.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
                          style={{
                            backgroundColor: `${profColor.primaryColor}15`,
                            color: profColor.primaryColor,
                            borderColor: `${profColor.primaryColor}30`
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: profColor.primaryColor }}
                          />
                          {profColor.primaryName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={onOpenNetworkModal}
                className="w-full py-2.5 px-4 bg-[#EAECEF] hover:bg-[#DFE2E7] text-stone-800 text-xs font-semibold rounded-xl transition-colors text-center"
                id="view-complete-network-btn"
              >
                View Full Chromatic Network
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
