import React from 'react';
import { useGetMe } from '@/hooks/useAuth';
import { 
  ShieldCheck, 
  ChevronRight, 
  User as UserIcon,
  Mail,
  Briefcase,
  Calendar,
  Pencil
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { data: userData, isLoading } = useGetMe();
  const user = userData?.data;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-bold text-[#E2E8F0] tracking-tight">Your Profile</h1>

      <div className="space-y-6">
        {/* Profile Overview Card */}
        <section className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-xl relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 flex items-end justify-between mb-6">
              <div className="relative">
                <img
                  src={user?.avatar || '/logo.png'}
                  alt="User avatar"
                  className="w-24 h-24 rounded-2xl border-4 border-[#1E293B] bg-[#1E293B] object-cover shadow-2xl"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-lg border-2 border-[#1E293B] flex items-center justify-center">
                  <Pencil className="w-3 h-3 text-white" />
                </div>
              </div>
              <button 
                onClick={() => navigate('/profile/edit')}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-[#94A3B8]">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-[#475569] uppercase tracking-[0.2em] flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]/50">
                <UserIcon className="w-4 h-4 text-[#64748B]" />
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]/50">
                <Briefcase className="w-4 h-4 text-[#64748B]" />
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Occupation</p>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{user?.occupation || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]/50">
                <Calendar className="w-4 h-4 text-[#64748B]" />
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Age</p>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{user?.age ? `${user.age} years` : '-'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-[#475569] uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Account Metadata
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]/50">
                <Mail className="w-4 h-4 text-[#64748B]" />
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]/50">
                <Calendar className="w-4 h-4 text-[#64748B]" />
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold text-[#E2E8F0]">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-wider">Status</p>
                    <p className="text-sm font-semibold text-emerald-400">Verified Account</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500/30" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
