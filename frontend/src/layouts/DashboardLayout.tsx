import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  ArrowLeftRight,
  LogOut,
  Settings,
  HelpCircle,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetMe } from '@/hooks/useAuth'

const DashboardLayout = () => {
  const location = useLocation()
  const { data: userData } = useGetMe()
  const user = userData?.data
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Loans', href: '/loans', icon: FileText },
    { name: 'Wallets', href: '/wallets', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  // Get page title from current path
  const currentPage = navigation.find(item => 
    item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col w-[260px] border-r border-sidebar-border bg-sidebar shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <img src="/logo.png" alt="Rinখাতা" className="w-14 h-14 object-contain" />
          <span className="text-base font-semibold text-sidebar-accent-foreground">Rinখাতা</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = item.href === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.href)
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
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-3 space-y-1 border-t border-sidebar-border">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
            <HelpCircle className="w-4 h-4" />
            Get Help
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground transition-colors text-left">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* User info */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-foreground text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground truncate">
                {user?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded hover:bg-sidebar-hover transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-sidebar-foreground" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-2">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentPage?.name || 'Dashboard'}</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
