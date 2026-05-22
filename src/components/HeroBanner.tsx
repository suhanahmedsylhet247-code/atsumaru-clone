"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { FormattedManga } from "@/lib/mangadex";

interface HeroBannerProps {
  manga: FormattedManga[];
}

export default function HeroBanner({ manga }: HeroBannerProps) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % manga.length);
  }, [manga.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  if (!manga.length) return null;

  const current = manga[active];

  return (
    <section className="relative mb-10 rounded-xl overflow-hidden h-[280px] md:h-[340px]">
      {manga.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {m.cover && (
            <img
              src={m.cover.replace(".256.jpg", ".512.jpg")}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative h-full flex items-end pb-8 px-6 md:px-10">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Featured
            </span>
            <span className="text-xs text-text-muted capitalize">
              {current.type} &middot; {current.status}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 line-clamp-2">
            {current.title}
          </h2>
          {current.description && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 max-w-md">
              {current.description}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Link
              href={`/manga/${current.id}`}
              className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Read Now
            </Link>
            <Link
              href={`/manga/${current.id}`}
              className="bg-bg-card/80 hover:bg-bg-hover border border-border text-text-secondary hover:text-text-primary px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-6 flex gap-1.5">
        {manga.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-accent" : "w-1.5 bg-text-muted/40 hover:bg-text-muted/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
