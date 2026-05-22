"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import type { FormattedManga } from "@/lib/mangadex";
import MangaCard from "./MangaCard";
import Link from "next/link";

const periods = [
  { value: "7", label: "Weekly" },
  { value: "30", label: "Monthly" },
  { value: "all", label: "All-time" },
] as const;

export default function HotSeriesSection() {
  const [activePeriod, setActivePeriod] = useState("7");
  const [manga, setManga] = useState<FormattedManga[]>([]);
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchData = useCallback((_period: string) => {
    fetch(`/api/manga?limit=20&sort=popular`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((data) => {
        startTransition(() => {
          setManga(data.data || []);
          setInitialLoad(false);
        });
      })
      .catch(() => {
        startTransition(() => {
          setManga([]);
          setInitialLoad(false);
        });
      });
  }, []);

  useEffect(() => {
    fetchData(activePeriod);
  }, [activePeriod, fetchData]);

  const loading = isPending || initialLoad;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-text-primary">Hot Series</h2>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setActivePeriod(p.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activePeriod === p.value
                    ? "bg-accent text-white"
                    : "bg-bg-card text-text-muted hover:text-text-secondary"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <Link
          href="/explore?sort=popular"
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          See more
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {manga.map((m) => (
            <MangaCard key={m.id} id={m.id} title={m.title} cover={m.cover} type={m.type} />
          ))}
        </div>
      )}
    </section>
  );
}
