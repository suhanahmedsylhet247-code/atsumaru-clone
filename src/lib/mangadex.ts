const BASE_URL = "https://api.mangadex.org";

export interface MangaDexManga {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    altTitles: Record<string, string>[];
    description: Record<string, string>;
    status: string;
    year: number | null;
    contentRating: string;
    tags: {
      id: string;
      type: string;
      attributes: {
        name: Record<string, string>;
        group: string;
      };
    }[];
    originalLanguage: string;
    lastChapter: string | null;
    lastVolume: string | null;
    createdAt: string;
    updatedAt: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes?: Record<string, unknown>;
  }[];
}

export interface MangaDexChapter {
  id: string;
  type: string;
  attributes: {
    title: string | null;
    volume: string | null;
    chapter: string | null;
    pages: number;
    translatedLanguage: string;
    publishAt: string;
    createdAt: string;
    updatedAt: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes?: Record<string, unknown>;
  }[];
}

function getTitle(manga: MangaDexManga): string {
  const titles = manga.attributes.title;
  return titles.en || titles["ja-ro"] || titles.ja || Object.values(titles)[0] || "Untitled";
}

function getCoverUrl(manga: MangaDexManga): string | null {
  const coverRel = manga.relationships.find((r) => r.type === "cover_art");
  if (!coverRel || !coverRel.attributes) return null;
  const fileName = coverRel.attributes.fileName as string;
  return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
}

function getAuthor(manga: MangaDexManga): string | null {
  const authorRel = manga.relationships.find((r) => r.type === "author");
  if (!authorRel || !authorRel.attributes) return null;
  return authorRel.attributes.name as string;
}

function getGenres(manga: MangaDexManga): string[] {
  return manga.attributes.tags
    .filter((t) => t.attributes.group === "genre" || t.attributes.group === "theme")
    .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0])
    .filter(Boolean);
}

function getMangaType(manga: MangaDexManga): string {
  const lang = manga.attributes.originalLanguage;
  if (lang === "ja") return "Manga";
  if (lang === "ko") return "Manhwa";
  if (lang === "zh" || lang === "zh-hk") return "Manhua";
  return "Other";
}

export function formatManga(manga: MangaDexManga) {
  return {
    id: manga.id,
    title: getTitle(manga),
    cover: getCoverUrl(manga),
    description: manga.attributes.description?.en || "",
    status: manga.attributes.status,
    year: manga.attributes.year,
    contentRating: manga.attributes.contentRating,
    genres: getGenres(manga),
    type: getMangaType(manga),
    author: getAuthor(manga),
    lastChapter: manga.attributes.lastChapter,
  };
}

export type FormattedManga = ReturnType<typeof formatManga>;

export async function searchManga(params: {
  title?: string;
  limit?: number;
  offset?: number;
  includedTags?: string[];
  excludedTags?: string[];
  status?: string[];
  contentRating?: string[];
  order?: Record<string, string>;
  originalLanguage?: string[];
}): Promise<{ data: FormattedManga[]; total: number }> {
  const url = new URL(`${BASE_URL}/manga`);
  url.searchParams.set("limit", String(params.limit || 20));
  url.searchParams.set("offset", String(params.offset || 0));
  url.searchParams.append("includes[]", "cover_art");
  url.searchParams.append("includes[]", "author");

  if (params.title) url.searchParams.set("title", params.title);
  if (params.includedTags) {
    for (const tag of params.includedTags) url.searchParams.append("includedTags[]", tag);
  }
  if (params.excludedTags) {
    for (const tag of params.excludedTags) url.searchParams.append("excludedTags[]", tag);
  }
  if (params.status) {
    for (const s of params.status) url.searchParams.append("status[]", s);
  }
  if (params.contentRating) {
    for (const cr of params.contentRating) url.searchParams.append("contentRating[]", cr);
  } else {
    url.searchParams.append("contentRating[]", "safe");
    url.searchParams.append("contentRating[]", "suggestive");
  }
  if (params.order) {
    for (const [key, val] of Object.entries(params.order)) {
      url.searchParams.set(`order[${key}]`, val);
    }
  }
  if (params.originalLanguage) {
    for (const lang of params.originalLanguage) {
      url.searchParams.append("originalLanguage[]", lang);
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`);
  const json = await res.json();
  return {
    data: json.data.map(formatManga),
    total: json.total,
  };
}

export async function getMangaById(id: string): Promise<FormattedManga> {
  const url = new URL(`${BASE_URL}/manga/${id}`);
  url.searchParams.append("includes[]", "cover_art");
  url.searchParams.append("includes[]", "author");
  url.searchParams.append("includes[]", "artist");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`);
  const json = await res.json();
  return formatManga(json.data);
}

export async function getMangaChapters(
  mangaId: string,
  params?: { limit?: number; offset?: number; order?: string; translatedLanguage?: string[] }
): Promise<{
  data: {
    id: string;
    chapter: string | null;
    title: string | null;
    volume: string | null;
    pages: number;
    publishAt: string;
    translatedLanguage: string;
    scanlationGroup: string | null;
  }[];
  total: number;
}> {
  const url = new URL(`${BASE_URL}/manga/${mangaId}/feed`);
  url.searchParams.set("limit", String(params?.limit || 100));
  url.searchParams.set("offset", String(params?.offset || 0));
  url.searchParams.set("order[chapter]", params?.order || "desc");
  url.searchParams.append("translatedLanguage[]", "en");
  url.searchParams.append("includes[]", "scanlation_group");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`);
  const json = await res.json();

  return {
    data: json.data.map((ch: MangaDexChapter) => {
      const group = ch.relationships.find((r) => r.type === "scanlation_group");
      return {
        id: ch.id,
        chapter: ch.attributes.chapter,
        title: ch.attributes.title,
        volume: ch.attributes.volume,
        pages: ch.attributes.pages,
        publishAt: ch.attributes.publishAt,
        translatedLanguage: ch.attributes.translatedLanguage,
        scanlationGroup: group?.attributes
          ? (group.attributes as Record<string, unknown>).name as string
          : null,
      };
    }),
    total: json.total,
  };
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`);
  const json = await res.json();

  const baseUrl = json.baseUrl;
  const hash = json.chapter.hash;
  const pages: string[] = json.chapter.data.map(
    (filename: string) => `${baseUrl}/data/${hash}/${filename}`
  );

  return pages;
}

export async function getTags(): Promise<
  { id: string; name: string; group: string }[]
> {
  const res = await fetch(`${BASE_URL}/manga/tag`);
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`);
  const json = await res.json();
  return json.data.map(
    (tag: { id: string; attributes: { name: Record<string, string>; group: string } }) => ({
      id: tag.id,
      name: tag.attributes.name.en || Object.values(tag.attributes.name)[0],
      group: tag.attributes.group,
    })
  );
}
