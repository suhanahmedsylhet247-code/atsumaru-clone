"use client";

import { useState, useEffect, useRef } from "react";

interface BookmarkButtonProps {
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  mangaType: string;
}

const statusOptions = [
  { value: "reading", label: "Reading" },
  { value: "plan_to_read", label: "Plan to Read" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "dropped", label: "Dropped" },
];

export default function BookmarkButton({
  mangaId,
  mangaTitle,
  mangaCover,
  mangaType,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [status, setStatus] = useState("reading");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => (r.ok ? r.json() : { bookmarks: [] }))
      .then((data) => {
        const existing = data.bookmarks?.find(
          (b: { mangaId: string }) => b.mangaId === mangaId
        );
        if (existing) {
          setBookmarked(true);
          setStatus(existing.status);
        }
      })
      .catch(() => {});
  }, [mangaId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function addBookmark(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId,
          status: newStatus,
          mangaTitle,
          mangaCover,
          mangaType,
        }),
      });
      if (res.ok) {
        setBookmarked(true);
        setStatus(newStatus);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
    setDropdownOpen(false);
  }

  async function removeBookmark() {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId }),
      });
      if (res.ok) {
        setBookmarked(false);
        setStatus("reading");
      }
    } catch {
      // silently fail
    }
    setLoading(false);
    setDropdownOpen(false);
  }

  const currentLabel = statusOptions.find((o) => o.value === status)?.label || "Bookmark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          bookmarked
            ? "bg-accent/20 border-accent text-accent"
            : "bg-bg-card border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarked ? currentLabel : "Bookmark"}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-xl py-1 z-50">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => addBookmark(opt.value)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                bookmarked && status === opt.value
                  ? "text-accent bg-accent/10"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {bookmarked && (
            <>
              <div className="border-t border-border my-1" />
              <button
                onClick={removeBookmark}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-bg-hover"
              >
                Remove Bookmark
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
