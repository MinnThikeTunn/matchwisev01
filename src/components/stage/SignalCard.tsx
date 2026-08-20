import React, { useRef, useState } from 'react';
import { BadgeCheck, MapPin } from 'lucide-react';
import { UserProfile } from '../../types';

export function SignalCard({
  profile,
  onSignal,
  onOpen,
}: {
  profile: UserProfile;
  onSignal: (action: 'curious' | 'pass') => void;
  onOpen?: () => void;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const end = () => {
    setDragging(false);
    if (Math.abs(dx) > 110) {
      onSignal(dx > 0 ? 'curious' : 'pass');
    } else if (!moved.current) {
      onOpen?.();
    }
    setDx(0);
  };

  const chips = [
    ...profile.needsOffers.domains.slice(0, 2),
    ...profile.needsOffers.offers.slice(0, 1),
  ];

  return (
    <div className="select-none">
      <div
        role="group"
        aria-label={`Profile card for ${profile.name}`}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          moved.current = false;
          setDragging(true);
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const next = e.clientX - startX.current;
          if (Math.abs(next) > 6) moved.current = true;
          setDx(next);
        }}
        onPointerUp={end}
        onPointerCancel={end}
        style={{
          transform: `translateX(${dx}px) rotate(${dx / 28}deg)`,
          transition: dragging ? 'none' : 'transform 220ms cubic-bezier(.2,.8,.2,1)',
        }}
        className="relative cursor-grab overflow-hidden rounded-3xl border border-stone-900/10 bg-white shadow-[0_20px_60px_-30px_rgba(23,33,29,0.5)] active:cursor-grabbing"
      >
        <div className="relative h-72 w-full overflow-hidden bg-stone-100">
          <img
            src={profile.avatar}
            alt={profile.name}
            draggable={false}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-stone-700">
            <BadgeCheck size={13} className="text-[#E9BC55]" /> Verified demo profile
          </div>
          {dx > 40 && (
            <div className="absolute right-4 top-4 rotate-6 rounded-lg border-2 border-[#A8C7A3] px-3 py-1 text-sm font-bold uppercase tracking-widest text-[#4b7a48]">
              Curious
            </div>
          )}
          {dx < -40 && (
            <div className="absolute left-4 top-14 -rotate-6 rounded-lg border-2 border-stone-400 px-3 py-1 text-sm font-bold uppercase tracking-widest text-stone-500">
              Pass
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-[Playfair_Display] text-2xl tracking-tight">{profile.name}</h2>
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <MapPin size={12} /> {profile.location}
            </span>
          </div>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.14em] text-stone-400">
            {profile.title} · looking for {profile.subMode.toLowerCase().replace('_', ' ')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{profile.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[#FAFBFD] px-3 py-1 text-xs text-stone-600 ring-1 ring-stone-900/10"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-[#FAFBFD] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
              A small thing I care about
            </p>
            <p className="mt-1 text-sm text-stone-700">{profile.riskTolerance}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => onSignal('pass')}
          className="rounded-xl border border-stone-900/15 bg-white px-4 py-3.5 text-sm font-semibold text-stone-600"
        >
          Pass for now
        </button>
        <button
          onClick={() => onSignal('curious')}
          className="rounded-xl bg-[#F2684A] px-4 py-3.5 text-sm font-semibold text-white"
        >
          I&apos;m curious
        </button>
      </div>
    </div>
  );
}
