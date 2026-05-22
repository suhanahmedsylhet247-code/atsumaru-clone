import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.readingHistory.findMany({
    where: { userId: user.id },
    orderBy: { readAt: "desc" },
    take: 50,
  });

  return Response.json({ history });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, mangaTitle, mangaCover, mangaType, chapterId, chapterNum } =
    await request.json();
  if (!mangaId || !chapterId) {
    return Response.json(
      { error: "mangaId and chapterId are required" },
      { status: 400 }
    );
  }

  const entry = await prisma.readingHistory.upsert({
    where: { userId_mangaId: { userId: user.id, mangaId } },
    update: {
      chapterId,
      chapterNum: chapterNum || "",
      mangaTitle: mangaTitle || "",
      mangaCover: mangaCover || null,
      mangaType: mangaType || "",
      readAt: new Date(),
    },
    create: {
      userId: user.id,
      mangaId,
      mangaTitle: mangaTitle || "",
      mangaCover: mangaCover || null,
      mangaType: mangaType || "",
      chapterId,
      chapterNum: chapterNum || "",
    },
  });

  return Response.json({ entry });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const mangaId = url.searchParams.get("mangaId");

  if (mangaId) {
    await prisma.readingHistory.deleteMany({
      where: { userId: user.id, mangaId },
    });
  } else {
    await prisma.readingHistory.deleteMany({
      where: { userId: user.id },
    });
  }

  return Response.json({ ok: true });
}
