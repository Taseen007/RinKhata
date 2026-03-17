import React, { useState, useEffect, useRef } from 'react';
import { useGetMe } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EditProfile: React.FC = () => {
  const { data } = useGetMe();
  const user = data?.data;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    age: '' as string | number,
    occupation: '',
    avatar: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        age: user.age || '',
        occupation: user.occupation || '',
        avatar: user.avatar || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  // Helper to convert file to base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Mutation for updating profile
  const updateProfile = useMutation({
    mutationFn: async (formData: typeof form) => {
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        try {
          avatarUrl = await toBase64(avatarFile);
        } catch (err) {
          console.error('Error converting file to base64:', err);
        }
      }

      return await authService.updateMe({
        name: formData.name,
        age: formData.age,
        occupation: formData.occupation,
        avatar: avatarUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => {
        setIsSaved(false);
        setTimeout(() => {
          setShowToast(false);
          navigate('/profile');
        }, 1500);
      }, 2000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getDelay = (index: number) => ({ animationDelay: `${0.1 + index * 0.1}s` });

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#475569] uppercase tracking-widest animate-slide-up opacity-0" style={getDelay(0)}>
        <span>···</span>
        <span className="text-[#334155]">/</span>
        <button onClick={() => navigate('/profile')} className="hover:text-[#2563EB] transition-colors">Profile</button>
        <span className="text-[#334155]">/</span>
        <span className="text-[#2563EB]">Edit</span>
      </div>

      {/* 2. Header */}
      <div className="animate-slide-up opacity-0" style={getDelay(1)}>
        <h1 className="text-3xl font-bold text-[#E2E8F0] tracking-tight text-white">Edit Profile</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Update your personal information below</p>
      </div>

      <form 
        onSubmit={e => { e.preventDefault(); updateProfile.mutate(form); }}
        className="space-y-6"
      >
        {/* 3. Avatar Section */}
        <section className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-xl animate-slide-up opacity-0" style={getDelay(2)}>
          <div className="flex items-center gap-8">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-2xl border-4 border-[#0F172A] bg-[#0F172A] overflow-hidden shadow-2xl relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-[#020617]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Change photo</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-[#64748B] mt-1 uppercase tracking-widest font-bold">JPG or PNG · Max 2MB</p>
            </div>
          </div>
        </section>

        {/* 4. Form Fields */}
        <div className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5 animate-slide-up opacity-0" style={getDelay(3)}>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
              required
            />
          </div>

          {/* Age Field */}
          <div className="space-y-1.5 animate-slide-up opacity-0" style={getDelay(4)}>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
              className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          {/* Occupation Field */}
          <div className="space-y-1.5 animate-slide-up opacity-0" style={getDelay(5)}>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Occupation</label>
            <input
              type="text"
              value={form.occupation}
              onChange={e => setForm({ ...form, occupation: e.target.value })}
              className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div className="space-y-1.5 animate-slide-up opacity-0" style={getDelay(6)}>
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Email</label>
              <span className="text-[9px] font-black bg-[#0F172A] text-[#475569] px-1.5 py-0.5 rounded border border-[#334155] uppercase tracking-tighter">read-only</span>
            </div>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full h-12 px-4 bg-[#1E293B]/50 border border-[#334155] rounded-xl text-sm text-[#475569] cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex items-center gap-4 pt-4 animate-slide-up opacity-0" style={getDelay(7)}>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="h-12 px-8 bg-transparent hover:bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#E2E8F0] text-sm font-bold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfile.isPending || isSaved}
            className={cn(
              "flex-1 h-12 px-8 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all shadow-lg",
              isSaved 
                ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
            )}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* 6. Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#0F172A] border border-emerald-500/30 rounded-2xl p-4 pr-12 shadow-2xl flex items-center gap-3 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-emerald-400">Profile updated successfully</p>
            <button 
              onClick={() => setShowToast(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
