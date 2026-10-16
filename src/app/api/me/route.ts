import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/server/session";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }
}
