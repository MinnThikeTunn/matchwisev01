import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, MessageCircle, Sparkle, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DemoProgress } from "./DemoProgress";

const NAV = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/introductions", label: "Introductions", icon: Sparkle },
  { to: "/chats", label: "Chats", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({
  children,
  title,
  helper,
  showNav = true,
}: {
  children: ReactNode;
  title?: string;
  helper?: string;
  showNav?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <DemoProgress />
      <main className="mx-auto w-full max-w-2xl px-5 pb-32 pt-6">
        {title ? (
          <header className="mb-6">
            <h1 className="text-3xl leading-tight sm:text-4xl">{title}</h1>
            {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
          </header>
        ) : null}
        {children}
      </main>

      {showNav ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
          <ul className="mx-auto flex w-full max-w-2xl items-stretch">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <li key={to} className="flex-1">
                  <Link
                    to={to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

export function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("ink-hairline rounded-2xl bg-card p-5 shadow-paper", className)}>
      {children}
    </section>
  );
}
