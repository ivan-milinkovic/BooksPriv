import dotenv from 'dotenv';

dotenv.config();

interface ServerConfig {
  port: number;
  environment: string;
  isDev: boolean;
}

const serverConfig: ServerConfig = {
  port: Number(process.env.port) || 3000,
  environment: process.env.environment || 'dev',
  isDev: process.env.environment === 'dev',
};

export default serverConfig;
