import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, BookOpen } from "lucide-react";

// Local fallbacks
const fallbackSkills = [
  { name: "Linux / Unix", level: 95 },
  { name: "Shell Scripting", level: 90 },
  { name: "Docker & Kubernetes", level: 85 },
  { name: "Web Design (HTML/CSS/JS)", level: 88 },
  { name: "Mobile Photography", level: 92 },
  { name: "CI/CD & DevOps", level: 85 },
  { name: "Cloud Infrastructure", level: 80 },
  { name: "UI/UX Design", level: 78 },
];

const fallbackCerts = [
  { name: "Red Hat Certified Specialist in OpenShift Virtualization", status: "Reading", tag: null },
  { name: "Oracle Cloud Infrastructure Foundations 2020 Certified Associate", tag: "OCI-FAA", status: null },
  { name: "Red Hat Certified Engineer", tag: "RHCE", status: null },
  { name: "Red Hat Certified System Administrator", tag: "RHCSA", status: null },
  { name: "AWS Certified Solutions Architect Associate", tag: "AWS-SAA", status: null },
  { name: "Cisco Certified Network Professional", tag: "CCNP", status: null },
  { name: "Cisco Certified Network Associate", tag: "CCNA", status: null },
  { name: "The Fundamentals of Digital Marketing", tag: "Google", status: null },
];

const SkillsSection = () => {
  const [skills, setSkills] = useState(fallbackSkills);
  const [certifications, setCertifications] = useState(fallbackCerts);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsRes, certsRes] = await Promise.all([
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("certifications").select("*").order("sort_order"),
      ]);
      if (skillsRes.data && skillsRes.data.length > 0) {
        setSkills(skillsRes.data as { name: string; level: number }[]);
      }
      if (certsRes.data && certsRes.data.length > 0) {
        setCertifications(certsRes.data as { name: string; tag: string | null; status: string | null }[]);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="skills" className="border-y border-border bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
            // skills & certs
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Tech Stack & Certifications
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Tech Stack */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Tech Stack</h3>
            </div>
            <div className="grid gap-5">
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

          {/* Certifications */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Certifications</h3>
            </div>
            <div className="grid gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-primary/30"
                >
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-display text-sm leading-snug text-foreground">{cert.name}</p>
                    {cert.status ? (
                      <span className="mt-1 inline-block rounded-full bg-secondary/20 px-2 py-0.5 font-display text-xs text-secondary">
                        {cert.status}
                      </span>
                    ) : cert.tag ? (
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 font-display text-xs text-primary">
                        {cert.tag}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
