import { useState } from "react";
import { Mail, Linkedin, Terminal, Briefcase, Wrench, HandMetal, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const OPTIONS = [
  { id: "build", label: "Need to Build a Website", icon: Briefcase, subject: "Website Build Inquiry" },
  { id: "support", label: "Need Tech Support", icon: Wrench, subject: "Tech Support Request" },
  { id: "hello", label: "Say Hello 👋", icon: HandMetal, subject: "Hello from Portfolio" },
] as const;

const ContactSection = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"options" | "email">("options");
  const [selected, setSelected] = useState<typeof OPTIONS[number] | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const reset = () => {
    setStep("options");
    setSelected(null);
    setEmail("");
    setError("");
    setSending(false);
  };

  const handleSelect = (option: typeof OPTIONS[number]) => {
    setSelected(option);
    setStep("email");
  };

  const handleSend = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSending(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-email", {
        body: {
          email: email.trim(),
          reason: selected!.label,
        },
      });

      if (fnError) throw fnError;

      toast({
        title: "Email sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Send email error:", err);
      setError("Failed to send email. Please try again.");
      setSending(false);
    }
  };

  return (
    <section id="contact" className="border-t border-border bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
            // contact
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Let's Connect
          </h2>
        </div>

        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-muted-foreground">
            Interested in working together or just want to say hello? Reach out!
          </p>

          <div className="flex flex-col gap-4">
            {/* Email address - display only */}
            <a
              href="mailto:hello@kasunlive.com"
              className="flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-4 font-display text-sm text-foreground transition-all hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
            >
              <Mail className="h-5 w-5 text-primary" />
              hello@kasunlive.com
            </a>

            {/* Website link */}
            <a
              href="https://kasunlive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-4 font-display text-sm text-foreground transition-all hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
            >
              <Globe className="h-5 w-5 text-secondary" />
              kasunlive.com
            </a>
          </div>

          {/* Separate send email button */}
          <button
            onClick={() => { reset(); setOpen(true); }}
            className="mt-2 inline-flex items-center justify-center gap-3 rounded-xl border-2 border-primary bg-primary/10 px-8 py-4 font-display text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] cursor-pointer"
          >
            <Send className="h-5 w-5" />
            Click Here to Send an Email
          </button>
        </div>
      </div>

      {/* Send Mail Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {step === "options" ? "How can I help?" : selected?.label}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {step === "options"
                ? "Choose a reason for reaching out"
                : "Enter your email so I can get back to you"}
            </DialogDescription>
          </DialogHeader>

          {step === "options" ? (
            <div className="flex flex-col gap-3 pt-2">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-5 py-4 text-left font-display text-sm text-foreground transition-all hover:border-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.12)] cursor-pointer"
                >
                  <opt.icon className="h-5 w-5 shrink-0 text-primary" />
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-xs text-destructive">{error}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setStep("options"); setEmail(""); setError(""); }}
                  className="gap-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </Button>
                <Button size="sm" onClick={handleSend} disabled={sending} className="flex-1 gap-2">
                  {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  {sending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="container mx-auto mt-24 border-t border-border px-6 pt-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between sm:gap-4">
          <p className="font-display text-xs text-muted-foreground">
            <Terminal className="mr-1 inline h-3 w-3 text-primary" />
            © 2026{" "}
            <a
              href="https://kasunlive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              kasunlive.com
            </a>
            {" "}— All rights reserved.
          </p>
          <a
            href="/privacy-policy"
            className="font-display text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy Policy
          </a>
          <p className="font-display text-xs text-muted-foreground">
            Built with passion & code —{" "}
            <a
              href="https://zappyfi.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-all hover:text-secondary hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
            >
              ZAPPYfi
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
