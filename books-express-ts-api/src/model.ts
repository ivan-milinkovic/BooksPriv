type Genre = string;

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

const ChildrenAndYoungAdultGenres: Genre[] = [
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

type Author = {
  name: string;
  bio: string;
  dateOfBirth: Date;
};

const authors: Author[] = [
  {
    name: 'Author 1',
    bio: 'Biography 1',
    dateOfBirth: new Date('1980/01/01'),
  },
  {
    name: 'Author 2',
    bio: 'Biography 2',
    dateOfBirth: new Date('1980/02/01'),
  },
  {
    name: 'Author 3',
    bio: 'Biography 3',
    dateOfBirth: new Date('1980/03/01'),
  },
];

type Book = {
  id: number;
  title: string;
  isbn: string;
  quantity: number;
  publishDate: Date;
  pageCount: number;
  genres: Genre[];
  authors: Author[];
  forChildren: boolean;
};

const books: Book[] = [
  {
    id: 1,
    title: 'Book 1',
    isbn: '978-3-16-148410-1',
    quantity: 30,
    publishDate: new Date('2020/02/01'),
    pageCount: 200,
    genres: [nonFictionGenres[0], nonFictionGenres[1]],
    authors: [authors[0]],
    forChildren: true,
  },
  {
    id: 2,
    title: 'Book 2',
    isbn: '978-3-16-148410-2',
    quantity: 40,
    publishDate: new Date('2020/03/01'),
    pageCount: 300,
    genres: [nonFictionGenres[2], nonFictionGenres[3], nonFictionGenres[5]],
    authors: [authors[1], authors[2]],
    forChildren: true,
  },
];

export { books };
