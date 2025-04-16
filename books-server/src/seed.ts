import { PrismaClient } from '../gen/prisma';
import { authors, books, genres } from './genData';

const prisma = new PrismaClient();

async function seed() {
  const authorsData = authors.map((a) => {
    return {
      id: a.id,
      name: a.name,
      bio: a.bio,
      dateOfBirth: a.dateOfBirth,
    };
  });
  let gid = 0;
  const adultGenreData = genres.adult.map((g) => {
    return { id: gid++, name: g, forChildren: false };
  });
  const childrenGenreData = genres.adult.map((g) => {
    return { id: gid++, name: g, forChildren: true };
  });
  const genresData = [...childrenGenreData, ...adultGenreData];

  for (const author of authorsData) {
    await prisma.author.upsert({
      where: { id: author.id },
      update: {},
      create: author,
    });
  }

  for (const genre of genresData) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      update: {},
      create: genre,
    });
  }

  // await prisma.author.createMany({ data: authorsData });
  // await prisma.genre.createMany({ data: genresData });

  for (const b of books) {
    const bookData = {
      title: b.title,
      isbn: b.isbn,
      price: b.price,
      quantity: b.quantity,
      publishDate: b.publishDate,
      pageCount: b.pageCount,
      forChildren: b.forChildren,
      image: b.image,
      description: b.description,
    };

    const be = await prisma.book.create({
      data: bookData,
    });

    const bookAuthors = await prisma.author.findMany({
      where: {
        name: {
          in: b.authors.map((a) => a.name),
        },
      },
    });
    const bookAuthorIds = bookAuthors.map((a) => {
      return { id: a.id };
    });

    const bookGenres = await prisma.genre.findMany({
      where: {
        name: {
          in: b.genres,
        },
      },
    });
    const bookGenreIds = bookGenres.map((g) => {
      return { id: g.id };
    });

    await prisma.book.update({
      where: {
        id: be.id,
      },
      data: {
        authors: {
          connect: bookAuthorIds,
        },
      },
    });

    await prisma.book.update({
      where: {
        id: be.id,
      },
      data: {
        genres: {
          connect: bookGenreIds,
        },
      },
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
