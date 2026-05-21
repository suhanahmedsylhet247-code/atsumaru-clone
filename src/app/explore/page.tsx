import { searchManga, getTags } from "@/lib/mangadex";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "popular";

  const orderMap: Record<string, Record<string, string>> = {
    popular: { followedCount: "desc" },
    recent: { createdAt: "desc" },
    rating: { rating: "desc" },
    updated: { updatedAt: "desc" },
    relevance: { relevance: "desc" },
  };

  const [results, tags] = await Promise.all([
    searchManga({
      title: query || undefined,
      limit: 30,
      order: orderMap[sort] || orderMap.popular,
      contentRating: ["safe", "suggestive"],
    }),
    getTags(),
  ]);

  const genres = tags.filter((t) => t.group === "genre");
  const themes = tags.filter((t) => t.group === "theme");

  return (
    <ExploreClient
      initialResults={results.data}
      initialTotal={results.total}
      genres={genres}
      themes={themes}
      initialQuery={query}
      initialSort={sort}
    />
  );
}
