import { cookies } from 'next/headers';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import AdminLogin from '@/components/admin/AdminLogin';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('admin_session')?.value;

  let adminUser = null;
  if (sessionEmail) {
    adminUser = await prisma.admin.findUnique({
      where: { email: sessionEmail },
    });
  }

  if (!adminUser) {
    return (
      <div className="bg-[#F4F1EB] text-[#5A5043] font-body min-h-screen antialiased selection:bg-[#C2965B] selection:text-[#181310] w-full">
        <AdminLogin />
      </div>
    );
  }

  const unreadMessagesCount = await prisma.contactMessage.count({
    where: { read: false },
  });

  const pendingRequestsCount = await prisma.bespokeRequest.count({
    where: { status: 'PENDING' },
  });

  return (
    <div className="bg-[#F4F1EB] text-[#5A5043] font-body min-h-screen antialiased selection:bg-[#C2965B] selection:text-[#181310] overflow-hidden w-full flex">
      <div className="flex min-h-screen overflow-hidden w-full">
        {/* Sidebar Navigation */}
        <Sidebar
          unreadMessagesCount={unreadMessagesCount}
          pendingRequestsCount={pendingRequestsCount}
          adminName={adminUser.name}
          adminEmail={adminUser.email}
        />

        {/* Main Panel View */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar adminName={adminUser.name} adminEmail={adminUser.email} />
          <main className="flex-grow overflow-y-auto p-6 md:p-9">
            <div className="max-w-[1200px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
