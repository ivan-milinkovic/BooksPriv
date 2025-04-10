import dotenv from 'dotenv';

dotenv.config();

interface ServerConfiguration {
  port: number;
  sessionCookieName: string;
}

const config: ServerConfiguration = {
  port: Number(process.env.BOOKS_PORT) || 3000,
  sessionCookieName: 'books-session',
};

export default config;
