### Setup _Prisma_

Run the following command once:

1. Run `npx prisma init`

Then:

2. Run `npx prisma db pull` to turn your database schema into a Prisma schema.
3. Run `npx prisma generate` to generate the Prisma Client.
4. Run `npx prisma db push` to push scheme to database.
5. Run `npx prisma migrate dev` to regenerate schema (if scheme change)


httpcodes:
https://www.webfx.com/web-development/glossary/http-status-codes/