import { Mail, Globe, Terminal } from "lucide-react";

const ContactSection = () => (
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
          <a
            href="mailto:hello@kasunlive.com"
            className="flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-4 font-display text-sm text-foreground transition-all hover:glow-border"
          >
            <Mail className="h-5 w-5 text-primary" />
            hello@kasunlive.com
          </a>
          <a
            href="https://kasunlive.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-4 font-display text-sm text-foreground transition-all hover:glow-border"
          >
            <Globe className="h-5 w-5 text-secondary" />
            kasunlive.com
          </a>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="container mx-auto mt-24 border-t border-border px-6 pt-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-display text-xs text-muted-foreground">
          <Terminal className="mr-1 inline h-3 w-3 text-primary" />
          © 2026 kasunlive.com — All rights reserved.
        </p>
        <p className="font-display text-xs text-muted-foreground">
          Built with passion & code
        </p>
      </div>
    </div>
  </section>
);

export default ContactSection;
