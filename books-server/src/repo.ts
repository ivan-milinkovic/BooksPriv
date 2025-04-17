import { CreateAuthorData, CreateBookData, UpdateBookData } from './model';
import prisma from './sharedPrisma';

class Repo {
  static async getAuthors() {
    return await prisma.author.findMany();
  }

  static async createAuthor(newAuthor: CreateAuthorData) {
    await prisma.author.create({ data: newAuthor });
  }

  static async getGenres() {
    return await prisma.genre.findMany();
  }

  static async getBooks(
    pageIndex: number,
    pageSize: number,
    titleFilter: string | undefined,
    authorsFilter: string | undefined,
    genresFilter: number[],
  ) {
    return await prisma.book.findMany({
      where: {
        title: {
          ...(titleFilter ? { contains: titleFilter } : {}),
        },
        authors: {
          every: {
            name: {
              ...(authorsFilter ? { contains: authorsFilter } : {}),
            },
          },
        },
        genres: {
          every: {
            id: {
              ...(genresFilter ? { in: genresFilter } : {}),
            },
          },
        },
      },
      include: {
        authors: {},
        genres: {},
      },
      skip: pageIndex * pageSize,
      take: pageSize,
    });
  }

  // todo: Inneficient way, how to query the same?
  static async getBooks2(
    pageIndex: number,
    pageSize: number,
    titleFilter: string | undefined,
    authorsFilter: string | undefined,
    genresFilter: number[],
  ) {
    let resBooks = await prisma.book.findMany({
      where: {
        title: {
          ...(titleFilter ? { contains: titleFilter } : {}),
        },
      },
      include: {
        authors: {},
        genres: {},
      },
    });

    // if (!resBooks) return [];

    // if (titleFilter && titleFilter.length > 0) {
    //   resBooks = resBooks.filter((b) => b.title.includes(titleFilter));
    // }

    // Filter by authors
    if (authorsFilter && authorsFilter.length > 0) {
      resBooks = resBooks.filter((b) => {
        for (const a of b.authors) {
          if (a.name.includes(authorsFilter)) return true;
        }
        return false;
      });
    }

    // Filter by genres
    if (genresFilter && genresFilter.length > 0) {
      // OR filter
      /* resBooks = resBooks.filter((b) => {
        for (const g of b.genres) {
          if (genresFilter.includes(g)) return true;
        }
        return false;
      }); */

      // AND filter
      resBooks = resBooks.filter((b) => {
        for (const fg of genresFilter) {
          const index = b.genres.findIndex((g) => {
            return g.id == fg;
          });
          if (index === -1) return false;
        }
        return true;
      });
      console.log(resBooks.length);
    }

    // Filter by page
    const start = pageIndex * pageSize;
    resBooks = resBooks.slice(start, start + pageSize);

    return resBooks;
  }

  static async getBook(id: number) {
    return prisma.book.findFirst({
      where: { id: id },
      include: {
        authors: {},
        genres: {},
      },
    });
  }

  static async getBooksByIds(ids: number[]) {
    return prisma.book.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  static async getBookImagesByIds(ids: number[]) {
    return prisma.book.findMany({
      select: {
        image: true,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  static async createBook(newBook: CreateBookData) {
    const book = await prisma.book.create({
      data: {
        isbn: newBook.isbn,
        title: newBook.title,
        price: newBook.price,
        quantity: newBook.quantity,
        publishDate: newBook.publishDate,
        pageCount: newBook.pageCount,
        forChildren: newBook.forChildren,
        description: newBook.description,
        image: newBook.image,
        authors: {
          connect: newBook.authorIds.map((id) => {
            return { id: id };
          }),
        },
        genres: {
          connect: newBook.genreIds.map((id) => {
            return { id: id };
          }),
        },
      },
    });
  }

  static async updateBook(bookData: UpdateBookData) {
    await prisma.book.update({
      where: {
        id: bookData.id,
      },
      data: {
        isbn: bookData.isbn,
        title: bookData.title,
        price: bookData.price,
        quantity: bookData.quantity,
        publishDate: bookData.publishDate,
        pageCount: bookData.pageCount,
        forChildren: bookData.forChildren,
        description: bookData.description,
        image: bookData.image,
        authors: {
          connect: bookData.authorIds.map((id) => {
            return { id: id };
          }),
        },
        genres: {
          connect: bookData.genreIds.map((id) => {
            return { id: id };
          }),
        },
      },
    });
  }

  static async deleteBooksByIds(ids: number[]) {
    return prisma.book.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  static async reconnect() {
    await prisma.$disconnect();
    await prisma.$connect();
  }
}

export default Repo;
