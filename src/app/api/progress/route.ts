import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const mangaId = url.searchParams.get("mangaId");

  if (mangaId) {
    const progress = await prisma.readingProgress.findUnique({
      where: { userId_mangaId: { userId: user.id, mangaId } },
    });
    return Response.json({ progress });
  }

  const allProgress = await prisma.readingProgress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ progress: allProgress });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, lastChapterId, lastChapterNum, lastPage, totalPages } =
    await request.json();
  if (!mangaId || !lastChapterId) {
    return Response.json(
      { error: "mangaId and lastChapterId are required" },
      { status: 400 }
    );
  }

  const progress = await prisma.readingProgress.upsert({
    where: { userId_mangaId: { userId: user.id, mangaId } },
    update: {
      lastChapterId,
      lastChapterNum: lastChapterNum || "",
      lastPage: lastPage ?? 0,
      totalPages: totalPages ?? 0,
    },
    create: {
      userId: user.id,
      mangaId,
      lastChapterId,
      lastChapterNum: lastChapterNum || "",
      lastPage: lastPage ?? 0,
      totalPages: totalPages ?? 0,
    },
  });

  return Response.json({ progress });
}
