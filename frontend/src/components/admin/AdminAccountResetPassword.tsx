import { AlertCircle, ArrowLeft, CheckCircle2, Key, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import AdminLayout from './AdminLayout';

interface AdminAccountResetPasswordProps {
  onLogout: () => void;
}

export default function AdminAccountResetPassword({ onLogout }: AdminAccountResetPasswordProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!id) {
      setError('Không tìm thấy ID người dùng');
      return;
    }

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.resetPassword(id, newPassword);
      setSuccess(true);
      // Navigate back after 2 seconds
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.detail || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Đặt lại Mật khẩu
          </h1>
          <p className="text-[#212121]">
            ID Tài khoản: {id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Key className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Mật khẩu Mới
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Đặt lại mật khẩu thành công! Đang chuyển hướng...
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Password Fields */}
                <div className="space-y-3">
                  <Label htmlFor="new-password" className="text-[#212121]">
                    Mật khẩu mới <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    className="h-12 border-2 border-[#212121]/20"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || success}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirm-password" className="text-[#212121]">
                    Xác nhận Mật khẩu mới <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-12 border-2 border-[#212121]/20"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || success}
                  />
                </div>

                {/* Info Box */}
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-[#0D47A1] flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-[#212121]">
                        <strong>Yêu cầu Mật khẩu:</strong>
                      </p>
                      <ul className="space-y-2 text-[#212121]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Tối thiểu 8 ký tự</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Nên chứa chữ hoa, chữ thường, số và ký tự đặc biệt</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                  onClick={handleSubmit}
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Đặt lại Mật khẩu
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={loading}
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-2 border-[#B71C1C]/20 shadow-lg bg-[#B71C1C]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Lưu ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1">•</span>
                    <span>Mật khẩu cũ sẽ không thể sử dụng sau khi đặt lại</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1">•</span>
                    <span>Người dùng cần sử dụng mật khẩu mới để đăng nhập</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
