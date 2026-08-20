import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { reportReasons } from "@/lib/matchwise/data";
import { useMatchwise } from "@/lib/matchwise/store";

export function SafetySheet({ profileId, name }: { profileId: string; name: string }) {
  const { blockProfile, reportProfile, leaveConversation } = useMatchwise();
  const navigate = useNavigate();
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Safety controls">
          <Shield className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-2xl rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl">Safety and control</SheetTitle>
          <SheetDescription>
            You can end this at any point. Matchwise does not run background checks, identity
            verification, or live tracking.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-8">
          {reporting ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">Why are you reporting {name}?</p>
              <ul className="space-y-2">
                {reportReasons.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => setReason(r)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        reason === r
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Anything else we should know? (optional)"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setReporting(false)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={!reason}
                  onClick={() => {
                    reportProfile(profileId, reason ?? "", details);
                    setReporting(false);
                    setOpen(false);
                    toast.success("Report sent to the moderation queue.");
                  }}
                >
                  Send report
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-sm font-semibold">Planning a first meeting</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Meet in a public place you already know.</li>
                  <li>Tell a friend where you are going and when.</li>
                  <li>Arrange your own transport both ways.</li>
                </ul>
              </div>

              <div className="grid gap-2">
                <Button variant="outline" onClick={() => setReporting(true)}>
                  Report {name}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    leaveConversation(profileId);
                    setOpen(false);
                    toast("You left the conversation.");
                    void navigate({ to: "/chats" });
                  }}
                >
                  Leave the conversation
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    blockProfile(profileId);
                    setOpen(false);
                    toast.success(`${name} is blocked everywhere in Matchwise.`);
                    void navigate({ to: "/chats" });
                  }}
                >
                  Block {name}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
