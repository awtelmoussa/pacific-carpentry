import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileForm from '@/components/admin/ProfileForm';

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('admin_session')?.value;

  if (!sessionEmail) {
    redirect('/admin');
  }

  const admin = await prisma.admin.findUnique({
    where: { email: sessionEmail },
  });

  if (!admin) {
    redirect('/admin');
  }

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="space-y-6">
      <ProfileForm
        admin={{ name: admin.name, email: admin.email }}
        admins={admins}
      />
    </div>
  );
}
