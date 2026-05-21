"use client";

import { useState } from "react";

export default function BookmarkButton({ mangaId }: { mangaId: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleBookmark() {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId }),
      });
      if (res.ok) setBookmarked(!bookmarked);
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
        bookmarked
          ? "bg-accent/20 border-accent text-accent"
          : "bg-bg-card border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
      }`}
    >
      <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
