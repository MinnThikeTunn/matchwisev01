import React from 'react';
import { Hash, ShieldCheck, Award, MapPin, Clock, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';
import { getColorIdentity } from '../lib/colorSystem';

interface ProfileHeroCardProps {
  profile: UserProfile;
  /** Optional slot rendered in place of the static bio (used for inline editing). */
  bioSlot?: React.ReactNode;
  className?: string;
}

/**
 * Chromatic dossier hero card: gradient banner, Prism ID, avatar, identity row,
 * harmonic resonance badge and bio. Shared by the home dashboard and profile page.
 */
export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({ profile, bioSlot, className }) => {
  const activeColor = getColorIdentity(profile.id);

  return (
    <div className={`bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs ${className ?? ''}`}>
      {/* Dynamic Chromatic Header Banner */}
      <div
        className="h-36 sm:h-44 w-full relative p-6 flex items-end justify-end transition-all"
        style={{ background: activeColor.bgGradient }}
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-stone-200/80 shadow-xs flex items-center gap-1.5 text-xs font-bold text-stone-800">
          <Hash className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Prism ID: {profile.prismId || 'MW-9842-AX'}</span>
        </div>
      </div>

      {/* Profile Info Row */}
      <div className="px-6 sm:px-8 pb-8 pt-0 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1.5 bg-white shadow-xl ring-4 transition-all"
                style={{ ['--tw-ring-color' as string]: activeColor.primaryColor } as React.CSSProperties}
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full ring-4 ring-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                  <Award className="w-3 h-3 text-[#D97706]" />
                  {profile.tier}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#D97706] border border-amber-200">
                  {profile.subMode}
                </span>
              </div>

              <p className="text-sm font-semibold text-stone-600">{profile.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {profile.availabilityHoursPerWeek} hrs/week
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                  {profile.communicationLatency}
                </span>
              </div>
            </div>
          </div>

          {/* Harmonic Spectrum Summary Badge */}
          <div className="flex flex-col sm:items-end gap-2 bg-stone-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-stone-200">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Harmonic Resonance
            </span>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs"
              style={{
                backgroundColor: `${activeColor.primaryColor}15`,
                color: activeColor.primaryColor,
                borderColor: `${activeColor.primaryColor}30`
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor.primaryColor }} />
              <span>{activeColor.harmonicTitle}</span>
            </div>
            <span className="text-[11px] text-stone-400 font-mono">
              OKLCH Aura: {activeColor.primaryName} × {activeColor.secondaryName}
            </span>
          </div>
        </div>

        {/* Bio text (or editable slot) */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          {bioSlot ?? (
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
