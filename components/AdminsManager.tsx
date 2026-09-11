"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AdminUser } from "@/lib/schema";

export function AdminsManager({
  admins,
  currentUserId,
}: {
  admins: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create admin.");
      setSuccess(`Admin "${data.username}" created.`);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create admin.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(admin: AdminUser) {
    if (!confirm(`Remove admin "${admin.username}"?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not remove admin.");
      setSuccess(`Admin "${admin.username}" removed.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove admin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-lg lg:grid-cols-2">
      <Card className="space-y-md h-fit">
        <h2 className="font-display text-headline-sm text-on-surface">
          New admin account
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Type a username and a password. Passwords are hashed with scrypt
          (salt:hash, matching pass-hash.vercel.app) before being stored —
          you never enter a plaintext password into the database table.
        </p>
        <form onSubmit={create} className="space-y-md">
          <Input
            label="Username"
            name="username"
            required
            autoComplete="off"
            placeholder="Admin username"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
          />
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Type it again"
          />
          {error && <p className="text-body-sm text-error">{error}</p>}
          {success && <p className="text-body-sm text-secondary">{success}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Creating…" : "Create admin"}
          </Button>
        </form>
      </Card>

      <Card className="space-y-sm h-fit">
        <h2 className="font-display text-headline-sm text-on-surface">
          Admins ({admins.length})
        </h2>
        <ul className="divide-y divide-outline-variant">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="flex items-center justify-between gap-sm py-sm"
            >
              <div>
                <p className="text-title-md text-on-surface">
                  {admin.username}
                  {admin.id === currentUserId && (
                    <span className="ml-xs text-label-md text-secondary">(you)</span>
                  )}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Created {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>
              {admin.id !== currentUserId && (
                <Button size="sm" variant="danger" onClick={() => remove(admin)}>
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}