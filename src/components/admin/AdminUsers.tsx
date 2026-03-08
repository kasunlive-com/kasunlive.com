import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus, Shield, ShieldOff } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchUsers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "list" },
    });
    if (error) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    } else {
      setUsers(data.users ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    const { error } = await supabase.functions.invoke("manage-users", {
      body: { action: "delete", userId },
    });
    if (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    } else {
      toast({ title: "User deleted" });
      fetchUsers();
    }
  };

  const toggleRole = async (userId: string, currentRoles: string[]) => {
    const isAdmin = currentRoles.includes("admin");
    const newRole = isAdmin ? "user" : "admin";
    const { error } = await supabase.functions.invoke("manage-users", {
      body: { action: "set_role", userId, role: newRole },
    });
    if (error) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    } else {
      toast({ title: `Role updated to ${newRole}` });
      fetchUsers();
    }
  };

  const inviteUser = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    const { error } = await supabase.functions.invoke("manage-users", {
      body: { action: "invite", email: inviteEmail.trim(), redirectUrl: window.location.origin },
    });
    if (error) {
      toast({ title: "Error", description: "Failed to send invite", variant: "destructive" });
    } else {
      toast({ title: "Invite sent" });
      setInviteEmail("");
      fetchUsers();
    }
    setInviting(false);
  };

  if (loading) return <p className="font-display text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Manage Users</h2>

      {/* Invite */}
      <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
        <input
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Email to invite"
          type="email"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-display text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <Button onClick={inviteUser} size="sm" disabled={inviting} className="gap-1">
          <UserPlus className="h-3 w-3" /> {inviting ? "Sending..." : "Invite"}
        </Button>
      </div>

      {/* User list */}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm text-foreground truncate">{user.email}</p>
              <p className="font-display text-xs text-muted-foreground">
                Joined {new Date(user.created_at).toLocaleDateString()}
                {user.last_sign_in_at && ` · Last login ${new Date(user.last_sign_in_at).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {user.roles.includes("admin") ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-display text-xs text-primary">Admin</span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 font-display text-xs text-muted-foreground">User</span>
              )}
            </div>
            <button
              onClick={() => toggleRole(user.id, user.roles)}
              title={user.roles.includes("admin") ? "Remove admin" : "Make admin"}
              className="text-muted-foreground hover:text-primary"
            >
              {user.roles.includes("admin") ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            </button>
            <button
              onClick={() => deleteUser(user.id, user.email ?? "")}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="py-8 text-center font-display text-sm text-muted-foreground">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
