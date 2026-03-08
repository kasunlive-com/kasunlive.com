import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface Cert {
  id: string;
  name: string;
  tag: string | null;
  status: string | null;
  sort_order: number;
}

const AdminCertifications = () => {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const fetchCerts = async () => {
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    setCerts((data as Cert[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCerts(); }, []);

  const addCert = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("certifications").insert({
      name: newName.trim(),
      tag: newTag.trim() || null,
      status: newStatus.trim() || null,
      sort_order: certs.length,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewName(""); setNewTag(""); setNewStatus("");
      fetchCerts();
      toast({ title: "Certification added" });
    }
  };

  const updateCert = async (id: string, updates: Partial<Cert>) => {
    const { error } = await supabase.from("certifications").update(updates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchCerts();
  };

  const deleteCert = async (id: string) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { fetchCerts(); toast({ title: "Certification deleted" }); }
  };

  const moveCert = async (index: number, dir: "up" | "down") => {
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= certs.length) return;
    const a = certs[index], b = certs[swap];
    await Promise.all([
      supabase.from("certifications").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("certifications").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchCerts();
  };

  if (loading) return <p className="font-display text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Manage Certifications</h2>

      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Certification name"
          className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Tag (e.g. RHCE)"
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <input
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="Status (optional)"
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <Button onClick={addCert} size="sm" className="gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {certs.map((cert) => (
          <div key={cert.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              defaultValue={cert.name}
              onBlur={(e) => { if (e.target.value !== cert.name) updateCert(cert.id, { name: e.target.value }); }}
              className="flex-1 bg-transparent font-display text-sm text-foreground outline-none"
            />
            <input
              defaultValue={cert.tag ?? ""}
              onBlur={(e) => updateCert(cert.id, { tag: e.target.value || null })}
              placeholder="Tag"
              className="w-24 rounded border border-border bg-background px-2 py-1 font-display text-xs text-foreground outline-none"
            />
            <input
              defaultValue={cert.status ?? ""}
              onBlur={(e) => updateCert(cert.id, { status: e.target.value || null })}
              placeholder="Status"
              className="w-24 rounded border border-border bg-background px-2 py-1 font-display text-xs text-foreground outline-none"
            />
            <button onClick={() => deleteCert(cert.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {certs.length === 0 && (
          <p className="py-8 text-center font-display text-sm text-muted-foreground">No certifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCertifications;
