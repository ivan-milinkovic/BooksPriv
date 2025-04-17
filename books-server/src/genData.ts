import { User, UserInfo } from './model';

export const adminUser: User = {
  email: 'admin@books',
  password: '123',
};

export const guestUserInfo: UserInfo = {
  email: '',
  isGuest: true,
};

const childrenGenresStr: string[] = [
  'Picture Books',
  'Early Readers',
  'Middle Grade',
  'Young Adult (YA)',
  'Coming of Age',
  'Fairy Tales / Folk Tales',
  'Educational',
];

const adultGenresStr: string[] = [
  'Historical Romance',
  'Contemporary Romance',
  'Romantic Comedy',
  'Paranormal Romance',
  'Dark Romance',
  'Horror',
  'Dystopian',
  'Magical Realism',
  'Historical Fiction',
  'Science',
  'Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Adventure',
  'Literary Fiction',
  'Contemporary Fiction',
];

const authorIndices = Array.from({ length: 5 }, (val, index) => index);
let authors = authorIndices.map((i) => {
  return {
    id: i,
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

let books = bookIndices.map((i) => {
  const authorNames = randomSlice1(authors).map((a) => a.name);

  // pick some genres
  const forChildren = Math.random() >= 0.5;
  let genreNames: string[] = forChildren
    ? randomSlice1(childrenGenresStr)
    : randomSlice1(adultGenresStr);

  return {
    id: i,
    title: `Book ${i}`,
    isbn: `0-1645-2527-${i}`,
    price: Math.floor(Math.random() * 90 + 10),
    quantity: 30,
    publishDate: new Date(2020, i % 12, i % 28),
    pageCount: 200,
    authorNames: authorNames,
    genreNames: genreNames,
    forChildren: forChildren,
    image: null,
    description:
      'Praesent pulvinar condimentum scelerisque. Proin vitae sapien risus. Sed consequat ligula tortor, in porta est commodo nec. Etiam lobortis, libero id suscipit commodo, nisi lacus rhoncus nibh, non volutpat eros nulla faucibus mi. Duis risus libero, tempor at pulvinar ut, egestas iaculis orci. Quisque rutrum congue turpis, ut scelerisque leo lobortis vitae. Sed gravida porttitor vehicula. Pellentesque risus sem, pulvinar fermentum lorem nec, ullamcorper mollis lorem. Nulla in aliquet sem.',
  };
});

export { authors, books, childrenGenresStr, adultGenresStr };
