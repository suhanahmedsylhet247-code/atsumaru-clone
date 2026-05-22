"use client";

import { useState, useEffect } from "react";

interface CommentUser {
  id: string;
  username: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  user: CommentUser;
  replies: Comment[];
}

interface CommentSectionProps {
  mangaId: string;
}

export default function CommentSection({ mangaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?mangaId=${mangaId}`)
      .then((r) => (r.ok ? r.json() : { comments: [] }))
      .then((data) => setComments(data.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mangaId]);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId, content: newComment.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [{ ...data.comment, replies: [] }, ...prev]);
        setNewComment("");
      }
    } catch {
      // silently fail
    }
    setPosting(false);
  }

  async function postReply(parentId: string) {
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId, content: replyText.trim(), parentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, data.comment] }
              : c
          )
        );
        setReplyTo(null);
        setReplyText("");
      }
    } catch {
      // silently fail
    }
    setPosting(false);
  }

  async function vote(commentId: string, value: number) {
    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, value }),
      });
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              upvotes: c.upvotes + (value === 1 ? 1 : 0),
              downvotes: c.downvotes + (value === -1 ? 1 : 0),
            };
          }
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? {
                    ...r,
                    upvotes: r.upvotes + (value === 1 ? 1 : 0),
                    downvotes: r.downvotes + (value === -1 ? 1 : 0),
                  }
                : r
            ),
          };
        })
      );
    } catch {
      // silently fail
    }
  }

  function formatTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    return (
      <div className={`${isReply ? "ml-10 mt-3" : ""}`}>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center text-xs font-medium shrink-0">
            {comment.user.avatar ? (
              <img src={comment.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              comment.user.username[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{comment.user.username}</span>
              <span className="text-xs text-text-muted">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => vote(comment.id, 1)}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {comment.upvotes > 0 && comment.upvotes}
              </button>
              <button
                onClick={() => vote(comment.id, -1)}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {comment.downvotes > 0 && comment.downvotes}
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Reply
                </button>
              )}
            </div>

            {replyTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") postReply(comment.id);
                  }}
                />
                <button
                  onClick={() => postReply(comment.id)}
                  disabled={posting}
                  className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>
        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Comments ({comments.length})</h2>

      <form onSubmit={postComment} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-text-muted text-sm">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}

      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}
