import { useState } from 'react';
import { UserRole } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login logic - determine role based on username
    if (username.toLowerCase().includes('citizen') || username.toLowerCase().includes('dan')) {
      onLogin('citizen', 'Nguyễn Văn An');
    } else if (username.toLowerCase().includes('leader') || username.toLowerCase().includes('truong')) {
      onLogin('leader', 'Trần Thị Bình');
    } else if (username.toLowerCase().includes('official') || username.toLowerCase().includes('canbo')) {
      onLogin('official', 'Lê Văn Cường');
    } else if (username.toLowerCase().includes('admin')) {
      onLogin('admin', 'Admin');
    } else {
      // Default to citizen
      onLogin('citizen', 'Nguyễn Văn An');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[#0D47A1] rounded-lg flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-12 text-[#212121]">
            Hệ thống Quản lý Dân cư
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-[#212121]">
                Tên đăng nhập hoặc Số CCCD
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-[#212121]">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
            >
              ĐĂNG NHẬP
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-[#0D47A1] underline">
              Quên mật khẩu?
            </a>
          </div>

          {/* Demo Helper */}
          <div className="mt-8 p-4 bg-[#F5F5F5] rounded-lg">
            <p className="text-sm text-[#212121] mb-2">
              <strong>Demo:</strong> Nhập tên đăng nhập chứa:
            </p>
            <ul className="text-sm text-[#212121] space-y-1">
              <li>• "dan" hoặc "citizen" → Vai trò Người dân</li>
              <li>• "truong" hoặc "leader" → Vai trò Tổ trưởng</li>
              <li>• "canbo" hoặc "official" → Vai trò Cán bộ</li>
              <li>• "admin" → Vai trò Quản trị viên</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
