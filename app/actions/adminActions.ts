'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Category as PrismaCategory, OrderStatus as PrismaOrderStatus, RequestStatus as PrismaRequestStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// 1. Session Auth Management
export async function loginAdminAction(email: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Invalid credentials' };
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  } catch (error) {
    console.error('[loginAdminAction] Login error:', error);
    return { success: false, error: 'Authentication failed due to server error' };
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

// 2. Product CRUD Actions
export async function addProductAction(productData: {
  slug: string;
  category: PrismaCategory;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descEn: string;
  descAr: string;
  featured?: boolean;
  images?: string[];
  colors: Array<{ nameEn: string; nameAr: string; hex: string }>;
  sizes: Array<{ labelEn: string; labelAr: string; price: number }>;
}) {
  try {
    await prisma.product.create({
      data: {
        slug: productData.slug,
        category: productData.category,
        nameEn: productData.nameEn,
        nameAr: productData.nameAr,
        taglineEn: productData.taglineEn,
        taglineAr: productData.taglineAr,
        descEn: productData.descEn,
        descAr: productData.descAr,
        featured: productData.featured || false,
        images: productData.images || [],
        colors: {
          create: productData.colors.map((c, i) => ({
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            hex: c.hex,
            sortOrder: i,
          })),
        },
        sizes: {
          create: productData.sizes.map((s, i) => ({
            labelEn: s.labelEn,
            labelAr: s.labelAr,
            price: Math.round(Number(s.price)),
            sortOrder: i,
          })),
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[addProductAction] Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProductAction(
  id: string,
  productData: {
    slug: string;
    category: PrismaCategory;
    nameEn: string;
    nameAr: string;
    taglineEn: string;
    taglineAr: string;
    descEn: string;
    descAr: string;
    featured?: boolean;
    images?: string[];
    colors: Array<{ nameEn: string; nameAr: string; hex: string }>;
    sizes: Array<{ labelEn: string; labelAr: string; price: number }>;
  }
) {
  try {
    await prisma.$transaction([
      prisma.productColor.deleteMany({ where: { productId: id } }),
      prisma.productSize.deleteMany({ where: { productId: id } }),
      prisma.product.update({
        where: { id },
        data: {
          slug: productData.slug,
          category: productData.category,
          nameEn: productData.nameEn,
          nameAr: productData.nameAr,
          taglineEn: productData.taglineEn,
          taglineAr: productData.taglineAr,
          descEn: productData.descEn,
          descAr: productData.descAr,
          featured: productData.featured || false,
          images: productData.images || [],
          colors: {
            create: productData.colors.map((c, i) => ({
              nameEn: c.nameEn,
              nameAr: c.nameAr,
              hex: c.hex,
              sortOrder: i,
            })),
          },
          sizes: {
            create: productData.sizes.map((s, i) => ({
              labelEn: s.labelEn,
              labelAr: s.labelAr,
              price: Math.round(Number(s.price)),
              sortOrder: i,
            })),
          },
        },
      }),
    ]);

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[updateProductAction] Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[deleteProductAction] Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

// 3. Project CRUD Actions
export async function addProjectAction(projectData: {
  slug: string;
  titleEn: string;
  titleAr: string;
  catEn: string;
  catAr: string;
  year: string;
  images?: string[];
}) {
  try {
    await prisma.project.create({
      data: {
        slug: projectData.slug,
        titleEn: projectData.titleEn,
        titleAr: projectData.titleAr,
        catEn: projectData.catEn,
        catAr: projectData.catAr,
        year: projectData.year,
        images: projectData.images || [],
      },
    });

    revalidatePath('/admin/work');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[addProjectAction] Error creating project:', error);
    return { success: false, error: 'Failed to add project' };
  }
}

export async function updateProjectAction(
  id: string,
  projectData: {
    slug: string;
    titleEn: string;
    titleAr: string;
    catEn: string;
    catAr: string;
    year: string;
    images?: string[];
  }
) {
  try {
    await prisma.project.update({
      where: { id },
      data: {
        slug: projectData.slug,
        titleEn: projectData.titleEn,
        titleAr: projectData.titleAr,
        catEn: projectData.catEn,
        catAr: projectData.catAr,
        year: projectData.year,
        images: projectData.images || [],
      },
    });

    revalidatePath('/admin/work');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[updateProjectAction] Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/admin/work');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[deleteProjectAction] Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

// 4. Order Actions
export async function updateOrderStatusAction(id: string, status: PrismaOrderStatus) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[updateOrderStatusAction] Error updating order:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

// 5. Message Actions
export async function markMessageReadAction(id: string, read: boolean) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('[markMessageReadAction] Error marking message read:', error);
    return { success: false, error: 'Failed to mark message' };
  }
}

// 6. Supabase Storage Upload Action
export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[uploadImageAction] Missing Supabase config env vars');
      return { success: false, error: 'Storage is not configured on the server.' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Clean and unique filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const fileName = `${Date.now()}-${cleanName}`;

    // Upload to Supabase Storage via REST API
    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/products/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': file.type || 'image/jpeg',
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[uploadImageAction] Supabase upload failed:', errorText);
      return { success: false, error: 'Failed to upload image to storage.' };
    }

    // Public URL format: ${supabaseUrl}/storage/v1/object/public/${bucket}/${path}
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${fileName}`;
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('[uploadImageAction] Error:', error);
    return { success: false, error: `Internal server error: ${error?.message || error}` };
  }
}

// 7. Profile Updates
export async function updateAdminProfileAction(data: {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get('admin_session')?.value;
    if (!sessionEmail) {
      return { success: false, error: 'Unauthorized' };
    }

    // Find the admin
    const admin = await prisma.admin.findUnique({
      where: { email: sessionEmail },
    });

    if (!admin) {
      return { success: false, error: 'Admin not found' };
    }

    const updateData: any = {
      name: data.name,
    };

    // If changing password
    if (data.newPassword) {
      if (!data.currentPassword) {
        return { success: false, error: 'Current password is required to set a new password.' };
      }
      const isMatch = await bcrypt.compare(data.currentPassword, admin.passwordHash);
      if (!isMatch) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
    });

    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[updateAdminProfileAction] Error:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

export async function createAdminAction(data: {
  name: string;
  email: string;
  passwordPlain: string;
}) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get('admin_session')?.value;
    if (!sessionEmail) {
      return { success: false, error: 'Unauthorized' };
    }

    const requestingAdmin = await prisma.admin.findUnique({
      where: { email: sessionEmail },
    });
    if (!requestingAdmin) {
      return { success: false, error: 'Unauthorized' };
    }

    // Email validation
    const emailLower = data.email.toLowerCase().trim();
    if (!emailLower || !data.name.trim() || !data.passwordPlain) {
      return { success: false, error: 'All fields are required.' };
    }

    const existing = await prisma.admin.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return { success: false, error: 'An administrator with this email already exists.' };
    }

    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);
    await prisma.admin.create({
      data: {
        name: data.name.trim(),
        email: emailLower,
        passwordHash,
      },
    });

    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[createAdminAction] Error:', error);
    return { success: false, error: 'Failed to create new administrator.' };
  }
}

export async function deleteAdminAction(id: string) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get('admin_session')?.value;
    if (!sessionEmail) {
      return { success: false, error: 'Unauthorized' };
    }

    const requestingAdmin = await prisma.admin.findUnique({
      where: { email: sessionEmail },
    });
    if (!requestingAdmin) {
      return { success: false, error: 'Unauthorized' };
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id },
    });
    if (!targetAdmin) {
      return { success: false, error: 'Administrator not found.' };
    }

    if (targetAdmin.email === sessionEmail) {
      return { success: false, error: 'You cannot delete your own account.' };
    }

    // Ensure we don't delete the last admin
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return { success: false, error: 'Cannot delete the last administrator.' };
    }

    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[deleteAdminAction] Error:', error);
    return { success: false, error: 'Failed to delete administrator.' };
  }
}

// 8. Custom Requests Actions
export async function updateRequestStatusAction(id: string, status: PrismaRequestStatus) {
  try {
    await prisma.bespokeRequest.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error) {
    console.error('[updateRequestStatusAction] Error:', error);
    return { success: false, error: 'Failed to update request status' };
  }
}

export async function deleteRequestAction(id: string) {
  try {
    await prisma.bespokeRequest.delete({
      where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error) {
    console.error('[deleteRequestAction] Error:', error);
    return { success: false, error: 'Failed to delete request' };
  }
}
