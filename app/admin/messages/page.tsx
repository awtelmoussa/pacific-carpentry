import { prisma } from '@/lib/prisma';
import AdminMessagesClient from '@/components/admin/AdminMessagesClient';

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <AdminMessagesClient initialMessages={messages as any} />;
}
