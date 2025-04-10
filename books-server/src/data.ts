import { Author, Book, Genre, User } from './model';

export const adminUser: User = {
  email: 'admin@books',
  password: '123',
};

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

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

// At least one
function randomSlice1<T>(array: T[]): T[] {
  const start = randomInt(0, array.length - 1);
  const end = randomInt(start + 1, array.length);
  return array.slice(start, end);
}

const books = bookIndices.map((i): Book => {
  // find radnom authors for a book
  // const start = Math.random() * authors.length;
  // const len = Math.random() * 5;
  // const someAuthors = authors.slice(start, start + len);
  const someAuthors = randomSlice1(authors);

  // pick some genres
  const forChildren = Math.random() >= 0.5;
  let genres: Genre[] = forChildren
    ? randomSlice1(childrenGenres)
    : randomSlice1(adultGenres);

  const placeholderNum = Math.random() < 0.5 ? 1 : 2;

  return {
    id: i,
    title: `Book ${i}`,
    isbn: `978-3-16-148410-${i}`,
    price: Math.floor(Math.random() * 90 + 10),
    quantity: 30,
    publishDate: new Date(2020, i % 12, i % 28),
    pageCount: 200,
    genres: genres,
    authors: someAuthors,
    forChildren: forChildren,
    image: `/public/images/placeholder${placeholderNum}.jpg`,
    description:
      'Praesent pulvinar condimentum scelerisque. Proin vitae sapien risus. Sed consequat ligula tortor, in porta est commodo nec. Etiam lobortis, libero id suscipit commodo, nisi lacus rhoncus nibh, non volutpat eros nulla faucibus mi. Duis risus libero, tempor at pulvinar ut, egestas iaculis orci. Quisque rutrum congue turpis, ut scelerisque leo lobortis vitae. Sed gravida porttitor vehicula. Pellentesque risus sem, pulvinar fermentum lorem nec, ullamcorper mollis lorem. Nulla in aliquet sem.',
  };
});

export { authors, books, childrenGenres, adultGenres };
