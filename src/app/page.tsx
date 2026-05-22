import { searchManga } from "@/lib/mangadex";
import MangaRow from "@/components/MangaRow";
import CTASection from "@/components/CTASection";
import HeroBanner from "@/components/HeroBanner";
import TypeFilterRow from "@/components/TypeFilterRow";
import HotSeriesSection from "@/components/HotSeriesSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trending, popular, topRated, recentlyAdded, hotUpdates, recentlyUpdated] = await Promise.all([
    searchManga({ limit: 20, order: { followedCount: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { relevance: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { rating: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { createdAt: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { updatedAt: "desc" }, contentRating: ["safe", "suggestive"] }),
    searchManga({ limit: 20, order: { latestUploadedChapter: "desc" }, contentRating: ["safe", "suggestive"] }),
  ]);

  const heroManga = trending.data.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <HeroBanner manga={heroManga} />

      <MangaRow
        title="Trending"
        manga={trending.data}
        seeMoreHref="/explore?sort=popular"
      />

      <TypeFilterRow
        title="Recently Updated"
        manga={recentlyUpdated.data}
        seeMoreHref="/explore?sort=updated"
      />

      <CTASection />

      <HotSeriesSection />

      <MangaRow
        title="Hot Updates"
        manga={hotUpdates.data}
        seeMoreHref="/explore?sort=updated"
      />

      <TypeFilterRow
        title="Recently Added"
        manga={recentlyAdded.data}
        seeMoreHref="/explore?sort=recent"
      />

      <MangaRow
        title="Top Rated"
        manga={topRated.data}
        seeMoreHref="/explore?sort=rating"
      />

      <MangaRow
        title="Popular"
        manga={popular.data}
        seeMoreHref="/explore?sort=popular"
      />
    </div>
  );
}
