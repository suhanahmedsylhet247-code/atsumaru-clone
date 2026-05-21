import { searchManga } from "@/lib/mangadex";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const sort = url.searchParams.get("sort") || "popular";

  const orderMap: Record<string, Record<string, string>> = {
    popular: { followedCount: "desc" },
    recent: { createdAt: "desc" },
    rating: { rating: "desc" },
    updated: { updatedAt: "desc" },
    relevance: { relevance: "desc" },
  };

  const results = await searchManga({
    title: q,
    limit,
    offset,
    order: orderMap[sort] || orderMap.popular,
    contentRating: ["safe", "suggestive"],
  });

  return Response.json(results);
}
