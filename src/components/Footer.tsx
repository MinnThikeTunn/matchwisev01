import React, { useState } from 'react';

interface FooterProps {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  onOpenAccessibilityModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  highContrast,
  setHighContrast,
  onOpenAccessibilityModal
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'accessibility' | null>(null);

  return (
    <>
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 px-6 text-xs text-stone-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-semibold tracking-wider text-stone-400">
            © 2024 MATCHWISE PRISM SYSTEM
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-stone-900 transition-colors"
              id="footer-privacy-btn"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-stone-900 transition-colors"
              id="footer-terms-btn"
            >
              Terms of Service
            </button>
            <button
              onClick={() => {
                if (onOpenAccessibilityModal) onOpenAccessibilityModal();
                else setModalType('accessibility');
              }}
              className="hover:text-stone-900 transition-colors"
              id="footer-accessibility-btn"
            >
              Accessibility Settings
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-colors ${
                highContrast
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              id="footer-high-contrast-toggle"
            >
              {highContrast ? 'High Contrast: On' : 'High Contrast: Off'}
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
              {modalType === 'privacy' && 'Privacy Policy'}
              {modalType === 'terms' && 'Terms of Service'}
              {modalType === 'accessibility' && 'Accessibility Standards'}
            </h3>
            <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed max-h-72 overflow-y-auto pr-1">
              {modalType === 'privacy' && (
                <>
                  <p>
                    All psychometric evaluations, OCEAN Big Five coordinates, and Needs/Offers vectors are evaluated using zero-leakage deterministic pipelines.
                  </p>
                  <p>
                    Hard Boundary Constraints are filtered server-side. Blocklist queries never reveal requester identities to excluded candidates.
                  </p>
                </>
              )}
              {modalType === 'terms' && (
                <>
                  <p>
                    Matchwise Prism provides context-aware matching across Personal, Professional, and Collaborative tiers using the unified equation: Final Score = G · S · C.
                  </p>
                  <p>
                    AI components are strictly constrained to natural-language criteria translation and human-readable XAI rationale rewriting.
                  </p>
                </>
              )}
              {modalType === 'accessibility' && (
                <>
                  <p>
                    The Prism Spectrum translates chromatic channels into non-color dependent numeric and structured text tags.
                  </p>
                  <p>
                    Users with deuteranopia, protanopia, or tritanopia can toggle High Contrast Mode for enhanced legibility.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
