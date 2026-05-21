import { searchManga } from "@/lib/mangadex";
import MangaRow from "@/components/MangaRow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trending, popular, topRated, recentlyAdded] = await Promise.all([
    searchManga({ limit: 20, order: { followedCount: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { relevance: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { rating: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { createdAt: "desc" }, contentRating: ["safe", "suggestive"] }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <MangaRow title="Trending" manga={trending.data} />
      <MangaRow title="Popular" manga={popular.data} />
      <MangaRow title="Top Rated" manga={topRated.data} />
      <MangaRow title="Recently Added" manga={recentlyAdded.data} />
    </div>
  );
}
