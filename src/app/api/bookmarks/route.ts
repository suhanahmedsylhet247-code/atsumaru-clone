import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ bookmarks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, status } = await request.json();
  if (!mangaId) {
    return Response.json({ error: "mangaId is required" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_mangaId: { userId: user.id, mangaId } },
    update: { status: status || "reading" },
    create: { userId: user.id, mangaId, status: status || "reading" },
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
