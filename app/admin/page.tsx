import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const requests = await prisma.bespokeRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unreadMessagesCount = await prisma.contactMessage.count({
    where: { read: false },
  });

  // Calculate dynamic KPIs from our database bespoke requests
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const inProductionCount = requests.filter((r) => r.status === 'IN_PRODUCTION').length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  // Get 5 most recent requests
  const recentRequests = requests.slice(0, 5);

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FBF0DA] text-[#B7791F]">Pending</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FEEBC8] text-[#C05621]">Under Review</span>;
      case 'QUOTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#E1ECF7] text-[#2B6CB0]">Quoted</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#E6FFFA] text-[#319795]">Approved</span>;
      case 'IN_PRODUCTION':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F3E8D6] text-[#9A6E3A]">In Production</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#E2F1E7] text-[#2F7D52]">Completed</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F7E4DE] text-[#C0573E]">Cancelled</span>;
    }
  };

  // Compute breakdown of requests by category dynamically
  const categoryMap: Record<string, number> = {};
  requests.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const defaultCategoryBreakdown = [
    { name: 'Dining Tables', count: 0 },
    { name: 'TV Cabinets & Sideboards', count: 0 },
    { name: 'Bespoke Pivot Doors', count: 0 },
  ];

  const displayCategoryBreakdown = categoryBreakdown.length > 0 ? categoryBreakdown : defaultCategoryBreakdown;

  const kpis = [
    {
      label: 'Bespoke Requests',
      value: totalRequests.toString(),
      delta: 'Total requests received',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6 text-[#9A6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Review',
      value: pendingCount.toString(),
      delta: `${pendingCount} request${pendingCount !== 1 ? 's' : ''} require action`,
      isPositive: pendingCount === 0,
      icon: (
        <svg className="w-6 h-6 text-[#C2965B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'In Production',
      value: inProductionCount.toString(),
      delta: 'Active workshop commissions',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6 text-[#9A6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: 'Completed Work',
      value: completedCount.toString(),
      delta: 'Heirlooms delivered',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6 text-[#9A6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-start">
      {/* 4 KPI Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#FBF9F5] rounded-lg shrink-0 border border-[#EAE3D5]/50">
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#8A7E6B] tracking-[0.04em] uppercase block">
                {kpi.label}
              </span>
              <span className="text-[30px] font-bold text-[#241C13] leading-tight mt-1 block">
                {kpi.value}
              </span>
              <span
                className={`text-xs mt-1.5 block leading-none ${
                  kpi.isPositive ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {kpi.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Split Dashboard Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Left Column: Recent Requests Table */}
        <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-serif font-semibold text-lg text-[#241C13]">
                Recent Bespoke Requests
              </h2>
              <Link
                href="/admin/requests"
                className="text-xs font-bold tracking-[0.04em] text-[#9A6E3A] hover:underline uppercase"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FBF9F5] border-y border-[#EAE3D5]">
                    <th className="text-[11px] font-bold tracking-[0.06em] text-[#8A7E6B] uppercase text-start py-3 px-6">
                      Ref No.
                    </th>
                    <th className="text-[11px] font-bold tracking-[0.06em] text-[#8A7E6B] uppercase text-start py-3 px-6">
                      Customer
                    </th>
                    <th className="text-[11px] font-bold tracking-[0.06em] text-[#8A7E6B] uppercase text-start py-3 px-6">
                      Category
                    </th>
                    <th className="text-[11px] font-bold tracking-[0.06em] text-[#8A7E6B] uppercase text-start py-3 px-6">
                      Timber
                    </th>
                    <th className="text-[11px] font-bold tracking-[0.06em] text-[#8A7E6B] uppercase text-start py-3 px-6">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D5]/60">
                  {recentRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-[#FBF9F5]/45 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6 text-start">
                        <Link href="/admin/requests" className="font-bold text-[#9A6E3A] group-hover:underline block">
                          {req.referenceNo}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-start">
                        <div className="text-xs font-semibold text-[#241C13]">
                          {req.fullName}
                        </div>
                        <div className="text-[11px] text-[#8A7E6B] truncate max-w-[150px]">
                          {req.email}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#241C13] font-medium text-start">
                        {req.category}
                      </td>
                      <td className="py-4 px-6 text-xs text-[#8A7E6B] text-start">
                        {req.timber}
                      </td>
                      <td className="py-4 px-6 text-start">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                  {recentRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-faint">
                        No bespoke requests recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          {/* Categories Card */}
          <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm text-start">
            <h2 className="font-serif font-semibold text-lg text-[#241C13] mb-5">
              Popular Request Categories
            </h2>
            <div className="space-y-4">
              {displayCategoryBreakdown.map((c, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#EAE3D5]/40 last:border-0">
                  <div className="text-start">
                    <div className="text-sm font-semibold text-[#241C13]">{c.name}</div>
                  </div>
                  <div className="text-sm font-bold text-[#9A6E3A]">{c.count} request{c.count !== 1 && 's'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Inbox Promotion Box */}
          <div className="bg-gradient-to-br from-[#181310] to-[#2E241E] rounded-xl border border-[#EAE3D5]/10 p-6 shadow-sm text-start flex flex-col justify-between h-full min-h-[170px] relative overflow-hidden text-[#EDE6D8]">
            <div
              style={{
                backgroundImage:
                  'repeating-linear-gradient(92deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 9px)',
              }}
              className="absolute inset-0 pointer-events-none opacity-20"
            ></div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C2965B] uppercase block">
                Messages
              </span>
              <h3 className="font-serif font-medium text-2xl text-white mt-1 leading-snug">
                Customer Inquiries
              </h3>
              <p className="text-[#9A8B73] text-xs mt-2 font-light leading-relaxed">
                You have {unreadMessagesCount} unread message{unreadMessagesCount !== 1 && 's'} in your workshop inbox.
              </p>
            </div>
            
            <div className="relative z-10 mt-6">
              <Link
                href="/admin/messages"
                className="inline-block bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-3 rounded-lg transition-colors duration-200"
              >
                Go to Inbox
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
