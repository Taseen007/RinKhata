import React, { useState } from 'react'
import { useLogin, useRegister } from '@/hooks/useAuth'
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ email, password })
        window.location.href = '/'
      } else {
        await registerMutation.mutateAsync({ name, email, password })
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    }
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Inter']">
      {/* Radial Glow Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(37,99,235,0.15), transparent 60%)'
        }}
      />

      {/* 1. Page Header (Brand Section) */}
      <div className="z-10 text-center mb-[48px] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <img src="/logo.png" alt="Rinখাতা Logo" className="w-[32px] h-[32px] mx-auto mb-2 object-contain" />
        <h1 className="text-[34px] font-bold text-[#E2E8F0] leading-tight">Rinখাতা</h1>
        <p className="text-[14px] text-[#94A3B8] mt-1">Smart Loan & Debt Tracker</p>
      </div>

      {/* 3. Authentication Card */}
      <div className="z-10 w-full max-w-[420px] bg-[#1E293B] border border-[#334155] rounded-[14px] p-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* 4. Login / Register Switch */}
        <div className="flex p-1 bg-[#0F172A] rounded-[12px] mb-8">
          <button
            type="button"
            className={cn(
              "flex-1 py-[10px] px-[20px] text-sm font-medium rounded-[10px] transition-all duration-200",
              isLogin 
                ? "bg-[#1E293B] text-[#E2E8F0] shadow-sm" 
                : "text-[#94A3B8] hover:text-[#E2E8F0]"
            )}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-[10px] px-[20px] text-sm font-medium rounded-[10px] transition-all duration-200",
              !isLogin 
                ? "bg-[#1E293B] text-[#E2E8F0] shadow-sm" 
                : "text-[#94A3B8] hover:text-[#E2E8F0]"
            )}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 11. Registration Fields (Full Name) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#E2E8F0]">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-[46px] pl-11 pr-4 bg-[#0F172A] border border-[#334155] rounded-[10px] text-[#E2E8F0] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* 5. Email Input Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#E2E8F0]">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@rinkhata.com"
                className="w-full h-[46px] pl-11 pr-4 bg-[#0F172A] border border-[#334155] rounded-[10px] text-[#E2E8F0] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 6. Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#E2E8F0]">Password</label>
              {isLogin && (
                /* 7. Forgot Password Link */
                <button 
                  type="button" 
                  className="text-[13px] text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[46px] pl-11 pr-11 bg-[#0F172A] border border-[#334155] rounded-[10px] text-[#E2E8F0] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#E2E8F0]">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full h-[46px] pl-11 pr-4 bg-[#0F172A] border border-[#334155] rounded-[10px] text-[#E2E8F0] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* 8. Primary Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-[15px] font-semibold rounded-[10px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-lg shadow-[#2563EB]/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* 9. Demo Account Access */}
        {isLogin && (
          <div className="mt-8 pt-6 border-t border-[#334155]">
            <div className="bg-[#0F172A]/50 rounded-lg p-4 border border-[#334155]/50">
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-center mb-2">Demo Access</p>
              <div className="flex flex-col gap-1 text-center">
                <p className="text-[12px] text-[#94A3B8]">
                  <span className="text-[#64748B]">Email:</span> demo@rinkhata.com
                </p>
                <p className="text-[12px] text-[#94A3B8]">
                  <span className="text-[#64748B]">Password:</span> demo123
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 10. Security Message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#64748B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure login • Your data is encrypted</span>
        </div>
      </div>

      {/* 12. Footer */}
      <footer className="z-10 mt-[40px] text-center">
        <p className="text-[12px] text-[#475569]">© 2026 Rinখাতা</p>
      </footer>
    </div>
  )
}

export default Login
