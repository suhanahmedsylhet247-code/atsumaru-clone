"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface ReaderClientProps {
  pages: string[];
  mangaId: string;
  mangaTitle: string;
  chapterNumber: string;
  totalChapters: number;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

export default function ReaderClient({
  pages,
  mangaId,
  mangaTitle,
  chapterNumber,
  totalChapters,
  prevChapterId,
  nextChapterId,
}: ReaderClientProps) {
  const params = useParams();

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
