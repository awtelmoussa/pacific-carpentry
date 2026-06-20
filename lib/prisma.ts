import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Setup node-postgres connection pool
const pool = new Pool({
  connectionString,
  max: process.env.NODE_ENV === 'production' ? 15 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Wrap the pool in the Prisma pg adapter
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import {
  Product as PrismaProduct,
  ProductColor,
  ProductSize,
  Category as PrismaCategory,
  Project as PrismaProject,
} from '@prisma/client';

export type ExtendedPrismaProduct = PrismaProduct & {
  colors: ProductColor[];
  sizes: ProductSize[];
};

export function mapPrismaCategory(category: PrismaCategory): string {
  switch (category) {
    case 'DINING_TABLES':
      return 'dining-tables';
    case 'CHAIRS':
      return 'chairs';
    case 'CABINETS':
      return 'cabinets';
    case 'DOORS':
      return 'doors';
    case 'SHELVING':
      return 'shelving';
    default:
      return 'dining-tables';
  }
}

export function mapDbProductToProduct(dbProduct: ExtendedPrismaProduct) {
  return {
    id: dbProduct.slug,
    cat: mapPrismaCategory(dbProduct.category),
    name: { en: dbProduct.nameEn, ar: dbProduct.nameAr },
    tagline: { en: dbProduct.taglineEn, ar: dbProduct.taglineAr },
    desc: { en: dbProduct.descEn, ar: dbProduct.descAr },
    images: dbProduct.images,
    colors: dbProduct.colors
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ en: c.nameEn, ar: c.nameAr, hex: c.hex })),
    sizes: dbProduct.sizes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ en: s.labelEn, ar: s.labelAr, price: s.price })),
  };
}

export function mapDbProjectToProject(dbProject: PrismaProject) {
  return {
    id: dbProject.slug,
    en: dbProject.titleEn,
    ar: dbProject.titleAr,
    cat: { en: dbProject.catEn, ar: dbProject.catAr },
    year: dbProject.year,
    images: dbProject.images,
  };
}

