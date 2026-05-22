"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  mangaType: string;
  status: string;
  updatedAt: string;
}

const statusTabs = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "plan_to_read", label: "Plan to Read" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "dropped", label: "Dropped" },
];

const typeBadgeColors: Record<string, string> = {
  Manga: "bg-badge-manga",
  Manhwa: "bg-badge-manhwa",
  Manhua: "bg-badge-manhua",
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    fetch(`/api/bookmarks${params}`)
      .then((r) => (r.ok ? r.json() : { bookmarks: [] }))
      .then((data) => {
        startTransition(() => {
          setBookmarks(data.bookmarks || []);
          setInitialLoad(false);
        });
      })
      .catch(() => {
        startTransition(() => {
          setBookmarks([]);
          setInitialLoad(false);
        });
      });
  }, [activeTab]);

  const loading = isPending || initialLoad;

  async function removeBookmark(mangaId: string) {
    await fetch("/api/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangaId }),
    });
    setBookmarks((prev) => prev.filter((b) => b.mangaId !== mangaId));
  }

  async function updateStatus(mangaId: string, newStatus: string) {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangaId, status: newStatus }),
    });
    if (activeTab !== "all" && activeTab !== newStatus) {
      setBookmarks((prev) => prev.filter((b) => b.mangaId !== mangaId));
    } else {
      setBookmarks((prev) =>
        prev.map((b) => (b.mangaId === mangaId ? { ...b, status: newStatus } : b))
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-text-muted">No bookmarks yet</p>
          <Link href="/explore" className="text-accent hover:text-accent-hover text-sm mt-2 inline-block">
            Browse manga
          </Link>
        </div>
      )}

      {!loading && bookmarks.length > 0 && (
        <div className="grid gap-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center gap-4 bg-bg-secondary border border-border rounded-lg p-3 hover:bg-bg-hover transition-colors"
            >
              <Link href={`/manga/${bookmark.mangaId}`} className="shrink-0">
                <div className="w-14 h-20 rounded overflow-hidden bg-bg-card">
                  {bookmark.mangaCover ? (
                    <img
                      src={bookmark.mangaCover}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-[8px]">
                      N/A
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/manga/${bookmark.mangaId}`} className="block">
                  <p className="text-sm font-medium text-text-primary truncate hover:text-accent transition-colors">
                    {bookmark.mangaTitle || "Unknown Title"}
                  </p>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {bookmark.mangaType && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded text-white ${typeBadgeColors[bookmark.mangaType] || "bg-gray-500"}`}
                    >
                      {bookmark.mangaType}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">
                    Updated {new Date(bookmark.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <select
                value={bookmark.status}
                onChange={(e) => updateStatus(bookmark.mangaId, e.target.value)}
                className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-accent"
              >
                <option value="reading">Reading</option>
                <option value="plan_to_read">Plan to Read</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>

              <button
                onClick={() => removeBookmark(bookmark.mangaId)}
                className="text-text-muted hover:text-red-400 transition-colors p-1"
                title="Remove bookmark"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
