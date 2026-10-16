import { count, eq } from "drizzle-orm";
import { db } from "./index";
import { boards, itemDerived, items, user, workspaces } from "./schema";

const SEED_USER_ID = "seed-user-1";
const CASCADE_USER_ID = "cascade-test-user";

async function seed() {
  await db.delete(user).where(eq(user.id, SEED_USER_ID));

  await db.insert(user).values({
    id: SEED_USER_ID,
    name: "Seed User",
    email: "seed@example.com",
  });

  const [workspace] = await db
    .insert(workspaces)
    .values({ userId: SEED_USER_ID, name: "Fintech App: Visual Research" })
    .returning();

  const [board] = await db
    .insert(boards)
    .values({ workspaceId: workspace.id, name: "Main board" })
    .returning();

  const inserted = await db
    .insert(items)
    .values([
      {
        boardId: board.id,
        type: "note",
        x: 80,
        y: 80,
        w: 240,
        h: 120,
        z: 1,
        payload: { text: "I like the navigation from this one" },
      },
      {
        boardId: board.id,
        type: "image",
        x: 360,
        y: 80,
        w: 320,
        h: 200,
        z: 2,
        payload: { url: "https://example.com/dashboard.png", width: 1280, height: 800 },
      },
    ])
    .returning();

  const image = inserted.find((item) => item.type === "image");
  if (!image) throw new Error("Seed image item was not inserted");

  await db.insert(itemDerived).values({
    itemId: image.id,
    palette: ["#0F172A", "#334155", "#64748B", "#E2E8F0"],
    tags: ["dashboard ui", "dark theme"],
    summary: "Dark fintech dashboard",
  });

  const rows = await db
    .select({
      workspace: workspaces.name,
      board: boards.name,
      type: items.type,
      status: items.status,
      x: items.x,
      y: items.y,
      tags: itemDerived.tags,
    })
    .from(items)
    .innerJoin(boards, eq(items.boardId, boards.id))
    .innerJoin(workspaces, eq(boards.workspaceId, workspaces.id))
    .leftJoin(itemDerived, eq(itemDerived.itemId, items.id))
    .where(eq(workspaces.userId, SEED_USER_ID));

  console.table(rows);
}

async function checkCascade() {
  await db.delete(user).where(eq(user.id, CASCADE_USER_ID));

  await db.insert(user).values({
    id: CASCADE_USER_ID,
    name: "Cascade Test",
    email: "cascade@example.com",
  });

  const [workspace] = await db
    .insert(workspaces)
    .values({ userId: CASCADE_USER_ID, name: "tmp" })
    .returning();
  const [board] = await db
    .insert(boards)
    .values({ workspaceId: workspace.id, name: "tmp" })
    .returning();
  await db.insert(items).values({
    boardId: board.id,
    type: "note",
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    payload: { text: "tmp" },
  });

  await db.delete(user).where(eq(user.id, CASCADE_USER_ID));

  const [remaining] = await db
    .select({ n: count() })
    .from(items)
    .where(eq(items.boardId, board.id));

  if (remaining.n === 0) {
    console.log("cascade OK: deleting the user removed workspace, board, and items");
  } else {
    console.error(`cascade FAILED: ${remaining.n} items left behind`);
    process.exitCode = 1;
  }
}

async function main() {
  await seed();
  await checkCascade();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
