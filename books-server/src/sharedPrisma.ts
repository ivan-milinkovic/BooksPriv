import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

export default prisma;

// Use one prisma client instance, it maintains a connection pool:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications
