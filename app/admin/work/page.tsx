import { prisma } from '@/lib/prisma';
import AdminWorkClient from '@/components/admin/AdminWorkClient';

export default async function AdminWorkPage() {
  const projects = await prisma.project.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return <AdminWorkClient initialProjects={projects as any} />;
}
