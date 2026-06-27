'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  addShowroomItemAction, 
  updateShowroomItemAction, 
  deleteShowroomItemAction, 
  uploadGlbAction 
} from '@/app/actions/adminActions';

interface ShowroomItem {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  modelUrl: string;
  createdAt: string | Date;
}

interface AdminShowroomClientProps {
  initialShowroomItems: ShowroomItem[];
}

export default function AdminShowroomClient({ initialShowroomItems }: AdminShowroomClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields State
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  
  const [error, setError] = useState('');

  const handleOpenNew = () => {
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setModelUrl('');
    setEditingId(null);
    setError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ShowroomItem) => {
    setNameEn(item.nameEn);
    setNameAr(item.nameAr);
    setDescEn(item.descEn);
    setDescAr(item.descAr);
    setModelUrl(item.modelUrl);
    setEditingId(item.id);
    setError('');
    setIsFormOpen(true);
  };

  const handleGlbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please upload a 3D model file ending in .glb');
      return;
    }

    // Gating at 50MB (gltf binaries can be large, but we encourage optimization)
    if (file.size > 52428800) {
      alert('GLB model size is too large. Please select a model under 50MB.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadGlbAction(formData);
      if (res.success && res.url) {
        setModelUrl(res.url);
      } else {
        setError(res.error || 'Failed to upload GLB file.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during model upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameAr.trim()) {
      setError('Please provide names in both languages.');
      return;
    }
    if (!modelUrl.trim()) {
      setError('Please upload a 3D GLB model file.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      descEn: descEn.trim(),
      descAr: descAr.trim(),
      modelUrl: modelUrl.trim(),
    };

    try {
      let res;
      if (editingId) {
        res = await updateShowroomItemAction(editingId, payload);
      } else {
        res = await addShowroomItemAction(payload);
      }

      if (res.success) {
        setIsFormOpen(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to save showroom item.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this showroom 3D model? It will remove it from the visualizer.')) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await deleteShowroomItemAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete showroom item.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred while deleting.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-[11px] font-bold tracking-[0.06em] uppercase text-[#8A7E6B] text-start mb-1.5 block";
  const inputClass = "w-full bg-[#F7F4EE] border border-[#EAE3D5] text-[#241C13] text-sm p-3 rounded-lg outline-none focus:border-[#9A6E3A] transition-colors text-start disabled:opacity-50";

  return (
    <div className="space-y-6 text-start">
      
      {/* Topbar contextual add action */}
      {!isFormOpen && (
        <div className="flex justify-end">
          <button
            onClick={handleOpenNew}
            disabled={isLoading}
            className="bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.06em] uppercase px-5 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            + Add 3D Model
          </button>
        </div>
      )}

      {isFormOpen ? (
        /* SHOWROOM ITEM FORM CARD */
        <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm max-w-[620px] mx-auto">
          <h2 className="font-serif font-semibold text-lg text-[#241C13] border-b border-[#EAE3D5] pb-3 mb-5">
            {editingId ? 'Edit 3D Model Details' : 'Add New 3D Studio Model'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-[#F7E4DE] border border-[#C0573E]/30 text-[#C0573E] text-xs rounded-lg p-3.5 leading-relaxed">
                {error}
              </div>
            )}

            {/* Bilingual Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Model Name (English)</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Oakline Dining Table"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Model Name (Arabic)</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  dir="rtl"
                  className={`${inputClass} text-right`}
                  placeholder="مثال: طاولة طعام أوكلاين"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </div>
            </div>

            {/* Bilingual Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Description (English)</label>
                <textarea
                  disabled={isLoading}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="e.g. Kiln-dried solid oak table featuring traditional joinery..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Description (Arabic)</label>
                <textarea
                  disabled={isLoading}
                  rows={3}
                  dir="rtl"
                  className={`${inputClass} text-right resize-none`}
                  placeholder="مثال: طاولة خشب بلوط صلب مجفف بالفرن تتميز بوصلات تعشيق..."
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                />
              </div>
            </div>

            {/* GLB File Upload */}
            <div>
              <label className={labelClass}>3D Model Binary (.glb)</label>
              {modelUrl ? (
                <div className="bg-[#FBF9F5] border border-[#EAE3D5] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3 text-start min-w-0">
                    <svg className="w-8 h-8 text-[#9A6E3A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#241C13] block truncate">Model Uploaded Successfully</span>
                      <a 
                        href={modelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] text-[#9A6E3A] hover:underline font-mono truncate block"
                      >
                        {modelUrl.substring(modelUrl.lastIndexOf('/') + 1)}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setModelUrl('')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 border border-red-100"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-[#EAE3D5] bg-[#F7F4EE] rounded-lg p-8 text-center select-none cursor-pointer hover:bg-[#FBF9F5] block">
                  <input
                    disabled={isLoading}
                    type="file"
                    accept=".glb"
                    className="hidden"
                    onChange={handleGlbUpload}
                  />
                  <svg className="w-8 h-8 text-[#A89B85] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs font-bold text-[#5A5043] tracking-[0.02em] block">
                    {isLoading ? 'Uploading Model...' : 'Upload GLB File'}
                  </span>
                  <span className="text-[10px] text-[#A89B85] mt-1 block">Only standard binary glTF (.glb) files supported (Max 50MB)</span>
                </label>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-3 border-t border-[#EAE3D5]/60 mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-grow bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.08em] uppercase py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editingId ? 'Save Changes' : 'Create 3D Model'}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setIsFormOpen(false)}
                className="flex-grow bg-transparent border border-[#EAE3D5] text-[#5A5043] hover:bg-[#F7F4EE] text-xs font-bold tracking-[0.08em] uppercase py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* SHOWROOM GRID LIST */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {initialShowroomItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#EAE3D5] overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Graphic Header / Placeholder representing 3D studio item */}
              <div
                style={{
                  background: 'radial-gradient(120% 100% at 35% 25%, #3A2A1B, #16110C 84%)'
                }}
                className="aspect-[4/3] w-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C2965B_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                
                <svg className="w-12 h-12 text-[#C2965B] animate-pulse relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                
                <span className="text-[9px] font-mono text-[#A89B85] tracking-[0.2em] uppercase mt-3 relative z-10">
                  3D CONFIGURABLE FILE
                </span>
              </div>

              {/* Info details */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="space-y-2 text-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A7E6B] uppercase tracking-[0.02em]">English Name</span>
                    <h3 className="font-serif font-semibold text-base text-[#241C13] truncate mt-0.5">{item.nameEn}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8A7E6B] uppercase tracking-[0.02em]">Arabic Name</span>
                    <span className="text-sm font-semibold text-[#241C13] truncate block text-right mt-0.5" dir="rtl">{item.nameAr}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#EAE3D5]/40">
                    <span className="text-[10px] font-bold text-[#8A7E6B] uppercase tracking-[0.02em]">Model Link</span>
                    <a 
                      href={item.modelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] text-[#9A6E3A] hover:underline font-mono truncate block mt-0.5"
                    >
                      Download .glb
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 border-t border-[#EAE3D5]/40 pt-3">
                  <button
                    disabled={isLoading}
                    onClick={() => handleOpenEdit(item)}
                    className="flex-grow bg-[#F7F4EE] hover:bg-[#EAE3D5] text-[#5A5043] text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors border border-[#EAE3D5] disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => handleDelete(item.id)}
                    className="flex-grow bg-transparent hover:bg-red-50 text-red-500 hover:text-red-700 text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors border border-red-100 hover:border-red-200 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Quick empty creation tile */}
          <div
            onClick={handleOpenNew}
            className="border-2 border-dashed border-[#EAE3D5] hover:border-[#9A6E3A] bg-[#F7F4EE]/40 hover:bg-[#FBF9F5] rounded-xl flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all duration-200 min-h-[300px]"
          >
            <span className="text-2xl text-[#8A7E6B] mb-2">+</span>
            <span className="text-xs font-bold text-[#5A5043] tracking-[0.02em] uppercase">Add 3D Model</span>
          </div>
        </div>
      )}
    </div>
  );
}
