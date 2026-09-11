"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-md">
      <h2 className="font-display text-headline-sm text-on-surface">Sign in</h2>
      <Input
        label="Username"
        name="username"
        required
        autoComplete="username"
        placeholder="Your admin username"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Your password"
      />
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-on-surface-variant">
          No admin account yet?
        </span>
        <Link href="/setup" className="text-primary underline underline-offset-2">
          Create one
        </Link>
      </div>
    </form>
  );
}