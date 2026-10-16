"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setPending(false);

    if (error) {
      setError(error.message ?? "Could not sign in");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:border-neutral-600"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:border-neutral-600"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 font-medium text-neutral-950 disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-neutral-400">
          No account yet?{" "}
          <Link href="/sign-up" className="text-neutral-100 underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
