import Link from "next/link";

interface MangaCardProps {
  id: string;
  title: string;
  cover: string | null;
  type: string;
}

const typeBadgeColors: Record<string, string> = {
  Manga: "bg-badge-manga",
  Manhwa: "bg-badge-manhwa",
  Manhua: "bg-badge-manhua",
  Other: "bg-gray-500",
};

export default function MangaCard({ id, title, cover, type }: MangaCardProps) {
  return (
    <Link href={`/manga/${id}`} className="group block shrink-0 w-[140px]">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-card mb-2 shadow-md shadow-black/20">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
            No Cover
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span
          className={`absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-semibold rounded text-white ${typeBadgeColors[type] || typeBadgeColors.Other}`}
        >
          {type}
        </span>
      </div>
      <p className="text-sm text-text-primary line-clamp-2 group-hover:text-accent transition-colors leading-tight">
        {title}
      </p>
    </Link>
  );
}
