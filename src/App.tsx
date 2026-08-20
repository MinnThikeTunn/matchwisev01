import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { MapsView } from './components/MapsView';
import { DiscoveryView } from './components/DiscoveryView';
import { VerificationView } from './components/VerificationView';
import { SynergyMatchView } from './components/SynergyMatchView';
import { ProfileView } from './components/ProfileView';
import { ColorSystemView } from './components/ColorSystemView';
import { CustomAiMatchModal } from './components/CustomAiMatchModal';
import { NetworkModal } from './components/NetworkModal';
import { OnboardingQuestionnaire } from './components/OnboardingQuestionnaire';
import { ChromaticTestModal } from './components/ChromaticTestModal';
import { CURRENT_USER, MOCK_PROFILES } from './data/mockData';
import { UserProfile, ViewMode } from './types';
import { ChromaticAssessmentResult } from './lib/colorSystem';
import { ONBOARDING_COMPLETE_KEY } from './lib/onboardingStorage';
import {
  saveProfileToCloud,
  loadProfileFromCloud,
  fetchPublicProfiles,
  cacheProfileLocally,
  readCachedFeatures,
  markOnboardingComplete,
} from './lib/cloudProfile';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  
  // Load saved user profile if available, otherwise default to CURRENT_USER
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('matchwise_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return CURRENT_USER;
  });

  const [candidatePool, setCandidatePool] = useState<UserProfile[]>(MOCK_PROFILES);
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile>(
    MOCK_PROFILES.find(p => p.id === 'user-sam-reed') || MOCK_PROFILES[3]
  );

  const [highContrast, setHighContrast] = useState(false);

  // Check if first-timer (test not completed yet in localStorage)
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(() => {
    try {
      return localStorage.getItem('matchwise_chromatic_test_completed') !== 'true';
    } catch {
      return false;
    }
  });

  // Open assessment modal automatically if first-timer
  const [isChromaticTestOpen, setIsChromaticTestOpen] = useState<boolean>(false);

  // Modals state
  const [isCustomMatchOpen, setIsCustomMatchOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_COMPLETE_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    cacheProfileLocally(updated);
    void saveProfileToCloud(updated, readCachedFeatures(), true);
  };

  // Hydrate from the cloud database on first load (no sign-in required).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cloud = await loadProfileFromCloud();
      if (cancelled) return;

      if (cloud.profile) {
        setCurrentUser(cloud.profile);
        cacheProfileLocally(cloud.profile, cloud.features);
        if (cloud.completed) {
          markOnboardingComplete();
          setIsQuestionnaireOpen(false);
        }
      } else {
        // First time on this device with cloud storage: upload whatever is local.
        const localFeatures = readCachedFeatures();
        const alreadyCompleted = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
        if (localFeatures || alreadyCompleted) {
          void saveProfileToCloud(currentUser, localFeatures, alreadyCompleted);
        }
      }

      const publicProfiles = await fetchPublicProfiles();
      if (cancelled || publicProfiles.length === 0) return;
      setCandidatePool(prev => {
        const mine = cloud.profile?.id;
        const fresh = publicProfiles.filter(p => p.id !== mine && p.name);
        const seen = new Set(fresh.map(p => p.id));
        return [...fresh, ...prev.filter(p => !seen.has(p.id))];
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompleteChromaticTest = (updatedUser: UserProfile, _result: ChromaticAssessmentResult) => {
    handleUpdateUser(updatedUser);
    setIsFirstTimer(false);
  };

  const handleSelectCandidate = (candidate: UserProfile) => {
    setSelectedCandidate(candidate);
    setCurrentView('synergy');
  };


  const quickMatches = candidatePool.slice(0, 4);

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      highContrast ? 'bg-white text-black font-semibold' : 'bg-[#FAFBFD] text-stone-900'
    }`}>
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCustomMatch={() => setIsCustomMatchOpen(true)}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
        onOpenNetwork={() => setIsNetworkOpen(true)}
        onOpenChromaticTest={() => setIsChromaticTestOpen(true)}
        currentUser={currentUser}
        highContrast={highContrast}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            quickMatches={quickMatches}
            onSelectCandidate={handleSelectCandidate}
            onOpenNetworkModal={() => setIsNetworkOpen(true)}
            onOpenCustomMatch={() => setIsCustomMatchOpen(true)}
            onNavigateToColors={() => setCurrentView('colors')}
            onNavigateToMaps={(_tier) => {
              setCurrentView('maps');
            }}
          />
        )}

        {currentView === 'discovery' && (
          <DiscoveryView
            currentUser={currentUser}
            candidatePool={candidatePool}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {currentView === 'maps' && (
          <MapsView
            candidates={candidatePool}
            currentUser={currentUser}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {currentView === 'verification' && (
          <VerificationView currentUser={currentUser} />
        )}

        {currentView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            candidatePool={candidatePool}
            onUpdateProfile={handleUpdateUser}
            onSelectCandidateSynergy={handleSelectCandidate}
            onNavigateToColors={() => setCurrentView('colors')}
            onOpenChromaticTest={() => setIsChromaticTestOpen(true)}
          />
        )}

        {currentView === 'colors' && (
          <ColorSystemView 
            onOpenChromaticTest={() => setIsChromaticTestOpen(true)} 
          />
        )}

        {currentView === 'synergy' && (
          <SynergyMatchView
            requester={currentUser}
            candidate={selectedCandidate}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Modals */}
      <ChromaticTestModal
        isOpen={isChromaticTestOpen}
        onClose={() => setIsChromaticTestOpen(false)}
        currentUser={currentUser}
        onCompleteTest={handleCompleteChromaticTest}
        isFirstTimer={isFirstTimer}
      />

      <CustomAiMatchModal
        isOpen={isCustomMatchOpen}
        onClose={() => setIsCustomMatchOpen(false)}
        candidatePool={candidatePool}
        onSelectCandidate={handleSelectCandidate}
      />

      <NetworkModal
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
        currentUser={currentUser}
        candidates={candidatePool}
        onSelectCandidate={handleSelectCandidate}
      />

      <OnboardingQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        currentUser={currentUser}
        onComplete={(updated, features) => {
          setCurrentUser(updated);
          cacheProfileLocally(updated, features);
          markOnboardingComplete();
          void saveProfileToCloud(updated, features, true);
        }}
      />    </div>
  );
}
