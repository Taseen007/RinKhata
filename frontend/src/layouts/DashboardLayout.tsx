import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { 
	LayoutDashboard, 
	Wallet, 
	FileText, 
	ArrowLeftRight,
	Settings,
	HelpCircle,
	Search,
	MoreHorizontal,
	Menu,
	ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetMe } from '@/hooks/useAuth';

const DashboardLayout = () => {
	const location = useLocation();
	const { data: userData } = useGetMe();
	const user = userData?.data;
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true);

	// Close dropdown on outside click
	useEffect(() => {
		if (!dropdownOpen) return;
		const handler = (e: MouseEvent | globalThis.MouseEvent) => {
			if (!document.getElementById('sidebar-user-dropdown')?.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [dropdownOpen]);

	const mainNavigation = [
		{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ name: 'Loans', href: '/loans', icon: FileText },
		{ name: 'Wallets', href: '/wallets', icon: Wallet },
		{ name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
	];

	const systemNavigation = [
		{ name: 'Settings', href: '/settings', icon: Settings },
		{ name: 'Get Help', href: '#', icon: HelpCircle },
		{ name: 'Search', href: '#', icon: Search },
	];

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	// Get page title from current path
	const currentPage = [...mainNavigation, ...systemNavigation].find(item => 
		item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
	);

	return (
		<div className="flex bg-[#020617] min-h-screen font-['Inter']">
			{/* Sidebar */}
			<aside 
				className={cn(
					"flex flex-col border-r border-[#1E293B] bg-[#020617] shrink-0 h-full transition-all duration-250 ease-in-out z-40 overflow-hidden",
					isExpanded ? "w-[240px]" : "w-[72px]"
				)}
			>
				{/* 3. Logo Section */}
				<div className={cn(
					"flex items-center h-16 border-b border-[#1E293B] transition-all duration-250",
					isExpanded ? "px-4 gap-3" : "justify-center px-0"
				)}>
					<img src="/logo.png" alt="Rinখাতা" className="w-[28px] h-[28px] object-contain shrink-0" />
					{isExpanded && (
						<span className="text-[18px] font-semibold text-[#E2E8F0] whitespace-nowrap animate-in fade-in duration-300">
							Rinখাতা
						</span>
					)}
				</div>

				{/* Sidebar Content (Scrollable) */}
				<div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
					{/* 4. MAIN Navigation */}
					<div className="space-y-1">
						{isExpanded && (
							<p className="px-3 mb-2 text-[10px] font-bold text-[#475569] uppercase tracking-wider animate-in fade-in duration-300">
								Main
							</p>
						)}
						{mainNavigation.map((item) => {
							const isActive = item.href === '/' 
								? location.pathname === '/' 
								: location.pathname.startsWith(item.href);
							return (
								<Link
									key={item.name}
									to={item.href}
									title={!isExpanded ? item.name : ""}
									className={cn(
										"group flex items-center h-[44px] rounded-[10px] transition-all duration-200",
										isExpanded ? "px-3 gap-3" : "justify-center px-0",
										isActive
											? 'bg-[#2563EB] text-white'
											: 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E2E8F0] hover:translate-x-[2px]'
									)}
								>
									<item.icon className="w-[20px] h-[20px] shrink-0" />
									{isExpanded && (
										<span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-300">
											{item.name}
										</span>
									)}
								</Link>
							);
						})}
					</div>

					{/* 4. SYSTEM Navigation */}
					<div className="space-y-1">
						{isExpanded && (
							<p className="px-3 mb-2 text-[10px] font-bold text-[#475569] uppercase tracking-wider animate-in fade-in duration-300">
								System
							</p>
						)}
						{systemNavigation.map((item) => {
							const isActive = location.pathname.startsWith(item.href) && item.href !== '#';
							return (
								<Link
									key={item.name}
									to={item.href}
									title={!isExpanded ? item.name : ""}
									className={cn(
										"group flex items-center h-[44px] rounded-[10px] transition-all duration-200",
										isExpanded ? "px-3 gap-3" : "justify-center px-0",
										isActive
											? 'bg-[#2563EB] text-white'
											: 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E2E8F0] hover:translate-x-[2px]'
									)}
								>
									<item.icon className="w-[20px] h-[20px] shrink-0" />
									{isExpanded && (
										<span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-300">
											{item.name}
										</span>
									)}
								</Link>
							);
						})}
					</div>
				</div>

				{/* 8. Profile Section (Sticky Bottom) */}
				<div className="mt-auto border-t border-[#1E293B] bg-[#020617] relative">
					<div className="p-3" id="sidebar-user-dropdown">
						{/* Dropdown menu */}
						{dropdownOpen && (
							<div className={cn(
								"absolute bottom-full mb-2 z-50 bg-[#020617] border border-[#1E293B] rounded-[10px] shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200",
								isExpanded ? "left-3 w-[214px]" : "left-3 w-[180px]"
							)}>
								<button
									className="block w-full text-left px-4 py-2 text-sm text-[#E2E8F0] hover:bg-[#1E293B] transition-colors"
									onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
								>
									View Profile
								</button>
								<button
									className="block w-full text-left px-4 py-2 text-sm text-[#E2E8F0] hover:bg-[#1E293B] transition-colors"
									onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
								>
									Settings
								</button>
								<div className="h-px bg-[#1E293B] my-2" />
								<button
									className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1E293B] transition-colors"
									onClick={() => { setDropdownOpen(false); handleLogout(); }}
								>
									Logout
								</button>
							</div>
						)}
						
						<button
							className={cn(
								"flex items-center rounded-lg w-full hover:bg-[#1E293B] transition-all duration-200 focus:outline-none h-[48px]",
								isExpanded ? "px-2 gap-3" : "justify-center px-0"
							)}
							onClick={() => setDropdownOpen((v) => !v)}
							title={!isExpanded ? user?.name : ""}
						>
							<div className="shrink-0 relative">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt="User avatar"
										className="w-8 h-8 rounded-full object-cover border border-[#334155]"
									/>
								) : (
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2563EB] text-white text-xs font-bold">
										{user?.name?.charAt(0)?.toUpperCase() || 'U'}
									</div>
								)}
								<div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#020617] rounded-full" />
							</div>
							
							{isExpanded && (
								<>
									<div className="flex-1 min-w-0 text-left animate-in fade-in duration-300">
										<p className="text-sm font-semibold text-[#E2E8F0] truncate leading-tight">
											{user?.name || 'User'}
										</p>
										<p className="text-[11px] text-[#94A3B8] truncate">
											{user?.email || ''}
										</p>
									</div>
									<ChevronDown className={cn("w-4 h-4 text-[#94A3B8] transition-transform duration-200 shrink-0", dropdownOpen && "rotate-180")} />
								</>
							)}
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
				{/* Top Header */}
				<header className="flex items-center h-16 px-6 border-b border-[#1E293B] bg-[#020617] shrink-0">
					<div className="flex items-center gap-4">
						{/* 2. Sidebar Toggle Button */}
						<button 
							onClick={() => setIsExpanded(!isExpanded)}
							className="p-2 -ml-2 rounded-lg hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
						>
							<Menu className="w-5 h-5" />
						</button>
						<div className="flex items-center gap-2">
							<MoreHorizontal className="w-4 h-4 text-[#475569]" />
							<span className="text-sm font-medium text-[#E2E8F0]">{currentPage?.name || 'Dashboard'}</span>
						</div>
					</div>
				</header>

				{/* Content area */}
				<main className="flex-1 overflow-y-auto p-6 bg-[#020617] relative">
					<div className="absolute inset-0 z-0 pointer-events-none" style={{
						background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.03), transparent 70%)'
					}} />
					<div className="relative z-10">
						<Outlet />
					</div>
				</main>
				
				{/* Footer */}
				<footer className="border-t border-[#1E293B] py-4 text-center text-[12px] bg-[#020617] text-[#475569]">
					<p>© 2026 Rinখাতা (ঋণখাতা) • Smart Loan & Debt Tracker</p>
				</footer>
			</div>
		</div>
	);
};

export default DashboardLayout;
