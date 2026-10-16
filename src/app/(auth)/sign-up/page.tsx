"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setPending(false);

    if (error) {
      setError(error.message ?? "Could not create the account");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>

        <input
          name="name"
          type="text"
          required
          placeholder="Name"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:border-neutral-600"
        />
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
          minLength={8}
          placeholder="Password (8+ characters)"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:border-neutral-600"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 font-medium text-neutral-950 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-neutral-100 underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
