import { Terminal, Camera, Globe, Server } from "lucide-react";

const highlights = [
  { icon: Terminal, label: "Linux Expert", desc: "Deep expertise in Linux systems, shell scripting, and server administration." },
  { icon: Camera, label: "Mobile Photography", desc: "Capturing stunning visuals with nothing but a smartphone and creative vision." },
  { icon: Globe, label: "Web Designer", desc: "Crafting modern, responsive, and user-centric web experiences." },
  { icon: Server, label: "Lead TechOps", desc: "Leading technical operations, infrastructure, and DevOps practices." },
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

      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="text-lg leading-relaxed text-muted-foreground">
          I'm a multidisciplinary tech professional who thrives at the intersection of
          systems engineering, creative photography, and modern web design. I lead technical
          operations by day and explore the world through my camera lens by night.
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
