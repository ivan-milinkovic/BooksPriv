-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publishDate" DATETIME NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "forChildren" BOOLEAN NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Book" ("createdAt", "description", "forChildren", "id", "image", "isbn", "pageCount", "price", "publishDate", "quantity", "title", "updatedAt") SELECT "createdAt", "description", "forChildren", "id", "image", "isbn", "pageCount", "price", "publishDate", "quantity", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
