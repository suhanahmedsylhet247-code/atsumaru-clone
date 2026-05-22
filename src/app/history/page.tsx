"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  mangaType: string;
  chapterId: string;
  chapterNum: string;
  readAt: string;
}

const typeBadgeColors: Record<string, string> = {
  Manga: "bg-badge-manga",
  Manhwa: "bg-badge-manhwa",
  Manhua: "bg-badge-manhua",
};

function formatTimeAgo(dateStr: string, now: number) {
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    fetch("/api/history")
      .then((r) => (r.ok ? r.json() : { history: [] }))
      .then((data) => {
        setHistory(data.history || []);
        setNow(Date.now());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function clearHistory() {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
  }

  async function removeEntry(mangaId: string) {
    await fetch(`/api/history?mangaId=${mangaId}`, { method: "DELETE" });
    setHistory((prev) => prev.filter((h) => h.mangaId !== mangaId));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reading History</h1>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-text-muted hover:text-red-400 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-text-muted">You haven&apos;t read anything yet!</p>
          <Link href="/explore" className="text-accent hover:text-accent-hover text-sm mt-2 inline-block">
            Start reading
          </Link>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="grid gap-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 bg-bg-secondary border border-border rounded-lg p-3 hover:bg-bg-hover transition-colors"
            >
              <Link href={`/manga/${entry.mangaId}`} className="shrink-0">
                <div className="w-14 h-20 rounded overflow-hidden bg-bg-card">
                  {entry.mangaCover ? (
                    <img src={entry.mangaCover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-[8px]">
                      N/A
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/manga/${entry.mangaId}`}>
                  <p className="text-sm font-medium text-text-primary truncate hover:text-accent transition-colors">
                    {entry.mangaTitle}
                  </p>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {entry.mangaType && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded text-white ${typeBadgeColors[entry.mangaType] || "bg-gray-500"}`}
                    >
                      {entry.mangaType}
                    </span>
                  )}
                  <Link
                    href={`/read/${entry.mangaId}/${entry.chapterId}`}
                    className="text-xs text-accent hover:text-accent-hover"
                  >
                    Chapter {entry.chapterNum}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-text-muted">{formatTimeAgo(entry.readAt, now)}</span>
                <Link
                  href={`/read/${entry.mangaId}/${entry.chapterId}`}
                  className="bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Continue
                </Link>
                <button
                  onClick={() => removeEntry(entry.mangaId)}
                  className="text-text-muted hover:text-red-400 transition-colors p-1"
                  title="Remove from history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
