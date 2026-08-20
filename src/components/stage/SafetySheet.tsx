import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import {
  MEETING_CHECKLIST,
  REPORT_REASONS,
  blockCandidate,
  leaveConversation,
  reportCandidate,
} from '../../lib/twoStage';

export function SafetySheet({
  candidateId,
  candidateName,
  open,
  onClose,
  onLeft,
}: {
  candidateId: string;
  candidateName: string;
  open: boolean;
  onClose: () => void;
  onLeft?: () => void;
}) {
  const [reporting, setReporting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-t-3xl border border-stone-900/10 bg-white p-6 pb-8 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#0D7A94]" />
            <h2 className="font-[Playfair_Display] text-xl">Safety &amp; control</h2>
          </div>
          <button aria-label="Close safety sheet" onClick={onClose} className="text-stone-400">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="rounded-2xl bg-[#F4F7F4] p-4 text-sm text-stone-700">{done}</div>
        ) : reporting ? (
          <div>
            <p className="mb-3 text-sm text-stone-500">Why are you reporting {candidateName}?</p>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    reportCandidate(candidateId, reason);
                    setDone('Report submitted. Our team reviews reports manually in this prototype.');
                  }}
                  className="w-full rounded-xl border border-stone-900/10 px-4 py-3 text-left text-sm hover:border-stone-900/30"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#FAFBFD] p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                Plan a first meeting
              </p>
              <ul className="space-y-1.5 text-sm text-stone-700">
                {MEETING_CHECKLIST.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#A8C7A3]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-2">
              <button
                onClick={() => setReporting(true)}
                className="rounded-xl border border-stone-900/10 px-4 py-3 text-sm font-medium hover:border-stone-900/30"
              >
                Report profile
              </button>
              <button
                onClick={() => {
                  blockCandidate(candidateId);
                  setDone(`${candidateName} is blocked. They can no longer appear or message you.`);
                  onLeft?.();
                }}
                className="rounded-xl border border-stone-900/10 px-4 py-3 text-sm font-medium hover:border-stone-900/30"
              >
                Block profile
              </button>
              <button
                onClick={() => {
                  leaveConversation(candidateId);
                  setDone('You left the conversation. No message was sent to them.');
                  onLeft?.();
                }}
                className="rounded-xl bg-[#B94A48] px-4 py-3 text-sm font-medium text-white"
              >
                Leave the conversation
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-stone-400">
              This prototype does not perform background checks, identity verification, live
              tracking, or emergency response.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-stone-900/10 px-4 py-3 text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
