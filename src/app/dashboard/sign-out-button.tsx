"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function onClick() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
    >
      Sign out
    </button>
  );
}
