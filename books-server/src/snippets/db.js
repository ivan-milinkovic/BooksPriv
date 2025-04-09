const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/books.sqlite"); // ":memory:"

function createTables() {
  const createBooksTableSql = `
  CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    isbn TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL, -- cents (1/100)
    date INTEGER, -- unix time,
    description TEXT,
    pages INTEGER,
    genre TEXT,
    image TEXT);`;

  const createAuthorsTableSql = `
  CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL);`;

  const createAuthorsBooksTableSql = `
  CREATE TABLE IF NOT EXISTS authors_books(
    author_id INTEGER NOT NULL REFERENCES authors(id),
    book_id INTEGER NOT NULL REFERENCES books(id));`;

  console.log("creating tables");
  db.serialize(() => {
    console.log("creating books table");
    db.run(createBooksTableSql);

    console.log("creating authors table");
    db.run(createAuthorsTableSql);

    console.log("creating authors_books table");
    db.run(createAuthorsBooksTableSql);
  });
}

function seedAuthorsAndBooks() {
  const seedAuthorsSql = `
    INSERT INTO authors (id, name)
    VALUES (1, "Author 1"), (2, "Author 2")`;

  const seedBooksSql = `
    INSERT INTO books (id, title, isbn, quantity, price, date, description, pages, genre, image)
    VALUES
    (1, "Book 1", "978-3-16-148410-0", 3, 3000, 1586351217, "Description 1", 300, "Genre 1", null),
    (2, "Book 2", "978-3-16-148410-1", 2, 2000, 1586437617, "Description 2", 200, "Genre 2", null),
    (3, "Book 3", "978-3-16-148410-3", 4, 4000, 1586537617, "Description 3", 400, "Genre 3", null)`;

  const seedAuthorsBooksTable = `
    INSERT INTO authors_books (author_id, book_id)
    VALUES (1, 1), (1, 2), (2, 3)`;

  db.serialize(() => {
    console.log("seeding authors table");
    db.run(seedAuthorsSql);

    console.log("seeding books table");
    db.run(seedBooksSql);

    console.log("seeding authors_books table");
    db.run(seedAuthorsBooksTable);
  });
}

// createTables();
// seedAuthorsAndBooks();

async function getBooks(offset, count) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(
        // `SELECT * FROM books LIMIT (?) OFFSET (?);`,
        `SELECT * 
        FROM books b
        INNER JOIN authors_books ab ON ab.book_id = b.id
        INNER JOIN authors a ON ab.author_id = a.id
        LIMIT (?) OFFSET (?);`,
        [count, offset],
        (err, rows) => {
          if (err) reject(err);

          db.each("SELECT * FROM authors WHERE");

          resolve(rows);
        }
      );
    });
  });
}

module.exports = { getBooks };
