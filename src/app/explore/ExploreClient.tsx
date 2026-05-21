"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MangaCard from "@/components/MangaCard";
import type { FormattedManga } from "@/lib/mangadex";

interface ExploreClientProps {
  initialResults: FormattedManga[];
  initialTotal: number;
  genres: { id: string; name: string; group: string }[];
  themes: { id: string; name: string; group: string }[];
  initialQuery: string;
  initialSort: string;
}

export default function ExploreClient({
  initialResults,
  initialTotal,
  genres,
  themes,
  initialQuery,
  initialSort,
}: ExploreClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [results, setResults] = useState(initialResults);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("sort", sort);

    try {
      const res = await fetch(`/api/manga?${params.toString()}&limit=30`);
      const data = await res.json();
      setResults(data.data);
      setTotal(data.total);
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  function toggleGenre(genreId: string) {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  }

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "recent", label: "Recently Added" },
    { value: "rating", label: "Top Rated" },
    { value: "updated", label: "Recently Updated" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manga..."
              className="w-full bg-bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setShowGenres(!showGenres)}
            className="bg-bg-secondary border border-border px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Genres
            {selectedGenres.length > 0 && (
              <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                {selectedGenres.length}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setTimeout(() => handleSearch(), 0);
            }}
            className="bg-bg-secondary border border-border px-4 py-2.5 rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      {showGenres && (
        <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedGenres.includes(genre.id)
                    ? "bg-accent text-white"
                    : "bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          {themes.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-text-secondary mt-4 mb-3">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => toggleGenre(theme.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedGenres.includes(theme.id)
                        ? "bg-accent text-white"
                        : "bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-sm text-text-muted mb-4">{total.toLocaleString()} results</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {results.map((manga) => (
          <MangaCard key={manga.id} id={manga.id} title={manga.title} cover={manga.cover} type={manga.type} />
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="text-center py-16 text-text-muted">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
}
