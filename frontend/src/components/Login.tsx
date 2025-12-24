import { AlertCircle, Building2 } from 'lucide-react';
import { useState } from 'react';
import { login } from '../api_caller/port8017';
import { UserRole } from '../App';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: (role: UserRole, name: string, token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Call actual login API
      const response = await login(username, password);
      
      // Map backend role to frontend UserRole
      const roleMap: Record<string, UserRole> = {
        'admin': 'admin',
        'to_truong': 'leader',
        'can_bo_phuong': 'official',
        'nguoi_dan': 'citizen',
      };
      
      const userRole = roleMap[response.user.role] || 'citizen';
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Call onLogin with the user information
      onLogin(userRole, response.user.username, response.access_token, response.user);
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
    } finally {
      setIsLoading(false);
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-[#212121]">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
                className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50"
            >
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-[#0D47A1] underline">
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}