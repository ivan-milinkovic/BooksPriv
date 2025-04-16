import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

const serverConfig = {
  port: Number(process.env.BOOKS_PORT) || 3000,
};

const sessionCookieName = 'books-session';
const rootPath = path.join(__dirname, '../');

export { serverConfig, rootPath, sessionCookieName };
