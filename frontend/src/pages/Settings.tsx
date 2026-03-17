import React, { useState } from 'react';
import { useGetMe } from '@/hooks/useAuth';
import { 
  ShieldCheck, 
  Palette, 
  Bell, 
  AlertTriangle, 
  Moon, 
  Sun, 
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { isLoading } = useGetMe();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [animations, setAnimations] = useState(true);
  const [notifications, setNotifications] = useState({
    loans: true,
    payments: true,
    security: false
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-bold text-[#E2E8F0] tracking-tight">Settings</h1>

      <div className="space-y-6">
        {/* Account Security */}
        <section className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#334155] bg-[#334155]/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Account Security</h2>
              <p className="text-xs text-[#64748B]">Manage your account protection</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#E2E8F0]">Password</p>
                <p className="text-xs text-[#64748B]">Last changed 3 months ago</p>
              </div>
              <button className="px-4 py-2 bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-[#E2E8F0] text-xs font-bold rounded-lg transition-all flex items-center gap-2">
                Change password
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#E2E8F0]">Two-factor auth <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded ml-2">RECOMMENDED</span></p>
                <p className="text-xs text-[#64748B]">Add an extra layer of security</p>
              </div>
              <div className="w-10 h-5 bg-[#0F172A] rounded-full relative cursor-pointer border border-[#334155]">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 bg-[#475569] rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#334155] bg-[#334155]/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Palette className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Appearance</h2>
              <p className="text-xs text-[#64748B]">Themes, colors and customization</p>
            </div>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#E2E8F0]">Theme</p>
                <p className="text-xs text-[#64748B]">Select your preferred interface mode</p>
              </div>
              <div className="flex p-1 bg-[#0F172A] rounded-xl border border-[#334155]">
                {[
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'system', icon: Monitor, label: 'System' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-2",
                      theme === t.id ? "bg-[#334155] text-white shadow-sm" : "text-[#64748B] hover:text-[#94A3B8]"
                    )}
                  >
                    <t.icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#E2E8F0]">Page animations</p>
                <p className="text-xs text-[#64748B]">Enable smooth transitions between pages</p>
              </div>
              <div 
                onClick={() => setAnimations(!animations)}
                className={cn(
                  "w-10 h-5 rounded-full relative cursor-pointer border transition-all",
                  animations ? "bg-blue-500 border-blue-400" : "bg-[#0F172A] border-[#334155]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-2.5 h-2.5 bg-white rounded-full transition-all",
                  animations ? "left-6" : "left-1"
                )} />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#334155] bg-[#334155]/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Notifications <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded ml-2">NEW</span></h2>
              <p className="text-xs text-[#64748B]">Manage how you receive alerts</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {[
              { id: 'loans', label: 'Loan reminders', desc: 'Get alerts when a loan is due soon' },
              { id: 'payments', label: 'Payment confirmations', desc: 'Notify when a payment is received' },
              { id: 'security', label: 'Priority alerts', desc: 'Instant alerts for critical security events' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{item.label}</p>
                  <p className="text-xs text-[#64748B]">{item.desc}</p>
                </div>
                <div 
                  onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                  className={cn(
                    "w-10 h-5 rounded-full relative cursor-pointer border transition-all",
                    notifications[item.id as keyof typeof notifications] ? "bg-blue-500 border-blue-400" : "bg-[#0F172A] border-[#334155]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-2.5 h-2.5 bg-white rounded-full transition-all",
                    notifications[item.id as keyof typeof notifications] ? "left-6" : "left-1"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-rose-500/5 border border-rose-500/20 rounded-2xl overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-rose-500">Danger zone</h2>
                <p className="text-xs text-rose-500/60">Permanent actions for your account</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-lg transition-all border border-rose-500/20">
              Delete account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
