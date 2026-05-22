"use client";

import { useState } from "react";
import type { FormattedManga } from "@/lib/mangadex";
import MangaCard from "./MangaCard";
import Link from "next/link";

interface TypeFilterRowProps {
  title: string;
  manga: FormattedManga[];
  seeMoreHref?: string;
}

const typeFilters = ["All", "Manga", "Manhwa", "Manhua"] as const;

export default function TypeFilterRow({ title, manga, seeMoreHref }: TypeFilterRowProps) {
  const [activeType, setActiveType] = useState<string>("All");

  const filtered =
    activeType === "All"
      ? manga
      : manga.filter((m) => m.type === activeType);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <div className="flex gap-1">
            {typeFilters.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeType === type
                    ? "bg-accent text-white"
                    : "bg-bg-card text-text-muted hover:text-text-secondary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {seeMoreHref && (
          <Link
            href={seeMoreHref}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            See more
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <MangaCard key={m.id} id={m.id} title={m.title} cover={m.cover} type={m.type} />
          ))
        ) : (
          <p className="text-text-muted text-sm py-4">No {activeType} titles found</p>
        )}
      </div>
    </section>
  );
}
