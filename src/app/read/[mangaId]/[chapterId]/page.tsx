import { getChapterPages, getMangaById, getMangaChapters } from "@/lib/mangadex";
import ReaderClient from "./ReaderClient";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ mangaId: string; chapterId: string }>;
}) {
  const { mangaId, chapterId } = await params;

  const [pages, manga, chaptersResult] = await Promise.all([
    getChapterPages(chapterId),
    getMangaById(mangaId),
    getMangaChapters(mangaId, { limit: 500 }),
  ]);

  const chapters = chaptersResult.data
    .filter((ch) => ch.chapter !== null)
    .sort((a, b) => parseFloat(a.chapter!) - parseFloat(b.chapter!));

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

  const currentIndex = uniqueChapters.findIndex((ch) => ch.id === chapterId);
  const currentChapter = uniqueChapters[currentIndex];
  const prevChapter = currentIndex > 0 ? uniqueChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < uniqueChapters.length - 1 ? uniqueChapters[currentIndex + 1] : null;

  return (
    <ReaderClient
      pages={pages}
      mangaId={mangaId}
      mangaTitle={manga.title}
      chapterNumber={currentChapter?.chapter || "?"}
      totalChapters={uniqueChapters.length}
      prevChapterId={prevChapter?.id || null}
      nextChapterId={nextChapter?.id || null}
    />
  );
}
