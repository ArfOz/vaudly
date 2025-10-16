Prisma integration for the backend.

Steps to use:
1. Set DATABASE_URL in the repository `.env` file.
2. Edit `prisma/schema.prisma` with your desired models.
3. Run `npx prisma generate` and `npx prisma db push` (or `prisma migrate` flow if you prefer migrations).
4. PrismaService is a global provider exported from `PrismaModule` — import `PrismaModule` in `AppModule` or rely on global provider.
