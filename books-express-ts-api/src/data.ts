import { Author, Book, Genre } from './model';

const nonFictionGenres: Genre[] = [
  'Science',
  'Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Adventure',
  'Literary Fiction',
  'Contemporary Fiction',
];

const childrenGenres: Genre[] = [
  'Picture Books',
  'Early Readers',
  'Middle Grade',
  'Young Adult (YA)',
  'Coming of Age',
  'Fairy Tales / Folk Tales',
  'Educational',
];

const adultGenres: Genre[] = [
  'Historical Romance',
  'Contemporary Romance',
  'Romantic Comedy',
  'Paranormal Romance',
  'LGBTQ+ Romance',
  'Dark Romance',
  'Horror',
  'Dystopian',
  'Magical Realism',
  'Historical Fiction',
];

const authorIndices = Array.from({ length: 5 }, (val, index) => index);
const authors = authorIndices.map((i): Author => {
  return {
    name: `Author ${i}`,
    bio: `Biography ${i}`,
    dateOfBirth: new Date(1980, i, 1),
  };
});

const bookIndices = Array.from({ length: 50 }, (val, index) => index);

const books = bookIndices.map((i): Book => {
  // find radnom authors for a book
  const start = Math.random() * authors.length;
  const len = Math.random() * 5;
  const someAuthors = authors.slice(start, start + len);
  return {
    id: i,
    title: `Book ${i}`,
    isbn: `978-3-16-148410-${i}`,
    price: Math.floor(Math.random() * 90 + 10),
    quantity: 30,
    publishDate: new Date(2020, i % 12, i % 28),
    pageCount: 200,
    genres: [nonFictionGenres[0], nonFictionGenres[1]],
    authors: someAuthors,
    forChildren: true,
    image: null,
  };
});

export { authors, books, childrenGenres, adultGenres };
