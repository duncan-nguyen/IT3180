import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Key } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CitizenChangePasswordProps {
  onLogout: () => void;
}

export default function CitizenChangePassword({ onLogout }: CitizenChangePasswordProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): string | null => {
    if (!oldPassword) {
      return 'Vui lòng nhập mật khẩu hiện tại.';
    }
    if (!newPassword) {
      return 'Vui lòng nhập mật khẩu mới.';
    }
    if (newPassword.length < 6) {
      return 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    }
    if (newPassword !== confirmPassword) {
      return 'Xác nhận mật khẩu không khớp.';
    }
    if (oldPassword === newPassword) {
      return 'Mật khẩu mới phải khác mật khẩu cũ.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await residentsService.changeMyPassword(oldPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang chính...');
      
      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.detail?.error?.message 
        || err.response?.data?.detail 
        || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#212121]/10 p-6">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/citizen/profile">
              <Button variant="outline" className="h-10 px-4 border-2 border-[#212121]/20">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-[#212121] text-xl font-bold flex items-center gap-2">
              <Key className="w-6 h-6" />
              Đổi mật khẩu
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-6">
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">Thay đổi mật khẩu</CardTitle>
            <p className="text-sm text-gray-500">
              Nhập mật khẩu hiện tại và mật khẩu mới để đổi mật khẩu
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700">{success}</span>
                </div>
              )}

              {/* Old Password */}
              <div>
                <Label htmlFor="oldPassword">Mật khẩu hiện tại <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="h-12 pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link to="/citizen/profile" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-[#212121]/20"
                  >
                    Hủy
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={saving || !!success}
                  className="flex-1 h-12 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                >
                  {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-2 border-[#FBC02D]/50 shadow-lg mt-6 bg-[#FFFDE7]">
          <CardContent className="py-4">
            <h4 className="font-medium text-[#212121] mb-2">💡 Lưu ý bảo mật:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Không sử dụng mật khẩu quá đơn giản như ngày sinh, số điện thoại</li>
              <li>Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              <li>Không chia sẻ mật khẩu với người khác</li>
              <li>Đổi mật khẩu định kỳ để bảo mật tài khoản</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
