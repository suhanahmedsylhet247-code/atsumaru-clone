import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: { reputation: "desc" },
    take: 50,
    select: { id: true, username: true, avatar: true, reputation: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-text-muted text-sm mb-6">
        Reputation is calculated based on upvotes and downvotes.
      </p>

      <div className="bg-bg-secondary rounded-lg border border-border divide-y divide-border">
        {users.length === 0 && (
          <div className="px-4 py-8 text-center text-text-muted">
            No users yet. Be the first to sign up!
          </div>
        )}
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover transition-colors"
          >
            <span className="w-8 text-center text-sm font-bold text-text-muted">
              {index + 1}
            </span>
            <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-sm font-medium shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.username[0].toUpperCase()
              )}
            </div>
            <span className="text-sm font-medium flex-1">{user.username}</span>
            <span className="text-sm text-text-secondary font-mono">
              {user.reputation.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
