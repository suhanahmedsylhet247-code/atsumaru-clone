import { getMangaById, getMangaChapters, searchManga } from "@/lib/mangadex";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";
import CommentSection from "@/components/CommentSection";
import MangaCard from "@/components/MangaCard";

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [manga, chaptersResult] = await Promise.all([
    getMangaById(id),
    getMangaChapters(id, { limit: 100 }),
  ]);

  const chapters = chaptersResult.data
    .filter((ch) => ch.chapter !== null)
    .sort((a, b) => parseFloat(b.chapter!) - parseFloat(a.chapter!));

  const uniqueChapters = chapters.reduce(
    (acc, ch) => {
      if (!acc.seen.has(ch.chapter!)) {
        acc.seen.add(ch.chapter!);
        acc.result.push(ch);
      }
      return acc;
    },
    { seen: new Set<string>(), result: [] as typeof chapters }
  ).result;

  let relatedManga: Awaited<ReturnType<typeof searchManga>>["data"] = [];
  if (manga.genres.length > 0) {
    try {
      const related = await searchManga({
        limit: 10,
        order: { relevance: "desc" },
        contentRating: ["safe", "suggestive"],
      });
      relatedManga = related.data.filter((m) => m.id !== id).slice(0, 8);
    } catch {
      // silently fail
    }
  }

  const statusColors: Record<string, string> = {
    ongoing: "text-green-400",
    completed: "text-blue-400",
    hiatus: "text-yellow-400",
    cancelled: "text-red-400",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="shrink-0 w-[200px] mx-auto md:mx-0">
          {manga.cover ? (
            <img
              src={manga.cover.replace(".256.jpg", ".512.jpg")}
              alt={manga.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-bg-card rounded-lg flex items-center justify-center text-text-muted">
              No Cover
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{manga.title}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className={`font-medium capitalize ${statusColors[manga.status] || "text-text-secondary"}`}>
              {manga.status}
            </span>
            {manga.type && (
              <span className="bg-bg-card px-2 py-0.5 rounded text-text-secondary">
                {manga.type}
              </span>
            )}
            {manga.year && (
              <span className="text-text-muted">{manga.year}</span>
            )}
            {manga.author && (
              <span className="text-text-secondary">by {manga.author}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {manga.genres.map((genre) => (
              <Link
                key={genre}
                href={`/explore?genre=${encodeURIComponent(genre)}`}
                className="bg-bg-card hover:bg-bg-hover border border-border px-2.5 py-1 rounded-full text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>

          {manga.description && (
            <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-4">
              {manga.description}
            </p>
          )}

          <div className="flex gap-3">
            {uniqueChapters.length > 0 && (
              <Link
                href={`/read/${id}/${uniqueChapters[uniqueChapters.length - 1].id}`}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Reading
              </Link>
            )}
            <BookmarkButton
              mangaId={id}
              mangaTitle={manga.title}
              mangaCover={manga.cover}
              mangaType={manga.type}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Chapters ({uniqueChapters.length})
        </h2>
        <div className="bg-bg-secondary rounded-lg border border-border divide-y divide-border">
          {uniqueChapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/read/${id}/${ch.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-bg-hover transition-colors"
            >
              <div>
                <span className="text-sm font-medium">
                  Chapter {ch.chapter}
                </span>
                {ch.title && (
                  <span className="text-sm text-text-muted ml-2">- {ch.title}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                {ch.scanlationGroup && <span>{ch.scanlationGroup}</span>}
                <span>{new Date(ch.publishAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {uniqueChapters.length === 0 && (
            <div className="px-4 py-8 text-center text-text-muted">
              No chapters available in English
            </div>
          )}
        </div>
      </div>

      <CommentSection mangaId={id} />

      {relatedManga.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">You Might Also Like</h2>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {relatedManga.map((m) => (
              <MangaCard key={m.id} id={m.id} title={m.title} cover={m.cover} type={m.type} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
