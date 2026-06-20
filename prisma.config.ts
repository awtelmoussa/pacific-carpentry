import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use DIRECT_URL for migrations (bypassing pgbouncer pooler restrictions)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    // Configure seeding command for Prisma 7
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});
