import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Palette, 
  Menu, 
  X, 
  LayoutDashboard, 
  Compass, 
  ShieldCheck, 
  User, 
  Share2, 
  ChevronRight, 
  Check, 
  KeyRound, 
  LogOut, 
  Users,
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';
import { getColorIdentity } from '../lib/colorSystem';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCustomMatch: () => void;
  onOpenQuestionnaire: () => void;
  onOpenNetwork: () => void;
  onOpenChromaticTest?: () => void;
  currentUser: UserProfile;
  highContrast: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenCustomMatch,
  onOpenQuestionnaire,
  onOpenNetwork,
  onOpenChromaticTest,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userColor = getColorIdentity(currentUser.id);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (view: ViewMode) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenNetwork();
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Your chromatic signature & global synergy'
    },
    {
      id: 'discovery' as ViewMode,
      label: 'Discovery',
      icon: Sparkles,
      description: 'Card-by-card connect / pass with explainable evidence'
    },
    {
      id: 'maps' as ViewMode,
      label: 'Maps',
      icon: Compass,
      description: 'Cartography & multi-tier resonance exploration'
    },
    {
      id: 'verification' as ViewMode,
      label: 'Verification',
      icon: ShieldCheck,
      description: 'Zero-leakage proof of chromatic spectrum'
    },
    {
      id: 'colors' as ViewMode,
      label: 'Color System',
      icon: Palette,
      description: '5 Core channels & harmonic archetype matrix'
    },
    {
      id: 'profile' as ViewMode,
      label: 'Profile',
      icon: User,
      description: 'Big Five psychometrics & vector parameters'
    }
  ];

  return (
    <>
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand & Desktop Navigation */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0 min-w-0">
            {/* Logo / Brand Name */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2 text-left group min-h-[40px] focus:outline-none shrink-0"
              id="brand-logo-btn"
              aria-label="Matchwise Prism Home"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#059669] shadow-xs shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-stone-900 group-hover:text-[#D97706] transition-colors whitespace-nowrap">
                Matchwise Prism
              </span>
            </button>

            {/* Desktop Navigation Links (hidden on mobile/tablet < md) */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-7 shrink-0" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`text-xs lg:text-sm font-semibold transition-all relative py-1 whitespace-nowrap focus:outline-none ${
                      isActive
                        ? 'text-[#D97706]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                    id={`nav-${item.id}-btn`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center: Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden xl:flex flex-1 max-w-md mx-2 2xl:mx-6 min-w-0"
          >
            <div className="relative w-full group">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#D97706] transition-colors" />
              <input
                type="text"
                placeholder="Search by name, chromatic frequency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpenNetwork();
                }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] focus:bg-white transition-all"
                id="header-search-input"
              />
            </div>
          </form>

          {/* Right: Actions, Notifications, User Menu, & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Custom AI Match Action Button (Desktop & Tablet) */}
            <button
              onClick={onOpenCustomMatch}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 text-xs font-semibold rounded-full border border-[#D97706]/30 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
              id="header-custom-ai-match-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span>Custom AI Match</span>
            </button>

            {/* Notifications Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors relative min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none"
                id="header-notifications-btn"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#D97706] rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-900">Chromatic Feed</span>
                    <span className="text-[10px] text-[#D97706] font-bold px-2 py-0.5 bg-amber-50 rounded-full border border-amber-200">
                      2 New
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                        <span>Solar & Cobalt Resonance</span>
                      </p>
                      <p className="text-stone-500 text-[11px] mt-1 leading-snug">
                        Elias Thorne matches your System Architecture spectrum.
                      </p>
                    </div>
                    <div className="text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        <span>Chromatic Signature Verified</span>
                      </p>
                      <p className="text-stone-500 text-[11px] mt-1 leading-snug">
                        Your Conic Ring spectrum has been officially authenticated.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar (Desktop/Tablet) */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200 hover:opacity-80 transition-all focus:outline-none ${
                currentView === 'profile' ? 'opacity-100' : ''
              }`}
              id="header-profile-avatar-btn"
              title="View Dedicated Profile"
              aria-label="View Profile"
            >
              <div
                className={`w-8 h-8 rounded-full ring-2 overflow-hidden transition-all ${
                  currentView === 'profile' ? 'ring-3 ring-[#D97706]' : 'ring-stone-200'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle Button (Visible on mobile < md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:bg-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
              id="mobile-hamburger-menu-btn"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-stone-900" />
              ) : (
                <Menu className="w-6 h-6 text-stone-900" />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-out border-l border-stone-200 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#059669] shadow-xs" />
            <span className="font-bold text-stone-900 text-base">Matchwise Prism</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors focus:outline-none"
            aria-label="Close menu"
            id="mobile-drawer-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* User Profile Card in Mobile Menu */}
          <div className="p-3.5 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl p-0.5 bg-white shadow-xs overflow-hidden ring-2"
                style={{ ['--tw-ring-color' as any]: userColor.primaryColor }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-stone-900 truncate">
                    {currentUser.name}
                  </h3>
                </div>
                <p className="text-[11px] font-medium text-stone-500 truncate">
                  {currentUser.title}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  <span className="text-[10px] font-bold text-[#D97706] truncate">
                    {userColor.harmonicTitle}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('profile')}
              className="mt-3 w-full py-1.5 px-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              id="mobile-view-profile-btn"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>View Chromatic Dossier</span>
            </button>
          </div>

          {/* Search Input for Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search spectrum or candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] transition-all"
              id="mobile-drawer-search-input"
            />
          </form>

          {/* Main Navigation List */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-1.5">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left min-h-[48px] ${
                    isActive
                      ? 'bg-amber-500/15 text-[#D97706] font-bold border border-amber-500/30'
                      : 'text-stone-700 hover:bg-stone-100 font-semibold'
                  }`}
                  id={`mobile-nav-${item.id}-btn`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-[#D97706] text-white shadow-xs' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm block">{item.label}</span>
                      <span className="text-[10px] text-stone-500 font-normal block">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Action Tools */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-1">
              Prism Actions
            </div>

            {/* Custom AI Match Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCustomMatch();
              }}
              className="w-full flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 text-[#D97706] border border-amber-500/30 rounded-xl text-xs font-bold transition-all text-left min-h-[48px]"
              id="mobile-custom-match-btn"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-[#D97706]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span>Custom AI Match Prompt</span>
                <span className="block text-[10px] font-normal text-amber-700/80">
                  Find candidates via natural language
                </span>
              </div>
            </button>

            {/* Explore Network Graph Modal Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenNetwork();
              }}
              className="w-full flex items-center gap-3 p-3 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold transition-all text-left min-h-[48px]"
              id="mobile-network-graph-btn"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-200/80 flex items-center justify-center text-stone-700">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span>Network Graph Explorer</span>
                <span className="block text-[10px] font-normal text-stone-500">
                  Interactive multi-node topology
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Prism v2.4 Standard</span>
          <span className="font-mono text-[10px] text-stone-500">OKLCH Deterministic</span>
        </div>

      </div>
    </>
  );
};

