import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import Terminal from "@/components/Terminal";

const roles = ["Linux Expert", "Mobile Photographer", "Web Designer", "Lead TechOps"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = roles[roleIndex];
    if (typing) {
      if (displayed.length < role.length) {
        const timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayed.length > 0) {
        const timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        return () => clearTimeout(timeout);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIndex]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        {/* Hidden easter eggs — only for those who inspect */}
        <span className="absolute bottom-[12%] right-[8%] font-display text-[6px] text-primary/[0.04] select-none pointer-events-none" aria-hidden="true">
          initium est finis finis est initium
        </span>
        <span className="absolute top-[18%] left-[5%] text-[10px] text-primary/[0.03] select-none pointer-events-none" aria-hidden="true">
          △
        </span>
        <span className="absolute bottom-[25%] left-[15%] text-[8px] text-secondary/[0.03] select-none pointer-events-none rotate-45" aria-hidden="true">
          ☊
        </span>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="fade-up mx-auto max-w-3xl">
          <p className="mb-4 font-display text-sm tracking-[0.3em] text-primary uppercase">
            ~/portfolio $
          </p>
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Kasun
            <span className="text-gradient"> Rajapaksha</span>
          </h1>
          <div className="mb-8 h-10 font-display text-xl text-muted-foreground md:text-2xl">
            <span className="text-secondary">&gt; </span>
            {displayed}
            <span className="terminal-cursor text-primary">▌</span>
          </div>
          <div className="fade-up fade-up-delay-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#about"
              className="rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--glow-primary)]"
            >
              Explore
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-border px-6 py-3 font-display text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
            >
              Get in Touch
            </a>
          </div>
          <div className="fade-up fade-up-delay-3">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
