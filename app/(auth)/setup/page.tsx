"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SetupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pw = form.get("password") as string;
    const pw2 = form.get("password2") as string;
    if (pw !== pw2) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: pw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create admin account");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create admin account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-md">
      <div>
        <h2 className="font-display text-headline-sm text-on-surface">
          Create admin account
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Pick a username and password. Your password is hashed with scrypt
          (salt:hash format) before being stored in Turso.
        </p>
      </div>
      <Input
        label="Username"
        name="username"
        required
        autoComplete="username"
        placeholder="Choose an admin username"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        placeholder="Choose a strong password"
        minLength={6}
      />
      <Input
        label="Confirm password"
        name="password2"
        type="password"
        required
        autoComplete="new-password"
        placeholder="Type it again"
        minLength={6}
      />
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating…" : "Create admin account"}
      </Button>
    </form>
  );
}