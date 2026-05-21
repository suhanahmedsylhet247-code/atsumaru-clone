import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mangaId = url.searchParams.get("mangaId");
  const chapterId = url.searchParams.get("chapterId");

  if (!mangaId) {
    return Response.json({ error: "mangaId is required" }, { status: 400 });
  }

  const where: Record<string, unknown> = { mangaId, parentId: null };
  if (chapterId) where.chapterId = chapterId;

  const comments = await prisma.comment.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      replies: {
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json({ comments });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mangaId, chapterId, content, parentId } = await request.json();
  if (!mangaId || !content) {
    return Response.json({ error: "mangaId and content are required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      mangaId,
      chapterId: chapterId || null,
      content,
      parentId: parentId || null,
    },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
    },
  });

  return Response.json({ comment });
}
