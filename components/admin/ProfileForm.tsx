'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateAdminProfileAction,
  createAdminAction,
  deleteAdminAction,
} from '@/app/actions/adminActions';

interface ProfileFormProps {
  admin: {
    name: string;
    email: string;
  };
  admins: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }>;
}

export default function ProfileForm({ admin, admins }: ProfileFormProps) {
  const router = useRouter();

  // Profile Form state
  const [name, setName] = useState(admin.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // General States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Manage Admins state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState('');
  const [adminActionError, setAdminActionError] = useState('');
  const [adminActionSuccess, setAdminActionSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validations
    if (!name.trim()) {
      setError('Name is required.');
      setIsLoading(false);
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password.');
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await updateAdminProfileAction({
        name,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword ? newPassword : undefined,
      });

      if (res.success) {
        setSuccess('Profile updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
      } else {
        setError(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError('');
    setAdminActionSuccess('');

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword || !newAdminConfirmPassword) {
      setAdminActionError('All fields are required.');
      return;
    }

    if (newAdminPassword.length < 6) {
      setAdminActionError('Password must be at least 6 characters.');
      return;
    }

    if (newAdminPassword !== newAdminConfirmPassword) {
      setAdminActionError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await createAdminAction({
        name: newAdminName,
        email: newAdminEmail,
        passwordPlain: newAdminPassword,
      });

      if (res.success) {
        setAdminActionSuccess(`Administrator "${newAdminName}" created successfully.`);
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        setNewAdminConfirmPassword('');
        setShowAddForm(false);
        router.refresh();
      } else {
        setAdminActionError(res.error || 'Failed to create administrator.');
      }
    } catch (err) {
      console.error(err);
      setAdminActionError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from administrators?`)) {
      return;
    }
    setAdminActionError('');
    setAdminActionSuccess('');
    setIsLoading(true);

    try {
      const res = await deleteAdminAction(id);
      if (res.success) {
        setAdminActionSuccess(`Administrator "${name}" removed successfully.`);
        router.refresh();
      } else {
        setAdminActionError(res.error || 'Failed to delete administrator.');
      }
    } catch (err) {
      console.error(err);
      setAdminActionError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-[11.5px] font-bold tracking-[0.06em] uppercase text-[#8A7E6B] text-start mb-2 block";
  const inputClass = "w-full bg-[#F7F4EE] border border-[#EAE3D5] text-[#241C13] text-sm p-3.5 rounded-lg outline-none focus:border-[#9A6E3A] transition-colors text-start disabled:opacity-50";

  return (
    <div className="max-w-[620px] mx-auto space-y-8 text-start pb-12">
      {/* Save Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="bg-[#F7E4DE] border border-[#C0573E]/30 text-[#C0573E] text-xs rounded-lg p-4 leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#E2F1E7] border border-[#2F7D52]/30 text-[#2F7D52] text-xs rounded-lg p-4 leading-relaxed">
            {success}
          </div>
        )}

        {/* 1. Account Details */}
        <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm space-y-5">
          <h2 className="font-serif font-semibold text-lg text-[#241C13] border-b border-[#EAE3D5] pb-3">
            Account Profile
          </h2>

          <div>
            <label className={labelClass}>Email Address (Read-only)</label>
            <input
              disabled
              type="email"
              className={`${inputClass} opacity-60 bg-[#F5F2EC]`}
              value={admin.email}
            />
          </div>

          <div>
            <label className={labelClass}>Full Name</label>
            <input
              required
              disabled={isLoading}
              type="text"
              className={inputClass}
              placeholder="e.g. Awtel Moussa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Security / Change Password */}
        <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm space-y-5">
          <h2 className="font-serif font-semibold text-lg text-[#241C13] border-b border-[#EAE3D5] pb-3">
            Change Password
          </h2>
          <p className="text-xs text-[#8A7E6B] leading-relaxed font-light">
            Leave password fields blank if you do not wish to update your login credentials.
          </p>

          <div>
            <label className={labelClass}>Current Password</label>
            <input
              disabled={isLoading}
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input
                disabled={isLoading}
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                disabled={isLoading}
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-grow bg-[#9A6E3A] hover:bg-[#85602F] text-white text-[13px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-lg cursor-pointer transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => router.push('/admin')}
            className="flex-grow bg-transparent border border-[#EAE3D5] text-[#5A5043] hover:bg-[#F7F4EE] text-[13px] font-bold tracking-[0.08em] uppercase py-3.5 rounded-lg cursor-pointer transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Manage Administrators Section */}
      <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm space-y-6">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[#241C13] border-b border-[#EAE3D5] pb-3">
            Manage Administrators
          </h2>
          <p className="text-xs text-[#8A7E6B] leading-relaxed font-light mt-2">
            View, add, or revoke administrator accounts who have access to this workshop panel.
          </p>
        </div>

        {adminActionError && (
          <div className="bg-[#F7E4DE] border border-[#C0573E]/30 text-[#C0573E] text-xs rounded-lg p-4 leading-relaxed">
            {adminActionError}
          </div>
        )}

        {adminActionSuccess && (
          <div className="bg-[#E2F1E7] border border-[#2F7D52]/30 text-[#2F7D52] text-xs rounded-lg p-4 leading-relaxed">
            {adminActionSuccess}
          </div>
        )}

        {/* List of current administrators */}
        <div className="space-y-3">
          {admins.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center p-3.5 bg-[#FBF9F5] border border-[#EAE3D5] rounded-lg transition-colors hover:bg-[#F7F4EE]/50"
            >
              <div>
                <div className="text-sm font-semibold text-[#241C13] flex items-center gap-2">
                  {u.name}
                  {u.email === admin.email && (
                    <span className="text-[9px] font-bold tracking-[0.08em] uppercase bg-[#EAE3D5] px-1.5 py-0.5 rounded text-[#5A5043]">
                      You
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#8A7E6B] mt-0.5">{u.email}</div>
              </div>
              {u.email !== admin.email && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDeleteAdmin(u.id, u.name)}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
                >
                  Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add administrator form / button */}
        {showAddForm ? (
          <form
            onSubmit={handleCreateAdmin}
            className="space-y-4 border border-[#EAE3D5] p-5 rounded-lg bg-[#FBF9F5]/40 mt-4"
          >
            <h3 className="text-xs font-bold text-[#241C13] uppercase tracking-wider mb-2">
              New Administrator Credentials
            </h3>
            
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                required
                disabled={isLoading}
                type="text"
                className={inputClass}
                placeholder="e.g. John Doe"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                required
                disabled={isLoading}
                type="email"
                className={inputClass}
                placeholder="e.g. colleague@pacific.ae"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  required
                  disabled={isLoading}
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  required
                  disabled={isLoading}
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={newAdminConfirmPassword}
                  onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setShowAddForm(false);
                  setAdminActionError('');
                }}
                className="bg-transparent border border-[#EAE3D5] text-[#5A5043] hover:bg-[#F7F4EE] text-xs font-bold tracking-[0.06em] uppercase px-5 py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setAdminActionError('');
              setAdminActionSuccess('');
            }}
            className="w-full bg-[#FBF9F5] border border-dashed border-[#C2965B]/60 hover:border-[#9A6E3A] hover:bg-[#F7F4EE] text-[#9A6E3A] hover:text-[#85602F] text-xs font-bold tracking-[0.06em] uppercase py-3 rounded-lg transition-colors"
          >
            + Add Administrator
          </button>
        )}
      </div>
    </div>
  );
}
