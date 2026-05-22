import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const where: Record<string, unknown> = { userId: user.id };
  if (status && status !== "all") {
    where.status = status;
  }

  const bookmarks = await prisma.bookmark.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ bookmarks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, status, mangaTitle, mangaCover, mangaType } = await request.json();
  if (!mangaId) {
    return Response.json({ error: "mangaId is required" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_mangaId: { userId: user.id, mangaId } },
    update: {
      status: status || "reading",
      mangaTitle: mangaTitle || undefined,
      mangaCover: mangaCover || undefined,
      mangaType: mangaType || undefined,
    },
    create: {
      userId: user.id,
      mangaId,
      status: status || "reading",
      mangaTitle: mangaTitle || "",
      mangaCover: mangaCover || null,
      mangaType: mangaType || "",
    },
  });

  return Response.json({ bookmark });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId } = await request.json();
  if (!mangaId) {
    return Response.json({ error: "mangaId is required" }, { status: 400 });
  }

  await prisma.bookmark.deleteMany({
    where: { userId: user.id, mangaId },
  });

  return Response.json({ ok: true });
}
