import React, { useState } from 'react';
import { CriteriaCardData, UserProfile } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Loader2,
  Layers,
  Palette
} from 'lucide-react';
import { getColorIdentity } from '../lib/colorSystem';

interface CustomAiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidatePool: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
}

export const CustomAiMatchModal: React.FC<CustomAiMatchModalProps> = ({
  isOpen,
  onClose,
  candidatePool,
  onSelectCandidate
}) => {
  const [prompt, setPrompt] = useState(
    'Find 2 distributed systems engineers and 1 UI/UX designer with high execution drive for a Web3 hackathon team'
  );
  const [isParsing, setIsParsing] = useState(false);
  const [criteriaCard, setCriteriaCard] = useState<CriteriaCardData | null>(null);
  const [assembledTeam, setAssembledTeam] = useState<{ team: UserProfile[] } | null>(null);

  if (!isOpen) return null;

  const handleParsePrompt = async () => {
    setIsParsing(true);
    setAssembledTeam(null);
    try {
      const res = await fetch('/api/parse-custom-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data?.criteria) {
        setCriteriaCard({
          id: 'card-' + Date.now(),
          rawPrompt: prompt,
          targetSubMode: data.criteria.targetSubMode || 'CUSTOM_AI_MATCH',
          targetTeamSize: data.criteria.targetTeamSize || 3,
          requiredRoles: data.criteria.requiredRoles || [
            { role: 'Backend Engineer', count: 2 },
            { role: 'UI/UX Designer', count: 1 }
          ],
          requiredSkills: data.criteria.requiredSkills || ['Python', 'Figma', 'TypeScript'],
          minExecutionDrive: data.criteria.minExecutionDrive || 85,
          preferredTimezone: data.criteria.preferredTimezone || 'UTC-8 to UTC+1',
          domainFocus: data.criteria.domainFocus || 'Design & Scalable Infrastructure',
          isApproved: false
        });
      }
    } catch (err) {
      console.warn('AI Parsing error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleExecuteAssembly = () => {
    if (!criteriaCard) return;
    const sorted = [...candidatePool].sort((a, b) => b.executionScore - a.executionScore);
    const selectedTeam = sorted.slice(0, criteriaCard.targetTeamSize);

    setAssembledTeam({
      team: selectedTeam
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-lg font-bold text-stone-900">
                Custom Chromatic AI Match Pipeline
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Parse custom role criteria using AI and assemble multi-chromatic teams.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Phase 1: Natural Language Prompt Input */}
        <div className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-stone-700">
            Organizer Prompt (Natural Language Query)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Assemble 2 systems engineers and 1 design lead with high solar gold drive..."
              className="w-full p-3.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] transition-all leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPrompt('Find 2 Python backend devs and 1 UI/UX designer with Solar Gold execution drive')}
                className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-3 py-1 rounded-full hover:bg-stone-200 transition-colors"
              >
                Preset: Hackathon (Gold & Teal)
              </button>
              <button
                type="button"
                onClick={() => setPrompt('Match 1 Ethical AI Lead mentor with Royal Purple & Verdant Green spectrum')}
                className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-3 py-1 rounded-full hover:bg-stone-200 transition-colors"
              >
                Preset: Mentorship (Purple & Green)
              </button>
            </div>

            <button
              onClick={handleParsePrompt}
              disabled={isParsing || !prompt.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-xs"
              id="parse-prompt-btn"
            >
              {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isParsing ? 'Parsing...' : 'Parse Chromatic Criteria'}</span>
            </button>
          </div>
        </div>

        {/* Phase 2: Editable Criteria Cards */}
        {criteriaCard && (
          <div className="mt-6 pt-6 border-t border-stone-100 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Editable Criteria Card (Human-in-the-Loop Review)</span>
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                Review & Confirm
              </span>
            </div>

            <div className="bg-stone-50 rounded-xl border border-stone-200/80 p-5 space-y-4">
              {/* Target SubMode & Team Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    Matching Sub-Mode
                  </label>
                  <input
                    type="text"
                    value={criteriaCard.targetSubMode}
                    readOnly
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    Target Team Size
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={criteriaCard.targetTeamSize}
                    onChange={(e) =>
                      setCriteriaCard({
                        ...criteriaCard,
                        targetTeamSize: parseInt(e.target.value) || 3
                      })
                    }
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                  />
                </div>
              </div>

              {/* Roles Breakdown */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">
                  Extracted Role Quotas
                </label>
                <div className="space-y-2">
                  {criteriaCard.requiredRoles.map((roleObj, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-stone-200">
                      <input
                        type="text"
                        value={roleObj.role}
                        onChange={(e) => {
                          const updated = [...criteriaCard.requiredRoles];
                          updated[idx].role = e.target.value;
                          setCriteriaCard({ ...criteriaCard, requiredRoles: updated });
                        }}
                        className="flex-1 text-xs font-semibold text-stone-800 bg-transparent focus:outline-none"
                      />
                      <span className="text-[11px] text-stone-400">Count:</span>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={roleObj.count}
                        onChange={(e) => {
                          const updated = [...criteriaCard.requiredRoles];
                          updated[idx].count = parseInt(e.target.value) || 1;
                          setCriteriaCard({ ...criteriaCard, requiredRoles: updated });
                        }}
                        className="w-12 text-xs font-medium p-1 border border-stone-200 rounded-md bg-stone-50 text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pure Color Drive Selection */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                  <span>Target Chromatic Tone</span>
                  <span className="text-[#D97706] font-bold">Solar Gold Radiance</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-amber-300 via-teal-400 to-[#059669]" />
              </div>

              {/* Approval Trigger */}
              <div className="pt-2">
                <button
                  onClick={handleExecuteAssembly}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  id="approve-criteria-and-match-btn"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Approve & Assemble Chromatic Roster</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Assembled Team Roster */}
        {assembledTeam && (
          <div className="mt-6 pt-6 border-t border-stone-100 animate-in fade-in">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Optimized Team Assembly Output
                </h3>
                <p className="text-xs text-stone-500">
                  Tri-chromatic coverage assembled across all {criteriaCard?.targetTeamSize} roles
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-500/30 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Full Chromatic Resonance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {assembledTeam.team.map((member) => {
                const memColor = getColorIdentity(member.id);

                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      onClose();
                      onSelectCandidate(member);
                    }}
                    className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl hover:border-[#D97706]/60 hover:shadow-xs cursor-pointer transition-all flex flex-col items-center text-center group"
                  >
                    <div className="relative mb-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover ring-2"
                        style={{ borderColor: memColor.primaryColor }}
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: memColor.primaryColor }}
                      />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#D97706]">
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-stone-400">{member.title}</p>
                    <span
                      className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                      style={{
                        backgroundColor: `${memColor.primaryColor}15`,
                        color: memColor.primaryColor,
                        borderColor: `${memColor.primaryColor}30`
                      }}
                    >
                      {memColor.primaryName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
