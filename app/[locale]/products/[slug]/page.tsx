import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ProductDetailClient from '@/components/ProductDetailClient';
import { prisma, mapDbProductToProduct } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
  });
  
  if (!dbProduct) {
    return {
      title: 'Product Not Found | Pacific Carpentry',
    };
  }

  const name = locale === 'ar' ? dbProduct.nameAr : dbProduct.nameEn;
  const tagline = locale === 'ar' ? dbProduct.taglineAr : dbProduct.taglineEn;

  return {
    title: `${name} | Pacific Carpentry`,
    description: tagline,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // Fetch the product from the database
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      colors: true,
      sizes: true,
    },
  });

  if (!dbProduct) {
    notFound();
  }

  const product = mapDbProductToProduct(dbProduct);

  // Get up to 4 related products (excluding the current one)
  const dbRelated = await prisma.product.findMany({
    where: {
      NOT: {
        slug,
      },
    },
    include: {
      colors: true,
      sizes: true,
    },
    take: 4,
  });

  const relatedProducts = dbRelated.map(mapDbProductToProduct);

  return (
    <ProductDetailClient
      product={product}
      locale={locale}
      relatedProducts={relatedProducts}
    />
  );
}
