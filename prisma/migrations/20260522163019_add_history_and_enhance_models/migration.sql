-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "mangaTitle" TEXT NOT NULL,
    "mangaCover" TEXT,
    "mangaType" TEXT NOT NULL DEFAULT '',
    "chapterId" TEXT NOT NULL,
    "chapterNum" TEXT NOT NULL,
    "readAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "mangaTitle" TEXT NOT NULL DEFAULT '',
    "mangaCover" TEXT,
    "mangaType" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'reading',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("createdAt", "id", "mangaId", "status", "updatedAt", "userId") SELECT "createdAt", "id", "mangaId", "status", "updatedAt", "userId" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_userId_mangaId_key" ON "Bookmark"("userId", "mangaId");
CREATE TABLE "new_ReadingProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "lastChapterId" TEXT NOT NULL,
    "lastChapterNum" TEXT NOT NULL DEFAULT '',
    "lastPage" INTEGER NOT NULL DEFAULT 0,
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReadingProgress" ("id", "lastChapterId", "lastPage", "mangaId", "updatedAt", "userId") SELECT "id", "lastChapterId", "lastPage", "mangaId", "updatedAt", "userId" FROM "ReadingProgress";
DROP TABLE "ReadingProgress";
ALTER TABLE "new_ReadingProgress" RENAME TO "ReadingProgress";
CREATE UNIQUE INDEX "ReadingProgress_userId_mangaId_key" ON "ReadingProgress"("userId", "mangaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_mangaId_key" ON "ReadingHistory"("userId", "mangaId");
