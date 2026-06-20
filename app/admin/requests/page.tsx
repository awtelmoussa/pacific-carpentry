import { prisma } from '@/lib/prisma';
import AdminRequestsClient from '@/components/admin/AdminRequestsClient';

export default async function AdminRequestsPage() {
  const requests = await prisma.bespokeRequest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <AdminRequestsClient initialRequests={requests} />;
}
