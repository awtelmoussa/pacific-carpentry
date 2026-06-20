'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutAdminAction } from '@/app/actions/adminActions';

interface TopbarProps {
  adminName?: string;
  adminEmail?: string;
}

export default function Topbar({ adminName, adminEmail }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await logoutAdminAction();
    router.refresh();
  };

  // Determine title, subtitle, back link, and action buttons based on route path
  let title = 'Dashboard';
  let subtitle = 'Overview of your workspace performance';
  let backLink: string | null = null;
  let actionButton: React.ReactNode | null = null;

  if (!pathname) {
    // Fallback defaults apply
  } else if (pathname === '/admin/requests') {
    title = 'Bespoke Requests';
    subtitle = 'Manage bespoke customer configuration commissions';
  } else if (pathname === '/admin/work') {
    title = 'Our Work';
    subtitle = 'Curate your project showcase portfolio';
  } else if (pathname === '/admin/messages') {
    title = 'Messages';
    subtitle = 'Contact form inquiries from the website';
  }

  return (
    <header
      className="h-[74px] border-b border-[#EAE3D5] bg-white flex items-center justify-between px-6 md:px-9 shrink-0 select-none z-20"
    >
      {/* Title & Back Button */}
      <div className="flex items-center gap-4.5 min-w-0">
        {backLink && (
          <Link
            href={backLink}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#EAE3D5] text-[#5A5043] hover:text-[#9A6E3A] hover:border-[#9A6E3A] transition-colors shrink-0"
            title="Go back"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <div className="text-left min-w-0">
          <h1 className="font-serif font-medium text-[20px] md:text-[22px] text-[#241C13] leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11.5px] text-[#8A7E6B] leading-none mt-1 truncate font-light">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side Actions (Action button + Mobile User Card) */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="shrink-0">{actionButton}</div>

        {/* User profile / Logout for Mobile */}
        {adminName && (
          <div className="flex lg:hidden items-center gap-3 border-l border-[#EAE3D5] pl-4">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 max-w-[140px] min-w-0 hover:opacity-80 transition-opacity text-decoration-none"
              title="Edit Profile"
            >
              <div className="w-8 h-8 rounded-full bg-[#9A6E3A] text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#241C13] truncate">
                {adminName}
              </span>
            </Link>
            <button
              onClick={logout}
              className="text-[#8A7E6B] hover:text-red-500 p-2 rounded-md hover:bg-[#F7F4EE] transition-colors cursor-pointer shrink-0"
              title="Sign out"
            >
              <svg
                className="w-4.5 h-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
