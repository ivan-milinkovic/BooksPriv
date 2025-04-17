# Prisma ORM

https://www.prisma.io/docs/getting-started/quickstart-sqlite

`npx prisma init --datasource-provider sqlite --output ./generated/prisma`
`npx prisma generate`
`npx prisma migrate dev --name init`

Seeding: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
`npx prisma db seed`

`npx prisma studio` (view data)

https://www.prisma.io/docs/orm/prisma-client/queries

Use one prisma client instance, it maintains a connection pool:
https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications

https://github.com/prisma/prisma-examples?tab=readme-ov-file#real-world--production-ready-example-projects-with-prisma

Type safety: https://www.prisma.io/docs/orm/prisma-client/type-safety
