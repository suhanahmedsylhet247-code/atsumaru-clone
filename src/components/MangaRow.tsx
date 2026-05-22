"use client";

import { useRef } from "react";
import Link from "next/link";
import MangaCard from "./MangaCard";
import type { FormattedManga } from "@/lib/mangadex";

interface MangaRowProps {
  title: string;
  manga: FormattedManga[];
  seeMoreHref?: string;
}

export default function MangaRow({ title, manga, seeMoreHref }: MangaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 600;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!manga.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <div className="flex items-center gap-3">
          {seeMoreHref && (
            <Link
              href={seeMoreHref}
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              See more
            </Link>
          )}
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {manga.map((m) => (
          <MangaCard key={m.id} id={m.id} title={m.title} cover={m.cover} type={m.type} />
        ))}
      </div>
    </section>
  );
}
