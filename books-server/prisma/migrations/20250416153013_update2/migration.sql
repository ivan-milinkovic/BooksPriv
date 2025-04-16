/*
  Warnings:

  - You are about to drop the column `bookId` on the `Genre` table. All the data in the column will be lost.
  - Added the required column `forChildren` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "forChildren" BOOLEAN NOT NULL
);
INSERT INTO "new_Genre" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
