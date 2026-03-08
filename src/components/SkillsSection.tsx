const skills = [
  { name: "Linux / Unix", level: 95 },
  { name: "Shell Scripting", level: 90 },
  { name: "Docker & Kubernetes", level: 85 },
  { name: "Web Design (HTML/CSS/JS)", level: 88 },
  { name: "Mobile Photography", level: 92 },
  { name: "CI/CD & DevOps", level: 85 },
  { name: "Cloud Infrastructure", level: 80 },
  { name: "UI/UX Design", level: 78 },
];

const SkillsSection = () => (
  <section id="skills" className="border-y border-border bg-card py-24">
    <div className="container mx-auto px-6">
      <div className="mb-16 text-center">
        <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
          // skills
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Tech Stack
        </h2>
      </div>

      <div className="mx-auto grid max-w-3xl gap-5">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-display text-sm text-foreground">{skill.name}</span>
              <span className="font-display text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
