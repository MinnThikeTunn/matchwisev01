import React, { useState, useMemo } from 'react';
import { UserProfile, EngineTier, IntentSubMode } from '../types';
import { RealTimeOpenStreetMap } from './RealTimeOpenStreetMap';
import { 
  ArrowRight, 
  Palette, 
  Sparkles, 
  MapPin, 
  Compass, 
  Search, 
  Globe, 
  Heart, 
  Briefcase, 
  Zap, 
  Users, 
  Flame, 
  GraduationCap, 
  BookOpen, 
  Code, 
  Layers, 
  Sliders, 
  ShieldCheck,
  Activity,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { getColorIdentity } from '../lib/colorSystem';

interface MapsViewProps {
  candidates: UserProfile[];
  currentUser: UserProfile;
  onSelectCandidate: (candidate: UserProfile) => void;
}

interface MapTierConfig {
  id: EngineTier;
  label: string;
  badge: string;
  tagline: string;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  icon: React.ElementType;
  description: string;
  subModes: {
    id: 'ALL' | IntentSubMode;
    label: string;
    description: string;
    icon: React.ElementType;
  }[];
}

const MAP_TIERS: MapTierConfig[] = [
  {
    id: 'PERSONAL',
    label: 'Personal Map',
    badge: 'Human Connection & Social Life',
    tagline: 'Authentic relationships, emotional safety, and shared life experiences.',
    themeColor: '#059669', // Verdant Emerald
    accentBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: Heart,
    description: 'Cartography of human resonance. Filter by dating alignment, platonic friendship chemistry, or weekend activity cohorts.',
    subModes: [
      {
        id: 'ALL',
        label: 'All Personal Nodes',
        description: 'Explore the full spectrum of personal, social, and dating connections.',
        icon: Users
      },
      {
        id: 'DATING',
        label: 'Dating & Romance',
        description: 'Long-term emotional compatibility, philosophical congruence, and lifestyle alignment.',
        icon: Heart
      },
      {
        id: 'FRIENDS',
        label: 'Platonic Friendship',
        description: 'Deep mutual trust, empathetic camaraderie, and shared cultural values.',
        icon: Users
      },
      {
        id: 'ACTIVITIES',
        label: 'Activity & Sports Partners',
        description: 'Outdoor expeditions, bouldering, synth jams, creative workshops, and athletics.',
        icon: Activity
      }
    ]
  },
  {
    id: 'PROFESSIONAL',
    label: 'Professional Map',
    badge: 'Career, Systems & Mentorship',
    tagline: 'Strategic peer networks, domain mastery, and senior-junior growth trajectories.',
    themeColor: '#0A6275', // Deep Oceanic Teal
    accentBg: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    icon: Briefcase,
    description: 'Spatial directory of verified industry practitioners, researchers, and technical mentors across global tech hubs.',
    subModes: [
      {
        id: 'ALL',
        label: 'All Professional Nodes',
        description: 'Explore verified practitioners, executive peers, and study cohorts worldwide.',
        icon: Briefcase
      },
      {
        id: 'NETWORKING',
        label: 'Executive & Peer Networking',
        description: 'Strategic ecosystem exchanges, advisory dialogues, and domain insight sharing.',
        icon: Globe
      },
      {
        id: 'MENTORSHIP',
        label: 'Leadership & Mentorship',
        description: 'Senior guidance, org design coaching, engineering leadership, and growth trajectories.',
        icon: GraduationCap
      },
      {
        id: 'STUDY_PARTNERS',
        label: 'Study & Technical Research',
        description: 'Rigorous whitepaper reading groups, distributed systems study, and AI architecture cohorts.',
        icon: BookOpen
      }
    ]
  },
  {
    id: 'COLLABORATIVE',
    label: 'Collaborative Map',
    badge: 'High-Velocity Sprints & Co-Founding',
    tagline: 'Venture co-founders, hackathon squads, and open-source product collectives.',
    themeColor: '#D97706', // Solar Gold
    accentBg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Zap,
    description: 'High-velocity cartography for builders. Assemble sprint squads with complementary tech stacks and verified velocity.',
    subModes: [
      {
        id: 'ALL',
        label: 'All Collaborative Squads',
        description: 'Explore hackathon builders, open-source maintainers, and startup co-founders.',
        icon: Zap
      },
      {
        id: 'HACKATHON_TEAMS',
        label: 'Hackathon Sprint Rosters',
        description: '48-hour build teams with balanced frontend, backend, AI agent, and design superpowers.',
        icon: Flame
      },
      {
        id: 'PROJECT_GROUPS',
        label: 'Product Collectives & OSS',
        description: 'Long-term engineering syndicates, WebGL tooling collectives, and open-source squads.',
        icon: Code
      },
      {
        id: 'CUSTOM_AI_MATCH',
        label: 'Custom AI Co-Founding',
        description: 'Prompt-driven spatial matchmaking for bespoke venture co-founders and advisory roles.',
        icon: Sparkles
      }
    ]
  }
];

export const MapsView: React.FC<MapsViewProps> = ({
  candidates,
  currentUser,
  onSelectCandidate
}) => {
  // Map Type Selection: PERSONAL vs PROFESSIONAL vs COLLABORATIVE
  const [activeMapTier, setActiveMapTier] = useState<EngineTier>('COLLABORATIVE');

  // Sub-Purpose Selection within Active Map Tier
  const [activeSubMode, setActiveSubMode] = useState<'ALL' | IntentSubMode>('ALL');

  // Secondary Filter: Chromatic Spectrum Band
  const [selectedColorBand, setSelectedColorBand] = useState<string>('ALL');

  // Selected & Hovered Candidate State
  const [selectedPinCandidate, setSelectedPinCandidate] = useState<UserProfile | null>(null);
  const [_hoveredCandidate, setHoveredCandidate] = useState<UserProfile | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Active Map Tier Config Object
  const currentTierConfig = useMemo(() => {
    return MAP_TIERS.find(t => t.id === activeMapTier) || MAP_TIERS[0];
  }, [activeMapTier]);

  // When changing Map Tier, reset sub-mode to ALL
  const handleSelectMapTier = (tier: EngineTier) => {
    setActiveMapTier(tier);
    setActiveSubMode('ALL');
    setSelectedPinCandidate(null);
  };

  // Filtered Candidates computation based on:
  // 1. Active Map Tier (Personal / Professional / Collaborative)
  // 2. Active Sub-Purpose (Dating, Friends, Activities / Networking, Mentorship, Study / Hackathon, Projects, Custom AI)
  // 3. Chromatic Color Band (Solar Gold, Deep Teal, Verdant Green, Royal Purple)
  // 4. Text Search
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // 1. Filter by Map Tier
      if (c.tier !== activeMapTier) {
        // If candidate's primary tier doesn't match, check if they have multi-tier compatibility
        // For strict clean mapping, we match c.tier
        return false;
      }

      // 2. Filter by Sub-Purpose (if not 'ALL')
      if (activeSubMode !== 'ALL') {
        if (c.subMode !== activeSubMode) return false;
      }

      // 3. Filter by Color Band
      if (selectedColorBand !== 'ALL') {
        const color = getColorIdentity(c.id);
        if (selectedColorBand === 'GOLD' && !(color.primaryName.includes('Gold') || color.primaryName.includes('Amber') || color.secondaryName.includes('Gold'))) return false;
        if (selectedColorBand === 'TEAL' && !(color.primaryName.includes('Teal') || color.secondaryName.includes('Teal') || color.primaryName.includes('Cyan') || color.primaryName.includes('Cobalt'))) return false;
        if (selectedColorBand === 'GREEN' && !(color.primaryName.includes('Verdant') || color.primaryName.includes('Green') || color.primaryName.includes('Mint') || color.primaryName.includes('Emerald'))) return false;
        if (selectedColorBand === 'PURPLE' && !(color.primaryName.includes('Purple') || color.primaryName.includes('Violet') || color.primaryName.includes('Amethyst') || color.secondaryName.includes('Amethyst'))) return false;
      }

      // 4. Filter by Text Search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesLocation = c.location.toLowerCase().includes(q);
        const matchesOffers = c.needsOffers.offers.some(o => o.toLowerCase().includes(q));
        const matchesDomains = c.needsOffers.domains.some(d => d.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesLocation && !matchesOffers && !matchesDomains) {
          return false;
        }
      }

      return true;
    });
  }, [candidates, activeMapTier, activeSubMode, selectedColorBand, searchFilter]);

  // Counts for each sub-mode pill within the active tier
  const subModeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0 };
    candidates.filter(c => c.tier === activeMapTier).forEach(c => {
      counts.ALL = (counts.ALL || 0) + 1;
      counts[c.subMode] = (counts[c.subMode] || 0) + 1;
    });
    return counts;
  }, [candidates, activeMapTier]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300 space-y-6">
      
      {/* Header & 3 Maps Selector */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/60 text-xs font-bold mb-2 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '24s' }} />
              <span>OpenStreetMap Live Spatial Resonance Grid</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Prism Global Cartography
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
              Select one of the <strong>3 Map Cartographies</strong> to align spatial matching with your exact relational purpose.
            </p>
          </div>

          {/* Quick Color Band Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200/80">
            <span className="text-[10px] font-bold text-stone-500 uppercase px-2">
              Aura:
            </span>
            <button
              onClick={() => setSelectedColorBand('ALL')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedColorBand === 'ALL'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="map-color-all"
            >
              All
            </button>
            <button
              onClick={() => setSelectedColorBand('GOLD')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedColorBand === 'GOLD'
                  ? 'bg-[#D97706] text-white shadow-2xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
              id="map-color-gold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span>Gold</span>
            </button>
            <button
              onClick={() => setSelectedColorBand('TEAL')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedColorBand === 'TEAL'
                  ? 'bg-[#0A6275] text-white shadow-2xs'
                  : 'text-teal-800 hover:bg-teal-50'
              }`}
              id="map-color-teal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A6275]" />
              <span>Teal</span>
            </button>
            <button
              onClick={() => setSelectedColorBand('GREEN')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedColorBand === 'GREEN'
                  ? 'bg-[#059669] text-white shadow-2xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
              id="map-color-green"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Green</span>
            </button>
            <button
              onClick={() => setSelectedColorBand('PURPLE')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedColorBand === 'PURPLE'
                  ? 'bg-[#7C3AED] text-white shadow-2xs'
                  : 'text-purple-800 hover:bg-purple-50'
              }`}
              id="map-color-purple"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span>Purple</span>
            </button>
          </div>
        </div>

        {/* PRIMARY MAP SELECTOR: 3 Types of Maps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {MAP_TIERS.map((tier) => {
            const isSelected = activeMapTier === tier.id;
            const IconComponent = tier.icon;
            const totalNodesInTier = candidates.filter(c => c.tier === tier.id).length;

            return (
              <button
                key={tier.id}
                onClick={() => handleSelectMapTier(tier.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? `bg-white shadow-md ring-2 border-transparent`
                    : `bg-stone-50/70 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs`
                }`}
                style={{
                  ['--tw-ring-color' as any]: isSelected ? tier.themeColor : 'transparent'
                }}
                id={`map-tier-btn-${tier.id.toLowerCase()}`}
              >
                {/* Active Indicator Bar on top */}
                {isSelected && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: tier.themeColor }}
                  />
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border"
                      style={{
                        backgroundColor: isSelected ? `${tier.themeColor}15` : '#F5F5F4',
                        color: isSelected ? tier.themeColor : '#78716C',
                        borderColor: isSelected ? `${tier.themeColor}30` : '#E7E5E4'
                      }}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{tier.badge}</span>
                    </span>

                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isSelected ? tier.themeColor : '#E7E5E4',
                        color: isSelected ? '#FFFFFF' : '#57534E'
                      }}
                    >
                      {totalNodesInTier} Nodes
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-950">
                    {tier.label}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-medium">
                    {tier.subModes.length - 1} Sub-purposes
                  </span>
                  <span 
                    className="font-bold flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
                    style={{ color: tier.themeColor }}
                  >
                    <span>{isSelected ? 'Active Cartography' : 'Switch Map'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* SUB-PURPOSE ALIGNMENT STRIP (Dynamic based on selected map) */}
        <div 
          className="p-4 rounded-2xl border shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ 
            backgroundColor: `${currentTierConfig.themeColor}06`,
            borderColor: `${currentTierConfig.themeColor}25`
          }}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <currentTierConfig.icon className="w-4 h-4" style={{ color: currentTierConfig.themeColor }} />
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {currentTierConfig.label} Sub-Purposes:
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Filter spatial pins by specific relational intent in this cartography.
            </p>
          </div>

          {/* Sub-Purpose Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {currentTierConfig.subModes.map((sub) => {
              const isSubActive = activeSubMode === sub.id;
              const SubIcon = sub.icon;
              const count = subModeCounts[sub.id] || 0;

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubMode(sub.id);
                    setSelectedPinCandidate(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                    isSubActive
                      ? 'text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                  }`}
                  style={{
                    backgroundColor: isSubActive ? currentTierConfig.themeColor : undefined,
                    borderColor: isSubActive ? currentTierConfig.themeColor : undefined
                  }}
                  id={`subpurpose-btn-${sub.id.toLowerCase()}`}
                  title={sub.description}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                  <span 
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSubActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Real-Time OpenStreetMap Container + Live Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Live Real-Time OpenStreetMap */}
        <div className="lg:col-span-8 relative">
          <RealTimeOpenStreetMap
            currentUser={currentUser}
            candidates={filteredCandidates}
            selectedCandidate={selectedPinCandidate}
            onSelectCandidate={(c) => setSelectedPinCandidate(c)}
            onHoverCandidate={(c) => setHoveredCandidate(c)}
          />

          {/* Map Footer Summary Bar */}
          <div className="mt-3 p-3 bg-white border border-stone-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: currentTierConfig.themeColor }} />
              <span className="font-semibold text-stone-800">
                Displaying {filteredCandidates.length} Active Spatial Node{filteredCandidates.length !== 1 ? 's' : ''}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 font-mono text-[11px]">
                {currentTierConfig.label} &gt; {currentTierConfig.subModes.find(s => s.id === activeSubMode)?.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
              <span>Center: <strong>{currentUser.location}</strong></span>
              <span className="text-stone-300">|</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live OKLCH Mesh
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Interactive Node Inspector & Live Directory */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Node Search */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${currentTierConfig.label} nodes by skill, city...`}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-stone-800"
                id="map-node-search-input"
              />
            </div>
          </div>

          {/* Selected Candidate Inspector Card */}
          {selectedPinCandidate ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-md animate-in fade-in zoom-in-95 space-y-4">
              {(() => {
                const pCol = getColorIdentity(selectedPinCandidate.id);
                return (
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={selectedPinCandidate.avatar}
                            alt={selectedPinCandidate.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 shadow-xs"
                            style={{ borderColor: pCol.primaryColor }}
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                            style={{ backgroundColor: pCol.primaryColor }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-stone-900">{selectedPinCandidate.name}</h3>
                            <span 
                              className="px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase border"
                              style={{
                                backgroundColor: `${currentTierConfig.themeColor}15`,
                                color: currentTierConfig.themeColor,
                                borderColor: `${currentTierConfig.themeColor}30`
                              }}
                            >
                              {selectedPinCandidate.subMode.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">{selectedPinCandidate.title}</p>
                          <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{selectedPinCandidate.location}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPinCandidate(null)}
                        className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1"
                        title="Close Inspector"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Bio */}
                    <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                      {selectedPinCandidate.bio}
                    </p>

                    {/* Purpose Alignment Tag */}
                    <div 
                      className="mt-3 p-3 rounded-xl border flex items-center justify-between text-xs"
                      style={{
                        backgroundColor: `${currentTierConfig.themeColor}08`,
                        borderColor: `${currentTierConfig.themeColor}20`
                      }}
                    >
                      <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                        <currentTierConfig.icon className="w-3.5 h-3.5" style={{ color: currentTierConfig.themeColor }} />
                        <span>Purpose Mode</span>
                      </span>
                      <span className="font-bold text-stone-900">
                        {selectedPinCandidate.tier} • {selectedPinCandidate.subMode}
                      </span>
                    </div>

                    {/* Color Identity Badge */}
                    <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">Color Spectrum</span>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border"
                        style={{
                          backgroundColor: `${pCol.primaryColor}15`,
                          color: pCol.primaryColor,
                          borderColor: `${pCol.primaryColor}30`
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pCol.primaryColor }} />
                        {pCol.primaryName}
                      </span>
                    </div>

                    {/* Offers & Capabilities */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Domain Offers
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPinCandidate.needsOffers.offers.slice(0, 3).map((offer, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-semibold rounded-md"
                          >
                            {offer}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Inspect Full Dossier Action Button */}
                    <button
                      onClick={() => onSelectCandidate(selectedPinCandidate)}
                      className="mt-4 w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                      id="inspect-chromatic-dossier-btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Inspect Synergy Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Directory List of filtered nodes */
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-stone-500" />
                  <span>{currentTierConfig.label} Roster</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {filteredCandidates.length} Node{filteredCandidates.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredCandidates.length > 0 ? (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {filteredCandidates.map((cand) => {
                    const cCol = getColorIdentity(cand.id);
                    return (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedPinCandidate(cand)}
                        className="p-3 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        id={`map-roster-item-${cand.id}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-9 h-9 rounded-full object-cover ring-2"
                              style={{ borderColor: cCol.primaryColor }}
                              referrerPolicy="no-referrer"
                            />
                            <span 
                              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white"
                              style={{ backgroundColor: cCol.primaryColor }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-stone-950">
                                {cand.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">
                              {cand.title}
                            </p>
                            <p className="text-[10px] text-stone-400 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{cand.location}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full block border"
                            style={{
                              backgroundColor: `${currentTierConfig.themeColor}10`,
                              color: currentTierConfig.themeColor,
                              borderColor: `${currentTierConfig.themeColor}25`
                            }}
                          >
                            {cand.subMode.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] text-stone-400 mt-1 block">
                            Click to pin
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Filter className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-700">No nodes in this sub-purpose filter</p>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    Try selecting "All {currentTierConfig.label} Nodes" or clearing the search query.
                  </p>
                  <button
                    onClick={() => {
                      setActiveSubMode('ALL');
                      setSelectedColorBand('ALL');
                      setSearchFilter('');
                    }}
                    className="mt-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Reset Sub-Purpose Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
