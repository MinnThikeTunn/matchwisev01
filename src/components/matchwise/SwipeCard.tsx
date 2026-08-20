import { useRef, useState } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import type { Profile } from "@/lib/matchwise/data";
import { INTENT_LABEL } from "@/lib/matchwise/data";
import { cn } from "@/lib/utils";

export function SwipeCard({
  profile,
  onSignal,
  onOpen,
  stacked,
}: {
  profile: Profile;
  onSignal: (direction: "curious" | "pass") => void;
  onOpen: () => void;
  stacked?: boolean;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const moved = useRef(false);

  const finish = () => {
    setDragging(false);
    start.current = null;
    if (dx > 110) onSignal("curious");
    else if (dx < -110) onSignal("pass");
    setDx(0);
  };

  const intentTone = dx > 40 ? "curious" : dx < -40 ? "pass" : null;

  return (
    <article
      className={cn(
        "ink-hairline relative overflow-hidden rounded-3xl bg-card shadow-lift select-none",
        stacked && "pointer-events-none absolute inset-0 scale-[0.96] opacity-60",
      )}
      style={
        stacked
          ? undefined
          : {
              transform: `translateX(${dx}px) rotate(${dx / 28}deg)`,
              transition: dragging ? "none" : "transform 320ms cubic-bezier(.22,1.2,.36,1)",
              touchAction: "pan-y",
            }
      }
      onPointerDown={(e) => {
        if (stacked) return;
        start.current = e.clientX;
        moved.current = false;
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start.current === null) return;
        const next = e.clientX - start.current;
        if (Math.abs(next) > 6) moved.current = true;
        setDx(next);
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      onClick={() => {
        if (!moved.current) onOpen();
      }}
    >
      <div className="relative">
        <img
          src={profile.photo}
          alt={`${profile.name}, ${profile.age}`}
          width={768}
          height={1024}
          className="aspect-[4/5] w-full object-cover"
          draggable={false}
        />
        {intentTone ? (
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
              intentTone === "curious"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {intentTone === "curious" ? "I'm curious" : "Pass for now"}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h2 className="text-2xl">
            {profile.name}, {profile.age}
          </h2>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {profile.city}
          </span>
          {profile.verifiedDemo ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-honey/30 px-2 py-0.5 text-xs font-semibold text-honey-foreground">
              <BadgeCheck className="size-3.5" aria-hidden />
              Verified demo profile
            </span>
          ) : null}
        </div>

        <p className="text-[15px] leading-relaxed">{profile.bio}</p>
        <p className="text-sm font-semibold text-sage-foreground">{INTENT_LABEL[profile.intent]}</p>

        <ul className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 3).map((i) => (
            <li
              key={i}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium"
            >
              {i}
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-secondary/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {profile.prompt.question}
          </p>
          <p className="mt-1 text-[15px]">{profile.prompt.answer}</p>
        </div>
      </div>
    </article>
  );
}
