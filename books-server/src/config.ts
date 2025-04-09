import dotenv from 'dotenv';

dotenv.config();

interface ServerConfiguration {
  port: number;
}

const config: ServerConfiguration = {
  port: Number(process.env.BOOKS_PORT) || 3000,
};

export default config;
