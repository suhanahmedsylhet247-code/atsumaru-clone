"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface ReaderClientProps {
  pages: string[];
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  mangaType: string;
  chapterNumber: string;
  chapterId: string;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

type ReaderMode = "vertical" | "single";

export default function ReaderClient({
  pages,
  mangaId,
  mangaTitle,
  mangaCover,
  mangaType,
  chapterNumber,
  chapterId,
  prevChapterId,
  nextChapterId,
}: ReaderClientProps) {
  const [mode, setMode] = useState<ReaderMode>("vertical");
  const [currentPage, setCurrentPage] = useState(0);

  const saveProgress = useCallback(
    (page: number) => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId,
          lastChapterId: chapterId,
          lastChapterNum: chapterNumber,
          lastPage: page,
          totalPages: pages.length,
        }),
      }).catch(() => {});
    },
    [mangaId, chapterId, chapterNumber, pages.length]
  );

  useEffect(() => {
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mangaId,
        mangaTitle,
        mangaCover,
        mangaType,
        chapterId,
        chapterNum: chapterNumber,
      }),
    }).catch(() => {});

    saveProgress(0);
  }, [mangaId, mangaTitle, mangaCover, mangaType, chapterId, chapterNumber, saveProgress]);

  useEffect(() => {
    if (mode !== "vertical") return;

    function handleScroll() {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const estimatedPage = Math.floor(scrollPercent * pages.length);
      setCurrentPage(Math.min(estimatedPage, pages.length - 1));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode, pages.length]);

  useEffect(() => {
    if (currentPage > 0 && currentPage % 5 === 0) {
      saveProgress(currentPage);
    }
  }, [currentPage, saveProgress]);

  function handlePageNav(direction: "prev" | "next") {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
    saveProgress(direction === "prev" ? currentPage - 1 : currentPage + 1);
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/manga/${mangaId}`}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link
              href={`/manga/${mangaId}`}
              className="text-sm font-medium text-text-primary hover:text-accent transition-colors truncate max-w-[200px]"
            >
              {mangaTitle}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-bg-card rounded-lg border border-border p-0.5">
              <button
                onClick={() => setMode("vertical")}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  mode === "vertical" ? "bg-accent text-white" : "text-text-muted hover:text-text-secondary"
                }`}
                title="Vertical scroll"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setMode("single")}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  mode === "single" ? "bg-accent text-white" : "text-text-muted hover:text-text-secondary"
                }`}
                title="Single page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {prevChapterId ? (
                <Link
                  href={`/read/${mangaId}/${prevChapterId}`}
                  className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ) : (
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              )}

              <span className="text-sm text-text-secondary px-2">
                Ch. {chapterNumber}
                {mode === "single" && ` (${currentPage + 1}/${pages.length})`}
              </span>

              {nextChapterId ? (
                <Link
                  href={`/read/${mangaId}/${nextChapterId}`}
                  className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mode === "vertical" ? (
        <div className="max-w-3xl mx-auto">
          {pages.map((pageUrl, index) => (
            <img
              key={index}
              src={pageUrl}
              alt={`Page ${index + 1}`}
              className="w-full"
              loading={index < 3 ? "eager" : "lazy"}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[calc(100vh-48px)] relative">
          <button
            onClick={() => handlePageNav("prev")}
            disabled={currentPage === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bg-card/80 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="max-h-[calc(100vh-48px)] max-w-full object-contain"
          />

          <button
            onClick={() => handlePageNav("next")}
            disabled={currentPage === pages.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bg-card/80 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-bg-secondary border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          {prevChapterId ? (
            <Link
              href={`/read/${mangaId}/${prevChapterId}`}
              className="bg-bg-card hover:bg-bg-hover border border-border px-6 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Previous Chapter
            </Link>
          ) : (
            <div />
          )}
          <Link
            href={`/manga/${mangaId}`}
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Back to manga
          </Link>
          {nextChapterId ? (
            <Link
              href={`/read/${mangaId}/${nextChapterId}`}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Next Chapter
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
