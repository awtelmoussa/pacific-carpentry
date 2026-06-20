'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProjectAction, updateProjectAction, deleteProjectAction, uploadImageAction } from '@/app/actions/adminActions';

interface DBProject {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  catEn: string;
  catAr: string;
  year: string;
  images: string[];
}

interface AdminWorkClientProps {
  initialProjects: DBProject[];
}

export default function AdminWorkClient({ initialProjects }: AdminWorkClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields State
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [catEn, setCatEn] = useState('Residential');
  const [catAr, setCatAr] = useState('سكني');
  const [year, setYear] = useState('2024');
  const [images, setImages] = useState<string[]>([]);

  const [error, setError] = useState('');

  const woodHexes = ["#6B4226", "#3A2A1B", "#5A4030", "#4A3526", "#2C2824", "#C99A63"];

  const handleOpenNew = () => {
    setTitleEn('');
    setTitleAr('');
    setCatEn('Residential');
    setCatAr('سكني');
    setYear(new Date().getFullYear().toString());
    setEditingId(null);
    setImages([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proj: DBProject) => {
    setTitleEn(proj.titleEn);
    setTitleAr(proj.titleAr);
    setCatEn(proj.catEn);
    setCatAr(proj.catAr);
    setYear(proj.year);
    setEditingId(proj.id);
    setImages(proj.images || []);
    setIsFormOpen(true);
  };

  const handleCategoryChange = (val: string) => {
    setCatEn(val);
    if (val === 'Residential') setCatAr('سكني');
    else if (val === 'Hospitality') setCatAr('ضيافة');
    else if (val === 'Commercial') setCatAr('تجاري');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10485760) {
      alert('Image file size is too large. Please select an image under 10MB.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        setImages([res.url]);
      } else {
        setError(res.error || 'Failed to upload image to Supabase.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during photo upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn.trim() || !titleAr.trim()) {
      setError('Please provide project titles in both languages.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      titleEn,
      titleAr,
      catEn,
      catAr,
      year,
      slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      images,
    };

    try {
      let res;
      if (editingId) {
        res = await updateProjectAction(editingId, payload);
      } else {
        res = await addProjectAction(payload);
      }

      if (res.success) {
        setIsFormOpen(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to save project.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setIsLoading(true);
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete project.');
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
            + Add Project
          </button>
        </div>
      )}

      {isFormOpen ? (
        /* PROJECT FORM CARD */
        <div className="bg-white rounded-xl border border-[#EAE3D5] p-6 shadow-sm max-w-[620px] mx-auto">
          <h2 className="font-serif font-semibold text-lg text-[#241C13] border-b border-[#EAE3D5] pb-3 mb-5">
            {editingId ? 'Edit Project Details' : 'Add New Portfolio Project'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-[#F7E4DE] border border-[#C0573E]/30 text-[#C0573E] text-xs rounded-lg p-3.5 leading-relaxed">
                {error}
              </div>
            )}

            {/* Bilingual Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Project Title (English)</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Al Barari Villa Kitchen"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Project Title (Arabic)</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  dir="rtl"
                  className={`${inputClass} text-right`}
                  placeholder="مثال: مطبخ فيلا البراري"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                />
              </div>
            </div>

            {/* Category selection & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sector Category</label>
                <select
                  disabled={isLoading}
                  className={inputClass}
                  value={catEn}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="Residential">Residential (سكني)</option>
                  <option value="Hospitality">Hospitality (ضيافة)</option>
                  <option value="Commercial">Commercial (تجاري)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Completion Year</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            {/* Photo upload field */}
            <div>
              <label className={labelClass}>Project Showcase Photo</label>
              {images.length > 0 ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#EAE3D5]">
                  <img src={images[0]} alt="Project preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setImages([])}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded shadow-md cursor-pointer transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-[#EAE3D5] bg-[#F7F4EE] rounded-lg p-6 text-center select-none cursor-pointer hover:bg-[#FBF9F5] block">
                  <input
                    disabled={isLoading}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="text-xs font-bold text-[#5A5043] tracking-[0.02em] block">Upload Project Photo</span>
                  <span className="text-[10px] text-[#A89B85] mt-1 block">Optimal sizes match masonry grid (e.g. 4:3, 4:5, 1:1 aspect ratios)</span>
                </label>
              )}
            </div>

            {/* Form actions buttons */}
            <div className="flex gap-3 pt-3 border-t border-[#EAE3D5]/60 mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-grow bg-[#9A6E3A] hover:bg-[#85602F] text-white text-xs font-bold tracking-[0.08em] uppercase py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}
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
        /* PROJECTS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {initialProjects.map((proj, i) => {
            const woodColor = woodHexes[i % woodHexes.length];
            const ratioStyle = {
              background: `radial-gradient(120% 100% at 35% 25%, ${woodColor}, #16110C 84%)`,
            };

            return (
              <div
                key={proj.id}
                className="bg-white rounded-xl border border-[#EAE3D5] overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Project Photo / Mockup */}
                <div
                  style={proj.images && proj.images.length > 0 ? {} : ratioStyle}
                  className="aspect-[4/3] w-full relative overflow-hidden bg-cover bg-center"
                >
                  {proj.images && proj.images.length > 0 ? (
                    <img src={proj.images[0]} alt={proj.titleEn} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(90deg,rgba(0,0,0,0.16) 0px,rgba(0,0,0,0.16) 1px,transparent 1px,transparent 8px)',
                      }}
                      className="absolute inset-0 opacity-40 pointer-events-none"
                    ></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D0A]/85 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-start">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#C2965B] uppercase">
                      {proj.catEn} · {proj.year}
                    </span>
                    <h3 className="mt-1 mb-0 font-serif font-semibold text-lg text-white leading-tight truncate">
                      {proj.titleEn}
                    </h3>
                  </div>
                </div>

                {/* Info & Card Actions */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="text-start mb-3">
                    <span className="text-[10px] font-bold text-[#8A7E6B] block uppercase tracking-[0.02em]">
                      Arabic Title
                    </span>
                    <span className="text-xs font-semibold text-[#241C13] mt-0.5 block truncate text-right" dir="rtl">
                      {proj.titleAr}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-1.5 border-t border-[#EAE3D5]/40 pt-3">
                    <button
                      disabled={isLoading}
                      onClick={() => handleOpenEdit(proj)}
                      className="flex-grow bg-[#F7F4EE] hover:bg-[#EAE3D5] text-[#5A5043] text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors border border-[#EAE3D5] disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => handleDelete(proj.id)}
                      className="flex-grow bg-transparent hover:bg-red-50 text-red-500 hover:text-red-700 text-xs font-semibold py-2 rounded-lg cursor-pointer transition-colors border border-red-100 hover:border-red-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick empty creation tile */}
          <div
            onClick={handleOpenNew}
            className="border-2 border-dashed border-[#EAE3D5] hover:border-[#9A6E3A] bg-[#F7F4EE]/40 hover:bg-[#FBF9F5] rounded-xl flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all duration-200 min-h-[300px]"
          >
            <span className="text-2xl text-[#8A7E6B] mb-2">+</span>
            <span className="text-xs font-bold text-[#5A5043] tracking-[0.02em] uppercase">Add New Project</span>
          </div>
        </div>
      )}
    </div>
  );
}
