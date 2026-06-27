import { prisma } from '@/lib/prisma';
import AdminShowroomClient from '@/components/admin/AdminShowroomClient';

export default async function AdminShowroomPage() {
  const showroomItems = await prisma.showroomItem.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <AdminShowroomClient initialShowroomItems={showroomItems as any} />;
}
