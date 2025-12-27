import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { authService } from '../services/auth-service';

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      // Determine role logic - backend returns role in Enum (e.g., 'nguoi_dan', 'can_bo_phuong')
      // App.tsx expects 'citizen' | 'leader' | 'official' | 'admin'
      // Need a mapping utility or adjust backend/frontend Enums.
      // For now, let's map manually based on backend response values.
      // Backend values: admin, to_truong, can_bo_phuong, nguoi_dan (lowercase enum values)

      let appRole: UserRole = null;
      const backendRole = response.user.role as unknown as string; // cast to string to be safe

      if (backendRole === 'admin') appRole = 'admin';
      else if (backendRole === 'to_truong') appRole = 'leader';
      else if (backendRole === 'can_bo_phuong') appRole = 'official';
      else if (backendRole === 'nguoi_dan') appRole = 'citizen';

      if (appRole) {
        onLogin(appRole, response.user.username); // Or full name if available somewhere
      } else {
        setError('Vai trò không hợp lệ');
      }

    } catch (err: any) {
      console.error(err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
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
              disabled={loading}
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
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
