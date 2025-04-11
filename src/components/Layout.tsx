
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Users, 
  Mail, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload CV', href: '/upload', icon: Upload },
    { name: 'Ứng viên', href: '/candidates', icon: Users },
    { name: 'Email', href: '/emails', icon: Mail },
    { name: 'Công ty', href: '/companies', icon: Building },
    { name: 'Tin tuyển dụng', href: '/jobs', icon: Briefcase },
  ];

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-all',
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/10'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-sidebar flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="text-xl font-semibold text-sidebar-foreground">
            Candidate<span className="text-sidebar-accent">Compass</span>
          </Link>
          <button
            className="p-1 rounded-md md:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
                NT
              </div>
            </div>
            <div className="ml-3 w-full">
              <div className="text-sm font-medium text-sidebar-foreground flex items-center justify-between">
                Nguyen Tuan
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="text-xs text-sidebar-foreground/70">HR Manager</div>
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full">
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
          <button
            className="p-1 rounded-md md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="md:flex-1 text-lg font-medium md:ml-4">
            {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
