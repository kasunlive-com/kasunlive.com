import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Terminal, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  if (!loading && isAdmin) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      // Auth state change will trigger redirect
      setTimeout(() => navigate("/admin", { replace: true }), 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Terminal className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-1 font-display text-sm text-muted-foreground">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-3 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-3 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full gap-2">
            <LogIn className="h-4 w-4" />
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center">
          <a href="/" className="font-display text-xs text-muted-foreground hover:text-primary">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
