'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(orderData: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  locale: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<{
    productId: string;
    nameEn: string;
    nameAr: string;
    color: string;
    size: string;
    price: number;
    qty: number;
  }>;
}) {
  try {
    const orderNo = `PC-${Math.floor(100000 + Math.random() * 900000)}`;
    await prisma.order.create({
      data: {
        number: orderNo,
        fullName: orderData.fullName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        locale: orderData.locale,
        subtotal: Math.round(orderData.subtotal),
        shipping: Math.round(orderData.shipping),
        total: Math.round(orderData.total),
        items: {
          create: orderData.items.map((item) => ({
            productId: item.productId,
            nameEn: item.nameEn,
            nameAr: item.nameAr,
            color: item.color,
            size: item.size,
            price: Math.round(item.price),
            qty: item.qty,
          })),
        },
      },
    });

    // Refresh layout data in the admin panel
    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return { success: true, orderNumber: orderNo };
  } catch (error) {
    console.error('[createOrderAction] Error placing order:', error);
    return { success: false, error: 'Failed to place order' };
  }
}

export async function submitContactAction(formData: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  body: string;
}) {
  try {
    await prisma.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        body: formData.body,
        read: false,
      },
    });

    // Refresh inbox badge indicators in the admin panel
    revalidatePath('/admin');
    revalidatePath('/admin/messages');

    return { success: true };
  } catch (error) {
    console.error('[submitContactAction] Error submitting contact message:', error);
    return { success: false, error: 'Failed to submit message' };
  }
}

export async function submitBespokeRequestAction(data: {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  timber: string;
  dimensions: string;
  notes?: string;
  images?: string[];
}) {
  try {
    const referenceNo = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
    await prisma.bespokeRequest.create({
      data: {
        referenceNo,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        category: data.category,
        timber: data.timber,
        dimensions: data.dimensions,
        notes: data.notes || null,
        images: data.images || [],
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/requests');
    return { success: true, referenceNo };
  } catch (error) {
    console.error('[submitBespokeRequestAction] Error submitting bespoke request:', error);
    return { success: false, error: 'Failed to submit bespoke request.' };
  }
}

export async function getSimilarReferenceImageAction(category: string) {
  try {
    // Map category string to Prisma Category enum
    let prismaCategory;
    const catLower = category.toLowerCase();
    if (catLower.includes('table')) {
      prismaCategory = 'DINING_TABLES';
    } else if (catLower.includes('chair') || catLower.includes('bench')) {
      prismaCategory = 'CHAIRS';
    } else if (catLower.includes('cabinet') || catLower.includes('sideboard')) {
      prismaCategory = 'CABINETS';
    } else if (catLower.includes('door')) {
      prismaCategory = 'DOORS';
    } else if (catLower.includes('shelving') || catLower.includes('shelf')) {
      prismaCategory = 'SHELVING';
    }

    if (!prismaCategory) {
      return { success: true, url: null, name: null };
    }

    // Query database for a product in this category that has images
    const product = await prisma.product.findFirst({
      where: {
        category: prismaCategory as any,
        images: {
          isEmpty: false,
        },
      },
      select: {
        images: true,
        nameEn: true,
        nameAr: true,
      },
    });

    if (product && product.images && product.images.length > 0) {
      return { success: true, url: product.images[0], name: product.nameEn };
    }

    // Fallback: Query projects for a match
    const project = await prisma.project.findFirst({
      where: {
        images: {
          isEmpty: false,
        },
      },
      select: {
        images: true,
        titleEn: true,
      },
    });

    if (project && project.images && project.images.length > 0) {
      return { success: true, url: project.images[0], name: project.titleEn };
    }

    return { success: true, url: null, name: null };
  } catch (error) {
    console.error('[getSimilarReferenceImageAction] Error finding similar image:', error);
    return { success: false, error: 'Failed to find similar image reference.' };
  }
}
