import React from 'react';
import { UserProfile } from '../types';

interface ProfileSummaryCardProps {
  profile: UserProfile;
  /** Optional slot rendered under the bio (used for inline editing on the profile page). */
  footerSlot?: React.ReactNode;
  className?: string;
}

/**
 * Detailed profile summary: identity, operating stats, needs/offers and personality bars.
 * Shared by the home dashboard and the profile page.
 */
export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ profile, footerSlot, className }) => {
  return (
    <div className={`bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs ${className ?? ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <img
          src={profile.avatar}
          alt={`${profile.name}'s profile photo`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 shadow-xs"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {profile.name}
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 tracking-wide">
              {profile.tier}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 tracking-wide">
              {profile.subMode.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-stone-700">{profile.title}</p>
          <p className="text-xs text-stone-500">{profile.location}</p>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">{profile.bio}</p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Availability', value: `${profile.availabilityHoursPerWeek} hrs/wk` },
              { label: 'Response', value: profile.communicationLatency },
              { label: 'Risk Appetite', value: profile.riskTolerance },
              { label: 'Verified', value: new Date(profile.verifiedAt).toLocaleDateString() }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {item.label}
                </div>
                <div className="mt-0.5 text-xs font-semibold text-stone-800 truncate">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Offers', items: profile.needsOffers.offers },
          { label: 'Needs', items: profile.needsOffers.needs },
          { label: 'Domains', items: profile.needsOffers.domains }
        ].map((group) => (
          <div key={group.label}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {group.label}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.items.length === 0 ? (
                <span className="text-xs text-stone-400">Not set yet</span>
              ) : (
                group.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-700"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          Personality Profile
        </h3>
        <div className="mt-3 space-y-2.5">
          {[
            { name: 'Openness', value: profile.ocean.openness, note: 'Curiosity for new ideas and approaches' },
            { name: 'Conscientiousness', value: profile.ocean.conscientiousness, note: 'Follow-through and structure' },
            { name: 'Extraversion', value: profile.ocean.extraversion, note: 'Energy drawn from people and momentum' },
            { name: 'Agreeableness', value: profile.ocean.agreeableness, note: 'Cooperation and trust in teams' },
            { name: 'Emotional Stability', value: 100 - profile.ocean.neuroticism, note: 'Steadiness under pressure' }
          ].map((trait) => (
            <div key={trait.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">{trait.name}</span>
                <span className="font-bold text-stone-500">{Math.round(trait.value)}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-stone-800"
                  style={{ width: `${Math.max(0, Math.min(100, trait.value))}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-stone-400">{trait.note}</p>
            </div>
          ))}
        </div>
      </div>

      {footerSlot}
    </div>
  );
};
