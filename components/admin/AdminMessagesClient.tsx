'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markMessageReadAction } from '@/app/actions/adminActions';

interface DBMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

interface AdminMessagesClientProps {
  initialMessages: DBMessage[];
}

export default function AdminMessagesClient({ initialMessages }: AdminMessagesClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages.length > 0 ? initialMessages[0].id : null
  );

  const selectedMessage = initialMessages.find((m) => m.id === selectedId);

  const handleSelectMessage = async (msg: DBMessage) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      try {
        const res = await markMessageReadAction(msg.id, true);
        if (res.success) {
          router.refresh();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleReadStatus = async (msg: DBMessage) => {
    try {
      const res = await markMessageReadAction(msg.id, !msg.read);
      if (res.success) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div
      className="bg-white rounded-xl border border-[#EAE3D5] shadow-sm flex items-stretch h-[calc(100vh-170px)] min-h-[460px] overflow-hidden"
    >
      {/* Left Pane: Messages list */}
      <div className="w-[40%] md:w-[35%] shrink-0 border-r border-[#EAE3D5] flex flex-col justify-between">
        <div className="h-12 border-b border-[#EAE3D5] flex items-center px-4 shrink-0 bg-[#FBF9F5]">
          <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#8A7E6B]">
            Inbox ({initialMessages.length})
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#EAE3D5]/50">
          {initialMessages.map((msg) => {
            const isSelected = msg.id === selectedId;
            return (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 cursor-pointer transition-colors duration-150 relative text-start ${
                  isSelected
                    ? 'bg-[#C2965B]/10'
                    : msg.read
                    ? 'hover:bg-[#FBF9F5]/45'
                    : 'bg-[#FBF9F5] hover:bg-[#F7F4EE]'
                }`}
              >
                {/* Unread indicator dot */}
                {!msg.read && (
                  <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-[#C2965B]"></span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-[#F7F4EE] border border-[#EAE3D5] flex items-center justify-center font-bold text-xs text-[#5A5043] shrink-0 uppercase"
                  >
                    {getInitials(msg.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#241C13] truncate">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-[#A89B85] shrink-0 font-light">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      className={`text-xs block mt-0.5 truncate ${
                        !msg.read ? 'font-bold text-[#241C13]' : 'text-[#5A5043]'
                      }`}
                    >
                      {msg.subject}
                    </span>
                    <p className="text-[11px] text-[#8A7E6B] mt-1 leading-snug truncate font-light text-start">
                      {msg.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {initialMessages.length === 0 && (
            <div className="py-12 text-center text-faint text-xs">
              Your inbox is empty.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Reading details view */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#FBF9F5]/25">
        {selectedMessage ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header info */}
            <div>
              <div
                className="p-6 border-b border-[#EAE3D5] flex flex-col sm:flex-row justify-between sm:items-start gap-4 text-start bg-white"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-[#C2965B] text-bg flex items-center justify-center font-bold text-base uppercase shrink-0"
                  >
                    {getInitials(selectedMessage.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif font-semibold text-lg text-[#241C13] leading-snug">
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-xs text-[#5A5043] font-semibold mt-1">
                      From: {selectedMessage.name}{' '}
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#9A6E3A] hover:underline font-normal"
                      >
                        &lt;{selectedMessage.email}&gt;
                      </a>
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-xs text-[#8A7E6B] mt-0.5">
                        Phone: {selectedMessage.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-start sm:text-end shrink-0">
                  <span className="text-xs text-[#A89B85] block font-light">
                    {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className="text-xs font-bold text-[#9A6E3A] hover:underline uppercase mt-2 block cursor-pointer bg-transparent border-none outline-none"
                  >
                    Mark as {selectedMessage.read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>

              {/* Message body */}
              <div className="p-6 md:p-8 text-start max-w-[700px]">
                <p className="text-sm text-[#5A5043] leading-relaxed whitespace-pre-wrap font-light">
                  {selectedMessage.body}
                </p>
              </div>
            </div>

            {/* Quick reply actions mockup */}
            <div className="p-6 border-t border-[#EAE3D5] bg-white text-start">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="inline-block bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-3 rounded-lg transition-colors cursor-pointer"
              >
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-faint">
            <svg className="w-10 h-10 text-[#A89B85] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Select a contact form submission to read.</p>
          </div>
        )}
      </div>
    </div>
  );
}
