"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FormattedManga } from "@/lib/mangadex";

export default function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FormattedManga[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"series" | "users">("series");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  const search = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!q.trim()) {
        setResults([]);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/manga?q=${encodeURIComponent(q)}&limit=8`);
          const data = await res.json();
          setResults(data.data || []);
        } catch {
          setResults([]);
        }
        setLoading(false);
      }, 300);
    },
    []
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  function navigate(id: string) {
    handleClose();
    router.push(`/manga/${id}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  }

  if (!open) return null;

  const typeBadgeColors: Record<string, string> = {
    Manga: "bg-badge-manga",
    Manhwa: "bg-badge-manhwa",
    Manhua: "bg-badge-manhua",
    Other: "bg-gray-500",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-lg mx-4 bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden"
        style={{ animation: "fadeIn 0.15s ease-out" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center border-b border-border px-4">
            <svg className="w-5 h-5 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search manga, manhwa, manhua..."
              className="flex-1 bg-transparent px-3 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-text-muted bg-bg-card px-2 py-1 rounded border border-border hover:text-text-secondary transition-colors"
            >
              ESC
            </button>
          </div>
        </form>

        <div className="flex gap-0 border-b border-border">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "series"
                ? "text-accent border-b-2 border-accent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "text-accent border-b-2 border-accent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Users
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && activeTab === "series" && results.length > 0 && (
            <div className="py-2">
              {results.map((manga) => (
                <button
                  key={manga.id}
                  onClick={() => navigate(manga.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover transition-colors text-left"
                >
                  <div className="w-10 h-14 rounded overflow-hidden bg-bg-card shrink-0">
                    {manga.cover ? (
                      <img src={manga.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-[8px]">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{manga.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded text-white ${typeBadgeColors[manga.type] || typeBadgeColors.Other}`}
                      >
                        {manga.type}
                      </span>
                      <span className="text-xs text-text-muted capitalize">{manga.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && activeTab === "users" && query.trim() && (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              User search coming soon
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              Start typing to search...
            </div>
          )}

          {!loading && query.trim() && activeTab === "series" && results.length === 0 && (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
