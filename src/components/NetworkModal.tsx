import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Search, ArrowRight, Palette } from 'lucide-react';
import { getColorIdentity, getPairwiseColorHarmonics } from '../lib/colorSystem';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  candidates: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
}

export const NetworkModal: React.FC<NetworkModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  candidates,
  onSelectCandidate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.title.toLowerCase().includes(term) ||
      c.prismId.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.needsOffers.offers.some(o => o.toLowerCase().includes(term)) ||
      c.needsOffers.needs.some(n => n.toLowerCase().includes(term));

    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-xl font-bold text-stone-900">
                Chromatic Network Directory
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore all active candidates categorized by their pure chromatic spectral resonance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="my-4 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, chromatic frequency, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] text-stone-800"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['ALL', 'PROFESSIONAL', 'COLLABORATIVE', 'PERSONAL'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  tierFilter === tier
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No candidates matching your query criteria.
            </div>
          ) : (
            filtered.map((candidate) => {
              const candColor = getColorIdentity(candidate.id);
              const harmonic = getPairwiseColorHarmonics(currentUser.id, candidate.id);

              return (
                <div
                  key={candidate.id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-stone-50 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover ring-2"
                        style={{ borderColor: candColor.primaryColor }}
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: candColor.primaryColor }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">
                          {candidate.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                          {candidate.prismId}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {candidate.title} • {candidate.location}
                      </p>
                      {/* Skill tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {candidate.needsOffers.offers.slice(0, 3).map((offer, oIdx) => (
                          <span
                            key={oIdx}
                            className="text-[10px] px-2 py-0.5 bg-white border border-stone-200 text-stone-600 rounded-full"
                          >
                            {offer}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Synergy & Action */}
                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs"
                        style={{
                          backgroundColor: `${candColor.primaryColor}15`,
                          color: candColor.primaryColor,
                          borderColor: `${candColor.primaryColor}30`
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: candColor.primaryColor }}
                        />
                        {candColor.primaryName}
                      </span>
                      <div className="text-[10px] font-semibold text-stone-400 mt-0.5">
                        {harmonic.title}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectCandidate(candidate);
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Inspect Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
