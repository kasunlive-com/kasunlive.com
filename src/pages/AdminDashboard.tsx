import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Terminal, Image, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminCertifications from "@/components/admin/AdminCertifications";

type Tab = "gallery" | "skills" | "certifications";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "skills", label: "Skills", icon: BookOpen },
  { id: "certifications", label: "Certifications", icon: Award },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("gallery");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/admin/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-xs text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-1">
              <LogOut className="h-3 w-3" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex gap-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-display text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "gallery" && <AdminGallery />}
        {activeTab === "skills" && <AdminSkills />}
        {activeTab === "certifications" && <AdminCertifications />}
      </div>
    </div>
  );
};

export default AdminDashboard;
