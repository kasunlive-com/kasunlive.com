import { Terminal, Camera, Globe, Server } from "lucide-react";

const highlights = [
  { icon: Terminal, label: "Linux Expert", desc: "Deep expertise in Linux systems, shell scripting, and server administration." },
  { icon: Camera, label: "Creative Soul", desc: "Capturing life through mobile photography and exploring sound as a passionate musicophile and audiophile." },
  { icon: Globe, label: "Web Designer", desc: "Crafting modern, responsive, and user-centric web experiences." },
  { icon: Server, label: "Infrastructure Specialist", desc: "Designing resilient infrastructure and creating reliable systems that power the digital world." },
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <div className="mb-16 text-center">
        <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
          // about
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Who I Am
        </h2>
      </div>

      <div className="mx-auto mb-16 max-w-2xl text-center space-y-4">
        <p className="text-lg leading-relaxed text-muted-foreground">
          For the past 12 years, I've been working behind the scenes of technology engineering Linux systems, designing resilient infrastructure, and building modern web experiences. As an infrastructure specialist and systems architect, my focus is on creating reliable systems that power the digital world.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Beyond technology, I enjoy capturing life through mobile photography and exploring sound as a passionate musicophile and audiophile.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => (
          <div
            key={item.label}
            className={`fade-up fade-up-delay-${i + 1} group rounded-xl border border-border bg-card p-6 transition-all hover:glow-border`}
          >
            <div className="mb-4 inline-flex rounded-lg bg-muted p-3">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-display text-sm font-semibold text-foreground">
              {item.label}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
