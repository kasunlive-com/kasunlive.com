import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Terminal, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Listen for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/admin/login", { replace: true }), 2000);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <Terminal className="mx-auto h-8 w-8 text-primary" />
          <p className="font-display text-sm text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <KeyRound className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Set New Password</h1>
          <p className="mt-1 font-display text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        {success ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="font-display text-sm text-foreground">Password updated! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full rounded-lg border border-border bg-card px-4 py-3 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full rounded-lg border border-border bg-card px-4 py-3 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full gap-2">
              <KeyRound className="h-4 w-4" />
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}

        <p className="text-center">
          <a href="/admin/login" className="font-display text-xs text-muted-foreground hover:text-primary">
            ← Back to login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
