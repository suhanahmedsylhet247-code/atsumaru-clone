import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId, value } = await request.json();
  if (!commentId || (value !== 1 && value !== -1)) {
    return Response.json(
      { error: "commentId and value (1 or -1) are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.vote.findUnique({
    where: { userId_commentId: { userId: user.id, commentId } },
  });

  if (existing && existing.value === value) {
    await prisma.$transaction([
      prisma.vote.delete({ where: { id: existing.id } }),
      prisma.comment.update({
        where: { id: commentId },
        data: value === 1 ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } },
      }),
    ]);
    return Response.json({ vote: null });
  }

  if (existing) {
    await prisma.$transaction([
      prisma.vote.update({ where: { id: existing.id }, data: { value } }),
      prisma.comment.update({
        where: { id: commentId },
        data:
          value === 1
            ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
            : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.vote.create({ data: { userId: user.id, commentId, value } }),
      prisma.comment.update({
        where: { id: commentId },
        data: value === 1 ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
      }),
    ]);
  }

  const vote = await prisma.vote.findUnique({
    where: { userId_commentId: { userId: user.id, commentId } },
  });

  return Response.json({ vote });
}
