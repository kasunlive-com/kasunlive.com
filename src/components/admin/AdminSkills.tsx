import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
  sort_order: number;
}

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState(50);

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    setSkills((data as Skill[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const addSkill = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("skills").insert({
      name: newName.trim(),
      level: newLevel,
      sort_order: skills.length,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewName("");
      setNewLevel(50);
      fetchSkills();
      toast({ title: "Skill added" });
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const { error } = await supabase.from("skills").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchSkills();
    }
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchSkills();
      toast({ title: "Skill deleted" });
    }
  };

  const moveSkill = async (index: number, dir: "up" | "down") => {
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= skills.length) return;
    const a = skills[index], b = skills[swap];
    await Promise.all([
      supabase.from("skills").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("skills").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchSkills();
  };

  if (loading) return <p className="font-display text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Manage Skills</h2>

      {/* Add new */}
      <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Skill name"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={newLevel}
            onChange={(e) => setNewLevel(Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none focus:border-primary"
          />
          <span className="font-display text-xs text-muted-foreground">%</span>
        </div>
        <Button onClick={addSkill} size="sm" className="gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveSkill(index, "up")} disabled={index === 0} className="text-muted-foreground hover:text-primary disabled:opacity-20">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button onClick={() => moveSkill(index, "down")} disabled={index === skills.length - 1} className="text-muted-foreground hover:text-primary disabled:opacity-20">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <input
              defaultValue={skill.name}
              onBlur={(e) => {
                if (e.target.value !== skill.name) updateSkill(skill.id, { name: e.target.value });
              }}
              className="flex-1 bg-transparent font-display text-sm text-foreground outline-none focus:border-b focus:border-primary"
            />
            <input
              type="number"
              min={0}
              max={100}
              defaultValue={skill.level}
              onBlur={(e) => {
                const v = Number(e.target.value);
                if (v !== skill.level) updateSkill(skill.id, { level: v });
              }}
              className="w-16 rounded border border-border bg-background px-2 py-1 text-center font-display text-xs text-foreground outline-none focus:border-primary"
            />
            <button onClick={() => deleteSkill(skill.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="py-8 text-center font-display text-sm text-muted-foreground">No skills yet. Add one above.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSkills;
