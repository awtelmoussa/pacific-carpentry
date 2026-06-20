'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/app/actions/adminActions';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await loginAdminAction(email, password);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] font-body flex items-stretch text-[#5A5043]">
      {/* Left Column: Brand Panel (hidden below 760px) */}
      <div
        className="hidden md:flex md:w-[45%] bg-[#181310] relative flex-col justify-between p-12 overflow-hidden border-r border-[#EAE3D5]/10 select-none text-start"
      >
        {/* Radial wood tone fallback gradient */}
        <div
          className="absolute inset-0 z-0 bg-[radial-gradient(120%_100%_at_30%_20%,#3A2A1B,#181310_82%)] opacity-85"
        ></div>
        
        {/* Subtle wood grain line pattern */}
        <div
          style={{
            backgroundImage:
              'repeating-linear-gradient(92deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 9px)',
          }}
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
        ></div>

        <div className="relative z-10 flex items-center gap-3">
          <span className="flex items-center justify-center w-[36px] h-[36px] border border-[#C2965B]/60 text-[#C2965B] font-serif font-bold text-lg tracking-[0.02em]">
            PC
          </span>
          <span className="flex flex-col leading-none text-left">
            <span className="text-[#EDE6D8] font-semibold text-[15px] tracking-[0.16em]">
              PACIFIC
            </span>
            <span className="text-[#9A8B73] font-medium text-[9.5px] tracking-[0.42em] mt-[3.5px]">
              CARPENTRY
            </span>
          </span>
        </div>

        <div className="relative z-10 max-w-[340px] text-start">
          <h2 className="font-serif font-medium text-4xl sm:text-[42px] text-[#EDE6D8] leading-tight mb-4 whitespace-pre-line">
            Furniture worth{"\n"}passing down.
          </h2>
          <p className="text-[#9A8B73] text-[13.5px] leading-relaxed font-light">
             dubai-based maker of heirloom timber furniture and architectural woodwork since 2006.
          </p>
        </div>

        <span className="relative z-10 text-[11px] text-[#9A8B73]/65 font-light">
          © {new Date().getFullYear()} Pacific Carpentry. All rights reserved.
        </span>
      </div>

      {/* Right Column: Form Panel */}
      <div className="flex-grow flex items-center justify-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-[420px] bg-white rounded-xl border border-[#EAE3D5] p-8 md:p-10 shadow-sm text-start">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#C2965B] uppercase block mb-1">
            Admin Panel
          </span>
          <h1 className="font-serif font-medium text-3xl text-[#241C13] leading-none mb-2">
            Welcome back
          </h1>
          <p className="text-[#8A7E6B] text-[13.5px] mb-8 font-light">
            Sign in to manage storefront catalog and orders.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-[#F7E4DE] border border-[#C0573E]/30 text-[#C0573E] text-xs rounded-md p-3.5 leading-relaxed"
              >
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold tracking-[0.06em] uppercase text-[#5A5043] block mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                className="w-full bg-[#F7F4EE] border border-[#EAE3D5] text-[#241C13] text-[14px] p-3.5 rounded-lg outline-none focus:border-[#9A6E3A] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold tracking-[0.06em] uppercase text-[#5A5043]">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact the system administrator to reset your password.');
                  }}
                  className="text-xs font-semibold text-[#9A6E3A] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                required
                type="password"
                className="w-full bg-[#F7F4EE] border border-[#EAE3D5] text-[#241C13] text-[14px] p-3.5 rounded-lg outline-none focus:border-[#9A6E3A] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="w-4.5 h-4.5 text-[#9A6E3A] bg-[#F7F4EE] border-[#EAE3D5] rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                htmlFor="remember_me"
                className="ml-2.5 text-xs text-[#8A7E6B] cursor-pointer select-none"
              >
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9A6E3A] hover:bg-[#85602F] text-white text-[13px] font-bold tracking-[0.08em] uppercase py-4 rounded-lg cursor-pointer transition-colors duration-200 mt-2 hover:shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-[#A89B85] text-center mt-7">
            Authorized staff only. IP addresses are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
