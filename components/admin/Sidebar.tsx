'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutAdminAction } from '@/app/actions/adminActions';

interface SidebarProps {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  adminName: string;
  adminEmail: string;
}

export default function Sidebar({
  unreadMessagesCount,
  pendingRequestsCount,
  adminName,
  adminEmail,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await logoutAdminAction();
    router.refresh();
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 01-2-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Bespoke Requests',
      href: '/admin/requests',
      count: pendingRequestsCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },

    {
      label: 'Our Work',
      href: '/admin/work',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: '3D Showroom',
      href: '/admin/showroom',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      href: '/admin/messages',
      count: unreadMessagesCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="w-[72px] lg:w-[248px] bg-[#181310] flex flex-col justify-between shrink-0 border-r border-[#EAE3D5]/10 select-none transition-all duration-200 z-30 h-screen"
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        {/* Logo Section */}
        <div className="h-[74px] border-b border-[#EAE3D5]/10 flex items-center px-4.5 lg:px-6 gap-3 shrink-0">
          <img
            src="/logo.jpg"
            alt="Pacific Carpentry Logo"
            className="w-[34px] h-[34px] object-contain rounded-[2px] border border-[#C2965B]/25 shrink-0"
          />
          <span className="hidden lg:flex flex-col leading-none text-left">
            <span className="text-[#EDE6D8] font-semibold text-[14px] tracking-[0.16em]">
              PACIFIC
            </span>
            <span className="text-[#9A8B73] font-medium text-[9px] tracking-[0.42em] mt-[3px]">
              CARPENTRY
            </span>
          </span>
        </div>

        {/* Menu Links */}
        <nav className="p-3 lg:p-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150 ${
                  active
                    ? 'bg-[#C2965B]/16 text-[#EDE6D8] font-semibold'
                    : 'text-[#9A8B73] hover:text-[#EDE6D8]'
                }`}
                title={item.label}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="hidden lg:inline text-[13.5px] tracking-[0.02em]">
                  {item.label}
                </span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                      active ? 'bg-[#C2965B] text-bg' : 'bg-[#C2965B]/30 text-[#EDE6D8]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User / Sign-out Section */}
      <div className="p-3 lg:p-4 border-t border-[#EAE3D5]/10 shrink-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity cursor-pointer text-decoration-none"
            title="Edit Profile"
          >
            {/* Monogram Avatar */}
            <div
              className="w-9 h-9 rounded-full bg-[#C2965B] text-bg flex items-center justify-center font-bold text-sm shrink-0 uppercase animate-pulse-once"
            >
              {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:flex flex-col min-w-0 text-left leading-normal">
              <span className="text-[#EDE6D8] font-semibold text-xs truncate">
                {adminName || 'Admin'}
              </span>
              <span className="text-[#9A8B73] text-[10px] truncate">
                {adminEmail || 'admin@pacific.ae'}
              </span>
            </div>
          </Link>

          <button
            onClick={logout}
            className="text-[#9A8B73] hover:text-red-400 p-1.5 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Sign out"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
