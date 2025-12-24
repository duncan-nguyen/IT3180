import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Users, Shield, Settings, FileText, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation();

  const menuItems = [
    { icon: Users, label: 'Quản lý Tài khoản', path: '/admin' },
    { icon: Shield, label: 'Phân quyền & Vai trò', path: '/admin/roles' },
    { icon: Settings, label: 'Cấu hình Hệ thống', path: '/admin/settings' },
    { icon: FileText, label: 'Nhật ký (Logs)', path: '/admin/logs' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r-2 border-[#212121]/10 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b-2 border-[#212121]/10">
          <h2 className="text-[#212121]">
            Quản trị Hệ thống
          </h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full h-14 justify-start px-6 ${
                    isActive
                      ? 'bg-[#0D47A1] text-white hover:bg-[#0D47A1]/90'
                      : 'hover:bg-[#F5F5F5] text-[#212121]'
                  }`}
                >
                  <Icon className="w-6 h-6 mr-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-[#212121]/10">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-14 border-2 border-[#212121]/20 hover:bg-[#F5F5F5] text-[#212121]"
          >
            <LogOut className="w-6 h-6 mr-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
