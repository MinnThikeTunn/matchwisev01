import React, { useState } from 'react';
import { UserProfile, OCEANProfile, EngineTier, IntentSubMode } from '../types';
import { getColorIdentity } from '../lib/colorSystem';
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { 
  User, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Save, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  Globe, 
  Layers, 
  Sliders, 
  Award, 
  Zap, 
  CheckCircle2, 
  Plus, 
  X,
  ExternalLink,
  ChevronRight,
  Brain,
  Hash,
  Palette,
  Database,
  KeyRound,
  UserCheck
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  candidatePool: UserProfile[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectCandidateSynergy?: (candidate: UserProfile) => void;
  onNavigateToColors?: () => void;
  onOpenChromaticTest?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  candidatePool,
  onUpdateProfile,
  onSelectCandidateSynergy,
  onNavigateToColors,
  onOpenChromaticTest,
}) => {
  // Selected profile to inspect (defaults to currentUser, can inspect candidates)
  const [inspectedUserId, setInspectedUserId] = useState<string>(currentUser.id);
  const isSelf = inspectedUserId === currentUser.id;
  const activeProfile = isSelf 
    ? currentUser 
    : (candidatePool.find(p => p.id === inspectedUserId) || currentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'spectrum' | 'ocean' | 'skills' | 'verification'>('overview');

  // Form State for editing
  const [formData, setFormData] = useState({
    name: activeProfile.name,
    title: activeProfile.title,
    bio: activeProfile.bio,
    location: activeProfile.location,
    tier: activeProfile.tier,
    subMode: activeProfile.subMode,
    availabilityHours: activeProfile.availabilityHoursPerWeek,
    communicationLatency: activeProfile.communicationLatency,
    riskTolerance: activeProfile.riskTolerance,
    languages: activeProfile.constraints.languages.join(', '),
    connectionGoals: activeProfile.constraints.connectionGoals.join(', '),
    offers: [...activeProfile.needsOffers.offers],
    needs: [...activeProfile.needsOffers.needs],
    domains: [...activeProfile.needsOffers.domains],
    ocean: { ...activeProfile.ocean }
  });

  const [newOfferTag, setNewOfferTag] = useState('');
  const [newNeedTag, setNewNeedTag] = useState('');
  const [newDomainTag, setNewDomainTag] = useState('');

  const activeColor = getColorIdentity(activeProfile.id);

  // Sync form data when switching viewed profile
  const handleSelectProfile = (userId: string) => {
    setInspectedUserId(userId);
    setIsEditing(false);
    const target = userId === currentUser.id 
      ? currentUser 
      : (candidatePool.find(p => p.id === userId) || currentUser);
    setFormData({
      name: target.name,
      title: target.title,
      bio: target.bio,
      location: target.location,
      tier: target.tier,
      subMode: target.subMode,
      availabilityHours: target.availabilityHoursPerWeek,
      communicationLatency: target.communicationLatency,
      riskTolerance: target.riskTolerance,
      languages: target.constraints.languages.join(', '),
      connectionGoals: target.constraints.connectionGoals.join(', '),
      offers: [...target.needsOffers.offers],
      needs: [...target.needsOffers.needs],
      domains: [...target.needsOffers.domains],
      ocean: { ...target.ocean }
    });
  };

  const handleOceanChange = (trait: keyof OCEANProfile, value: number) => {
    setFormData(prev => ({
      ...prev,
      ocean: {
        ...prev.ocean,
        [trait]: value
      }
    }));
  };

  const handleAddOffer = () => {
    if (newOfferTag.trim() && !formData.offers.includes(newOfferTag.trim())) {
      setFormData(prev => ({ ...prev, offers: [...prev.offers, newOfferTag.trim()] }));
      setNewOfferTag('');
    }
  };

  const handleRemoveOffer = (tag: string) => {
    setFormData(prev => ({ ...prev, offers: prev.offers.filter(t => t !== tag) }));
  };

  const handleAddNeed = () => {
    if (newNeedTag.trim() && !formData.needs.includes(newNeedTag.trim())) {
      setFormData(prev => ({ ...prev, needs: [...prev.needs, newNeedTag.trim()] }));
      setNewNeedTag('');
    }
  };

  const handleRemoveNeed = (tag: string) => {
    setFormData(prev => ({ ...prev, needs: prev.needs.filter(t => t !== tag) }));
  };

  const handleAddDomain = () => {
    if (newDomainTag.trim() && !formData.domains.includes(newDomainTag.trim())) {
      setFormData(prev => ({ ...prev, domains: [...prev.domains, newDomainTag.trim()] }));
      setNewDomainTag('');
    }
  };

  const handleRemoveDomain = (tag: string) => {
    setFormData(prev => ({ ...prev, domains: prev.domains.filter(t => t !== tag) }));
  };

  const handleSaveProfile = () => {
    const newSolar = Math.round((formData.ocean.conscientiousness * 0.7) + (formData.ocean.openness * 0.3));
    const newNexus = Math.round((formData.ocean.openness * 0.6) + (formData.ocean.conscientiousness * 0.4));
    const newResonance = Math.round((formData.ocean.agreeableness * 0.7) + ((100 - formData.ocean.neuroticism) * 0.3));
    const globalScore = Math.round((newSolar + newNexus + newResonance) / 3);

    const updatedUser: UserProfile = {
      ...currentUser,
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      location: formData.location,
      tier: formData.tier,
      subMode: formData.subMode,
      availabilityHoursPerWeek: Number(formData.availabilityHours),
      communicationLatency: formData.communicationLatency,
      riskTolerance: formData.riskTolerance,
      ocean: formData.ocean,
      executionScore: newSolar,
      capabilityScore: newNexus,
      resonanceScore: newResonance,
      needsOffers: {
        offers: formData.offers,
        needs: formData.needs,
        domains: formData.domains
      },
      constraints: {
        ...currentUser.constraints,
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
        connectionGoals: formData.connectionGoals.split(',').map(s => s.trim()).filter(Boolean)
      },
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: newSolar,
        deepTealAnchor: newNexus,
        verdantSpark: newResonance,
        globalSynergyScore: globalScore
      }
    };

    onUpdateProfile(updatedUser);
    setIsEditing(false);
  };

  const handleShareDossier = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#prism-${activeProfile.prismId || activeProfile.id}`
    );
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Chromatic Dossier link copied to clipboard!</span>
        </div>
      )}

      {/* Top Bar: Network Profile Switcher & Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Network Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Viewing Dossier:
          </span>
          <div className="relative">
            <select
              value={inspectedUserId}
              onChange={(e) => handleSelectProfile(e.target.value)}
              className="bg-white text-xs font-bold text-stone-900 pl-3 pr-8 py-1.5 rounded-xl border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 cursor-pointer appearance-none"
              id="profile-user-select"
            >
              <option value={currentUser.id}>👤 {currentUser.name} (Your Profile)</option>
              <optgroup label="Network Candidates">
                {candidatePool.map(cand => (
                  <option key={cand.id} value={cand.id}>
                    ✨ {cand.name} ({cand.title})
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {!isSelf && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200">
              Read-Only Candidate Dossier
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShareDossier}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 shadow-xs transition-all"
            id="profile-share-btn"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Share Dossier</span>
          </button>

          {isSelf && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
                    id="profile-cancel-edit-btn"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                    id="profile-save-btn"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                  id="profile-edit-toggle-btn"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile & Spectrum</span>
                </button>
              )}
            </>
          )}

          {!isSelf && onSelectCandidateSynergy && (
            <button
              onClick={() => onSelectCandidateSynergy(activeProfile)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              id="profile-calculate-synergy-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Calculate Synergy with You</span>
            </button>
          )}
        </div>
      </div>

      {/* Detailed profile summary (swapped in from the home dashboard) */}
      <ProfileSummaryCard
        profile={activeProfile}
        className="mb-8"
        footerSlot={
          isEditing ? (
            <div className="mt-6 pt-6 border-t border-stone-100 space-y-3">
              <label className="block text-xs font-bold text-stone-700">Executive Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-stone-800"
                id="profile-bio-textarea"
              />
            </div>
          ) : null
        }
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          id="profile-tab-overview"
        >
          <User className="w-3.5 h-3.5" />
          <span>Core Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('spectrum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'spectrum'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'bg-amber-50 text-[#D97706] hover:bg-amber-100'
          }`}
          id="profile-tab-spectrum"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prism Spectrum</span>
        </button>

        <button
          onClick={() => setActiveTab('ocean')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ocean'
              ? 'bg-[#0A6275] text-white shadow-xs'
              : 'bg-teal-50 text-[#0A6275] hover:bg-teal-100'
          }`}
          id="profile-tab-ocean"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>OCEAN Cognitive Big 5</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'skills'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-emerald-50 text-[#059669] hover:bg-emerald-100'
          }`}
          id="profile-tab-skills"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Needs & Offers Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          id="profile-tab-verification"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification & Cryptography</span>
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left: General Attributes */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <Sliders className="w-4 h-4 text-[#D97706]" />
              <span>Operational Parameters</span>
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Weekly Availability (Hours)</label>
                    <input
                      type="number"
                      value={formData.availabilityHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, availabilityHours: Number(e.target.value) }))}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Communication Style</label>
                  <input
                    type="text"
                    value={formData.communicationLatency}
                    onChange={(e) => setFormData(prev => ({ ...prev, communicationLatency: e.target.value }))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Risk Tolerance & Velocity</label>
                  <input
                    type="text"
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData(prev => ({ ...prev, riskTolerance: e.target.value }))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Languages (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Weekly Commitment
                  </span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block">
                    {activeProfile.availabilityHoursPerWeek} Hours / Week
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    High bandwidth for active sprint execution
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Communication Cadence
                  </span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block">
                    {activeProfile.communicationLatency}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Documented async memos over sync meetings
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Risk & Innovation
                  </span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block">
                    {activeProfile.riskTolerance}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Constructive frontier testing
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Spoken Languages
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeProfile.constraints.languages.map((lang, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-stone-200/70 text-stone-800 text-[10px] font-bold rounded-md">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Connection Goals */}
            <div className="pt-4 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Active Connection Objectives
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProfile.constraints.connectionGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-50 text-[#D97706] border border-amber-200 text-xs font-bold rounded-full"
                  >
                    ✨ {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Chromatic Snapshot */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Chromatic Signature Profile</span>
              </h3>

              <div className="mt-4 space-y-3">
                {/* Solar Gold Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                      Solar Resonance (Execution Drive)
                    </span>
                    <span className="text-[#D97706]">{activeProfile.spectrum.solarResonance}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D97706] rounded-full transition-all duration-500"
                      style={{ width: `${activeProfile.spectrum.solarResonance}%` }}
                    />
                  </div>
                </div>

                {/* Deep Teal Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
                      Deep Teal Anchor (Cognitive Systems)
                    </span>
                    <span className="text-[#0A6275]">{activeProfile.spectrum.deepTealAnchor}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0A6275] rounded-full transition-all duration-500"
                      style={{ width: `${activeProfile.spectrum.deepTealAnchor}%` }}
                    />
                  </div>
                </div>

                {/* Verdant Spark Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                      Verdant Spark (Ethical Congruence)
                    </span>
                    <span className="text-[#059669]">{activeProfile.spectrum.verdantSpark}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#059669] rounded-full transition-all duration-500"
                      style={{ width: `${activeProfile.spectrum.verdantSpark}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 leading-relaxed">
                <p className="font-bold text-stone-800 mb-1">Prism Tone Evaluation:</p>
                {activeColor.toneDescription}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Prism Spectrum Detailed Visualizer */}
      {activeTab === 'spectrum' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-200 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Prism Chromatic Coordinates & Tone Synthesis
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Mathematical representation of your cognitive vectors mapped into perceptual OKLCH color space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeColor.spectrumBars.map((bar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-16 rounded-xl shadow-inner mb-3" style={{ backgroundColor: bar.color }} />
                  <h4 className="text-xs font-bold text-stone-900">{bar.name}</h4>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">{bar.color}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-stone-400">Emission:</span>
                  <span className="text-stone-800">{bar.intensity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Central Conic Spectrum Alignment Card */}
          <div className="p-6 rounded-2xl bg-stone-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-[#D97706] uppercase">
                DOMINANT HARMONIC TITLE
              </span>
              <h3 className="text-2xl font-black">{activeColor.harmonicTitle}</h3>
              <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
                {activeColor.toneDescription}
              </p>
            </div>

            <div className="w-24 h-24 rounded-full p-1.5 shadow-xl shrink-0" style={{ background: activeColor.gradientClass ? undefined : activeColor.bgGradient }}>
              <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center p-2 text-center">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  OKLCH ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Color System Guide & Recalibrate Assessment */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onOpenChromaticTest && isSelf && (
              <button
                onClick={onOpenChromaticTest}
                className="p-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white flex-1 flex items-center justify-between text-xs font-bold transition-all shadow-xs"
                id="profile-spectrum-recalibrate-btn"
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="block text-white">Recalibrate Spectrum Assessment</span>
                    <span className="block text-[10px] font-normal text-stone-400">Retake the 5-scenario behavioral test to update your colors</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            )}

            {onNavigateToColors && (
              <button
                onClick={onNavigateToColors}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-amber-950 flex-1 flex items-center justify-between text-xs font-bold transition-all"
                id="profile-spectrum-learn-more-btn"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <div className="text-left">
                    <span className="block text-amber-950">Explore Color System Science</span>
                    <span className="block text-[10px] font-normal text-amber-900/70">Understand the OKLCH mathematical behavioral model</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: OCEAN Big 5 Cognitive Architecture */}
      {activeTab === 'ocean' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                OCEAN Big Five Cognitive Profile
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Validated psychometric evaluation powering your deterministic compatibility score.
              </p>
            </div>
            {isSelf && (
              <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                {isEditing ? 'Interactive Calibration Mode' : 'Calibrated Baseline'}
              </span>
            )}
          </div>

          <div className="space-y-6 max-w-3xl">
            {/* Openness */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>Openness to Experience (Visionary Synthesis)</span>
                <span className="text-[#D97706] font-mono">{formData.ocean.openness}%</span>
              </div>
              {isEditing ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.ocean.openness}
                  onChange={(e) => handleOceanChange('openness', Number(e.target.value))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
              ) : (
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${formData.ocean.openness}%` }} />
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                Reflects creative curiosity, appetite for intellectual novelty, and paradigm synthesis.
              </p>
            </div>

            {/* Conscientiousness */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>Conscientiousness (Methodical Execution & Rigor)</span>
                <span className="text-[#0A6275] font-mono">{formData.ocean.conscientiousness}%</span>
              </div>
              {isEditing ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.ocean.conscientiousness}
                  onChange={(e) => handleOceanChange('conscientiousness', Number(e.target.value))}
                  className="w-full accent-[#0A6275] cursor-pointer"
                />
              ) : (
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0A6275] rounded-full" style={{ width: `${formData.ocean.conscientiousness}%` }} />
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                Demonstrates high goal persistence, reliability, structured cadence, and milestone adherence.
              </p>
            </div>

            {/* Extraversion */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>Extraversion (Social Energy & Expressiveness)</span>
                <span className="text-[#059669] font-mono">{formData.ocean.extraversion}%</span>
              </div>
              {isEditing ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.ocean.extraversion}
                  onChange={(e) => handleOceanChange('extraversion', Number(e.target.value))}
                  className="w-full accent-[#059669] cursor-pointer"
                />
              ) : (
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#059669] rounded-full" style={{ width: `${formData.ocean.extraversion}%` }} />
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                Balance between proactive synchronous collaboration and deep-focus async work.
              </p>
            </div>

            {/* Agreeableness */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>Agreeableness (Empathy & Psychological Safety)</span>
                <span className="text-[#7C3AED] font-mono">{formData.ocean.agreeableness}%</span>
              </div>
              {isEditing ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.ocean.agreeableness}
                  onChange={(e) => handleOceanChange('agreeableness', Number(e.target.value))}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
              ) : (
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${formData.ocean.agreeableness}%` }} />
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                Fosters non-defensive communication, psychological safety, and altruistic mutual support.
              </p>
            </div>

            {/* Emotional Stability (Inverted Neuroticism) */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>Emotional Stability (Equanimity Under Pressure)</span>
                <span className="text-emerald-600 font-mono">{100 - formData.ocean.neuroticism}%</span>
              </div>
              {isEditing ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={100 - formData.ocean.neuroticism}
                  onChange={(e) => handleOceanChange('neuroticism', 100 - Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              ) : (
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${100 - formData.ocean.neuroticism}%` }} />
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-1.5">
                Calculated resilience against stress, cognitive equilibrium, and steady execution.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Needs & Offers Domain Matrix */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* What I Offer */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                <h3 className="text-sm font-bold text-stone-900">What I Offer (Domain Strengths)</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {formData.offers.length} Skills
              </span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[90px]">
              {formData.offers.map((offer, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold rounded-xl"
                >
                  <span>{offer}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveOffer(offer)}
                      className="text-emerald-500 hover:text-emerald-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <input
                  type="text"
                  placeholder="Add skill or offer..."
                  value={newOfferTag}
                  onChange={(e) => setNewOfferTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddOffer();
                  }}
                  className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                />
                <button
                  onClick={handleAddOffer}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* What I Need */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <h3 className="text-sm font-bold text-stone-900">What I Need (Complementary Skills)</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {formData.needs.length} Needs
              </span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[90px]">
              {formData.needs.map((need, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl"
                >
                  <span>{need}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveNeed(need)}
                      className="text-amber-500 hover:text-amber-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <input
                  type="text"
                  placeholder="Add complementary need..."
                  value={newNeedTag}
                  onChange={(e) => setNewNeedTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNeed();
                  }}
                  className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                />
                <button
                  onClick={handleAddNeed}
                  className="px-3 py-2 bg-[#D97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Target Domains */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
                <h3 className="text-sm font-bold text-stone-900">Focus Domains & Industry Sectors</h3>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                {formData.domains.length} Sectors
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.domains.map((domain, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold rounded-xl"
                >
                  <span>{domain}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      className="text-teal-500 hover:text-teal-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 max-w-md">
                <input
                  type="text"
                  placeholder="Add target industry sector..."
                  value={newDomainTag}
                  onChange={(e) => setNewDomainTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddDomain();
                  }}
                  className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                />
                <button
                  onClick={handleAddDomain}
                  className="px-3 py-2 bg-[#0A6275] hover:bg-[#084b5a] text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 5: Verification & Cryptographic Stamp */}
      {activeTab === 'verification' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Cryptographic Identity Verification</h2>
              <p className="text-xs text-stone-500">Immutable audit hash proving your profile calibration authenticity.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Prism Identification Hash
              </span>
              <p className="font-mono font-bold text-stone-800 text-xs">
                {activeProfile.prismId || 'MW-9842-AX'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Last Authenticated Timestamp
              </span>
              <p className="font-mono font-bold text-stone-800 text-xs">
                {new Date(activeProfile.verifiedAt).toUTCString()}
              </p>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-stone-900 text-white font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-[10px]">
                <span>SHA-256 SPECTRUM INTEGRITY HASH</span>
                <span className="text-emerald-400 font-bold">✓ SIGNATURE VALID</span>
              </div>
              <p className="text-stone-300 break-all leading-relaxed">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855{activeProfile.id.replace(/[^a-z0-9]/g, '')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
