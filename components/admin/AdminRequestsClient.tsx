'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RequestStatus, OrderStatus } from '@prisma/client';
import {
  updateRequestStatusAction,
  deleteRequestAction,
  quoteBespokeRequestAction,
  updateBespokeRequestPaymentStatusAction
} from '@/app/actions/adminActions';

interface DBRequest {
  id: string;
  referenceNo: string;
  status: RequestStatus;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  timber: string;
  dimensions: string;
  notes: string | null;
  images: string[];
  quotePrice: number | null;
  ziinaPaymentUrl: string | null;
  paymentStatus: OrderStatus;
  createdAt: Date;
}

interface AdminRequestsClientProps {
  initialRequests: DBRequest[];
}

export default function AdminRequestsClient({ initialRequests }: AdminRequestsClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests.length > 0 ? initialRequests[0].id : null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const selectedRequest = initialRequests.find((r) => r.id === selectedId);

  const [priceInput, setPriceInput] = useState<string>(
    selectedRequest?.quotePrice ? selectedRequest.quotePrice.toString() : ''
  );
  const [ziinaInput, setZiinaInput] = useState<string>(
    selectedRequest?.ziinaPaymentUrl || ''
  );

  const handleSelectRequest = (id: string) => {
    setSelectedId(id);
    setActiveImage(null);
    const req = initialRequests.find((r) => r.id === id);
    if (req) {
      setPriceInput(req.quotePrice ? req.quotePrice.toString() : '');
      setZiinaInput(req.ziinaPaymentUrl || '');
    }
  };

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    setIsUpdating(true);
    try {
      const res = await updateRequestStatusAction(id, status);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update request status.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this commission request?')) {
      return;
    }
    setIsUpdating(true);
    try {
      const res = await deleteRequestAction(id);
      if (res.success) {
        // Clear selection or select the next one
        const remaining = initialRequests.filter((r) => r.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete request.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriceChange = (val: string) => {
    setPriceInput(val);
    const ziinaUser = process.env.NEXT_PUBLIC_ZIINA_USERNAME || 'pacificcarpentry';
    if (val && !isNaN(Number(val))) {
      setZiinaInput(`https://pay.ziina.com/${ziinaUser}/${val}`);
    } else {
      setZiinaInput('');
    }
  };

  const handleSaveQuote = async () => {
    if (!selectedId) return;
    const priceNum = Number(priceInput);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid quote price.');
      return;
    }
    if (!ziinaInput) {
      alert('Please enter a valid Ziina payment URL.');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await quoteBespokeRequestAction(selectedId, priceNum, ziinaInput);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to save quote details.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (id: string, paymentStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await updateBespokeRequestPaymentStatusAction(id, paymentStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update payment status.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'QUOTED':
        return 'Quoted';
      case 'APPROVED':
        return 'Approved';
      case 'IN_PRODUCTION':
        return 'In Production';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusBadgeStyle = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200/50';
      case 'UNDER_REVIEW':
        return 'bg-blue-50 text-blue-800 border-blue-200/50';
      case 'QUOTED':
        return 'bg-purple-50 text-purple-800 border-purple-200/50';
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/50';
      case 'IN_PRODUCTION':
        return 'bg-orange-50 text-orange-800 border-orange-200/50';
      case 'COMPLETED':
        return 'bg-[#F1ECE4] text-[#5A5043] border-[#E5DEC9]';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 border-red-200/50';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-[#EAE3D5] shadow-sm flex items-stretch h-[calc(100vh-170px)] min-h-[500px] overflow-hidden"
    >
      {/* Left Pane: Requests list */}
      <div className="w-[42%] md:w-[35%] shrink-0 border-r border-[#EAE3D5] flex flex-col justify-between">
        <div className="h-12 border-b border-[#EAE3D5] flex items-center px-4 shrink-0 bg-[#FBF9F5] justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#8A7E6B]">
            Commissions ({initialRequests.length})
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#EAE3D5]/50">
          {initialRequests.map((req) => {
            const isSelected = req.id === selectedId;
            return (
              <div
                key={req.id}
                onClick={() => handleSelectRequest(req.id)}
                className={`p-4 cursor-pointer transition-colors duration-150 relative text-start ${
                  isSelected
                    ? 'bg-[#C2965B]/10'
                    : 'hover:bg-[#FBF9F5]/45'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-[#F7F4EE] border border-[#EAE3D5] flex items-center justify-center font-bold text-xs text-[#5A5043] shrink-0 uppercase"
                  >
                    {getInitials(req.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#241C13] truncate">
                        {req.fullName}
                      </span>
                      <span className="text-[10px] text-[#A89B85] shrink-0 font-light">
                        {new Date(req.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-serif font-semibold text-[#9A6E3A]">
                        {req.referenceNo}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeStyle(req.status)}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8A7E6B] mt-1.5 font-light truncate">
                      {req.category} · {req.timber}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {initialRequests.length === 0 && (
            <div className="py-12 text-center text-[#8A7E6B] text-xs font-light">
              No bespoke commission requests found.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Reading details view */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#FBF9F5]/25">
        {selectedRequest ? (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Header info */}
              <div
                className="p-6 border-b border-[#EAE3D5] flex flex-col sm:flex-row justify-between sm:items-start gap-4 text-start bg-white"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-[#C2965B] text-bg flex items-center justify-center font-bold text-base uppercase shrink-0"
                  >
                    {getInitials(selectedRequest.fullName)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-serif font-semibold text-lg text-[#241C13] leading-none">
                        {selectedRequest.fullName}
                      </h2>
                      <span className="font-mono font-bold text-xs text-[#9A6E3A] tracking-wider bg-[#C2965B]/10 px-2 py-0.5 rounded">
                        {selectedRequest.referenceNo}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5043] font-semibold mt-2.5">
                      Email:{' '}
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="text-[#9A6E3A] hover:underline font-normal"
                      >
                        {selectedRequest.email}
                      </a>
                    </p>
                    <p className="text-xs text-[#5A5043] font-semibold mt-1">
                      Phone:{' '}
                      <a
                        href={`tel:${selectedRequest.phone}`}
                        className="text-[#5A5043] hover:underline font-normal"
                      >
                        {selectedRequest.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="text-start sm:text-end shrink-0 space-y-2">
                  <span className="text-xs text-[#A89B85] block font-light">
                    Submitted:{' '}
                    {new Date(selectedRequest.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  
                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Status:</span>
                    <select
                      disabled={isUpdating}
                      value={selectedRequest.status}
                      onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value as RequestStatus)}
                      className="bg-white border border-[#EAE3D5] text-[#241C13] text-xs font-semibold px-2.5 py-1 rounded outline-none cursor-pointer focus:border-[#C2965B] transition-colors"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="APPROVED">Approved</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Commission Specifications Section */}
              <div className="p-6 md:p-8 space-y-6 text-start max-w-[840px]">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A7E6B] border-b border-[#EAE3D5] pb-2 mb-3">
                    Bespoke Design Specifications
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-[#EAE3D5] p-4.5 rounded-lg">
                    <div>
                      <span className="block text-[10px] text-[#A89B85] uppercase tracking-wider">Canvas / Category</span>
                      <span className="text-sm font-semibold text-[#241C13] mt-0.5 block">{selectedRequest.category}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#A89B85] uppercase tracking-wider">Timber Selection</span>
                      <span className="text-sm font-semibold text-[#241C13] mt-0.5 block">{selectedRequest.timber}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#A89B85] uppercase tracking-wider">Sizing / Dimensions</span>
                      <span className="text-sm font-semibold font-mono text-[#241C13] mt-0.5 block">{selectedRequest.dimensions}</span>
                    </div>
                  </div>
                </div>

                {/* Design notes */}
                {selectedRequest.notes && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A7E6B] border-b border-[#EAE3D5] pb-2 mb-3">
                      Design Notes & Instructions
                    </h3>
                    <p className="text-sm text-[#5A5043] leading-relaxed bg-white border border-[#EAE3D5] p-5 rounded-lg whitespace-pre-wrap font-light">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}

                {/* Inspiration Images */}
                {selectedRequest.images && selectedRequest.images.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A7E6B] border-b border-[#EAE3D5] pb-2 mb-3">
                      Design Inspiration Photos ({selectedRequest.images.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {selectedRequest.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveImage(imgUrl)}
                          className="aspect-square border border-[#EAE3D5] bg-white rounded overflow-hidden cursor-zoom-in hover:border-[#C2965B] hover:opacity-95 transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`Inspiration ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quoting & Payment Section */}
                <div className="bg-[#FBF9F5] border border-[#EAE3D5] p-6 rounded-lg space-y-5 mt-6">
                  <div className="border-b border-[#EAE3D5] pb-2 text-start">
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A7E6B] flex items-center gap-1.5">
                      <span>Quoting & Payments (Ziina)</span>
                      {selectedRequest.paymentStatus === 'PAID' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          PAID
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-start">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Quote Price (AED)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5400"
                        value={priceInput}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full bg-white border border-[#EAE3D5] text-[#241C13] text-sm p-3 rounded outline-none focus:border-[#C2965B] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5 text-start">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Ziina Pay Link</label>
                      <input
                        type="text"
                        placeholder="https://pay.ziina.com/username/amount"
                        value={ziinaInput}
                        onChange={(e) => setZiinaInput(e.target.value)}
                        className="w-full bg-white border border-[#EAE3D5] text-[#241C13] text-sm p-3 rounded outline-none focus:border-[#C2965B] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE3D5]/50">
                    <button
                      onClick={handleSaveQuote}
                      disabled={isUpdating}
                      className="bg-[#C2965B] hover:bg-[#A87E47] text-white text-xs font-bold uppercase py-3 px-5 rounded transition-colors cursor-pointer border-none"
                    >
                      Save Quote Details
                    </button>
                    
                    <div className="flex items-center gap-2 border border-[#EAE3D5] bg-white px-3 py-1.5 rounded">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Payment:</span>
                      <select
                        disabled={isUpdating}
                        value={selectedRequest.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(selectedRequest.id, e.target.value as any)}
                        className="bg-transparent border-none text-[#241C13] text-xs font-semibold outline-none cursor-pointer focus:border-[#C2965B] transition-colors"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="p-6 border-t border-[#EAE3D5] bg-white flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${selectedRequest.email}?subject=Regarding your Bespoke Commission Request ${
                    selectedRequest.referenceNo
                  }&body=${encodeURIComponent(
                    `Hi ${selectedRequest.fullName},\n\nWe have priced your bespoke commission request (${selectedRequest.referenceNo}).\n\nQuoted Price: ${selectedRequest.quotePrice || priceInput || '0'} AED\n\nYou can review your design specifications and pay securely with Card or Apple Pay using this link:\n${origin}/requests/${selectedRequest.referenceNo}\n\nBest regards,\nPacific Carpentry`
                  )}`}
                  className="bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-3.5 rounded-lg transition-colors cursor-pointer"
                >
                  Send Quote Email
                </a>
                
                <a
                  href={`https://wa.me/${selectedRequest.phone.replace(/[\s+-]+/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedRequest.fullName}, this is Pacific Carpentry regarding your request ${selectedRequest.referenceNo}. The quoted price is ${selectedRequest.quotePrice || priceInput || '0'} AED. You can review your design and pay with Card / Apple Pay here: ${origin}/requests/${selectedRequest.referenceNo}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  Share Quote via WhatsApp
                </a>
              </div>

              <button
                disabled={isUpdating}
                onClick={() => handleDelete(selectedRequest.id)}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline uppercase cursor-pointer"
              >
                Delete Request
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-faint">
            <svg className="w-10 h-10 text-[#A89B85] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs">Select a commission request to manage details.</p>
          </div>
        )}
      </div>

      {/* Full screen lightbox for images */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 cursor-zoom-out animate-pc-fade"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden">
            <img
              src={activeImage}
              alt="Design Inspiration Lightbox"
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 bg-black/55 text-white hover:text-[#C2965B] p-2 rounded-full cursor-pointer text-sm font-bold border-none"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
