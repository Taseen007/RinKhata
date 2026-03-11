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
	MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetMe } from '@/hooks/useAuth';

const DashboardLayout = () => {
	const location = useLocation();
	const { data: userData } = useGetMe();
	const user = userData?.data;
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);

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

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ name: 'Loans', href: '/loans', icon: FileText },
		{ name: 'Wallets', href: '/wallets', icon: Wallet },
		{ name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
	];

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	// Get page title from current path
	const currentPage = navigation.find(item => 
		item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
	);

	return (
		<div className="flex bg-background min-h-screen">
			{/* Sidebar */}
			<aside className="flex flex-col w-[260px] border-r border-sidebar-border bg-sidebar shrink-0 h-full">
				{/* Logo */}
				<div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
					<img src="/logo.png" alt="Rinখাতা" className="w-14 h-14 object-contain" />
					<span className="text-base font-semibold text-sidebar-accent-foreground">Rinখাতা</span>
				</div>

				{/* Navigation */}
				<nav className="px-3 py-4 space-y-1 overflow-y-auto">
					{navigation.map((item) => {
						const isActive = item.href === '/' 
							? location.pathname === '/' 
							: location.pathname.startsWith(item.href);
						return (
							<Link
								key={item.name}
								to={item.href}
								className={cn(
									"flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
									isActive
										? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
										: 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
								)}
							>
								<item.icon className="w-4 h-4" />
								{item.name}
							</Link>
						);
					})}
				</nav>

				{/* Spacer to push bottom section and user card to bottom */}
				<div className="flex-1" />

				{/* Bottom Section */}
				<div className="px-3 py-3 space-y-1 border-t border-sidebar-border">
					<Link to="/settings" className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
						<Settings className="w-4 h-4" />
						Settings
					</Link>
					<button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
						<HelpCircle className="w-4 h-4" />
						Get Help
					</button>
					<button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
						<Search className="w-4 h-4" />
						Search
					</button>
				</div>

				{/* User info with dropdown, always docked at bottom */}
				   <div className="px-3 py-3 border-t border-sidebar-border relative">
					   <div className="relative flex flex-col-reverse items-stretch" id="sidebar-user-dropdown">
						   {/* Dropdown menu above user button */}
						   {dropdownOpen && (
							   <div className="absolute left-24 bottom-full mb-2 min-w-[180px] z-50 bg-sidebar border border-sidebar-border rounded-lg shadow-lg py-2 animate-fade-in">
								   <button
									   className="block w-full text-left px-4 py-2 text-sm hover:bg-sidebar-hover hover:text-foreground transition-colors"
									   onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
								   >
									   View Profile
								   </button>
								   <button
									   className="block w-full text-left px-4 py-2 text-sm hover:bg-sidebar-hover hover:text-foreground transition-colors"
									   onClick={() => { setDropdownOpen(false); handleLogout(); }}
								   >
									   Logout
								   </button>
							   </div>
						   )}
						   <button
							   className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-sidebar-hover transition-colors focus:outline-none"
							   onClick={() => setDropdownOpen((v) => !v)}
							   aria-haspopup="true"
							   aria-expanded={dropdownOpen}
						   >
							   {user?.avatar ? (
								   <img
									   src={user.avatar}
									   alt="User avatar"
									   className="w-8 h-8 rounded-lg object-cover border border-sidebar-border"
								   />
							   ) : (
								   <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-foreground text-sm font-semibold">
									   {user?.name?.charAt(0)?.toUpperCase() || 'U'}
								   </div>
							   )}
							   <div className="flex-1 min-w-0 text-left">
								   <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
									   {user?.name || 'User'}
								   </p>
								   <p className="text-xs text-sidebar-foreground truncate">
									   {user?.email || ''}
								   </p>
							   </div>
							   <svg className={cn("w-4 h-4 text-sidebar-foreground transition-transform", dropdownOpen && "rotate-180")}
								   fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								   <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
							   </svg>
						   </button>
					   </div>
				   </div>
			</aside>

			{/* Main Content */}
			   <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
				{/* Top Header */}
				<header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background shrink-0">
					<div className="flex items-center gap-2">
						<MoreHorizontal className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm font-medium">{currentPage?.name || 'Dashboard'}</span>
					</div>
				</header>

				   {/* Content area */}
				   <main className="flex-1 overflow-y-auto p-6 pb-32">
					   <Outlet />
				   </main>
				   {/* Responsive Footer: fixed only if content is short */}
				   <footer className="border-t border-border-light pt-6 pb-4 text-center text-sm mt-0 w-full bg-background
					   absolute bottom-0 left-0 right-0
					   md:static md:relative">
					   <p className="mb-2 text-foreground/80">
						   © 2026 Rinখাতা (ঋণখাতা). All rights reserved.
					   </p>
					   <p className="text-muted-foreground mb-3">
						   Track loans. Manage repayments. Stay financially organized.
					   </p>
					   <div className="flex justify-center gap-6 text-sm text-foreground/60">
						   <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
						   <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
						   <a href="#" className="hover:text-primary transition-colors">Support</a>
					   </div>
				   </footer>
			   </div>
		</div>
	);
};

export default DashboardLayout;
