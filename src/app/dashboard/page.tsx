import { redirect } from "next/navigation";
import { getSession } from "@/server/session";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <SignOutButton />
        </div>
        <p className="mt-4 text-neutral-400">
          Signed in as {session.user.name} ({session.user.email}). Workspaces arrive in Step 4.
        </p>
      </div>
    </main>
  );
}
