import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, User } from '../../services/auth-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import AdminLayout from './AdminLayout';

interface AdminAccountLockProps {
  onLogout: () => void;
}

export default function AdminAccountLock({ onLogout }: AdminAccountLockProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [reason, setReason] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [includeReason, setIncludeReason] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const userData = await authService.getUserById(id);
        setUser(userData);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleLock = async () => {
    if (!id) return;

    if (!reason.trim()) {
      setError('Vui lòng nhập lý do khóa tài khoản');
      return;
    }

    if (!confirmed) {
      setError('Vui lòng xác nhận hành động khóa tài khoản');
      return;
    }

    try {
      setLocking(true);
      setError('');
      await authService.lockUser(id);
      setSuccess(true);
      // Navigate back after 2 seconds
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: any) {
      console.error('Error locking user:', err);
      setError(err.response?.data?.detail || 'Khóa tài khoản thất bại');
    } finally {
      setLocking(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Quản trị viên',
      'to_truong': 'Tổ trưởng',
      'can_bo_phuong': 'Cán bộ phường',
      'nguoi_dan': 'Người dân'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
        </div>
      </AdminLayout>
    );
  }

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
            Khóa Tài khoản
          </h1>
          <p className="text-[#212121]">
            Xác nhận khóa tài khoản: {user?.username || 'N/A'} (ID: {id})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            {success && (
              <Card className="border-2 border-green-500/30 shadow-lg bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Khóa tài khoản thành công!</p>
                      <p className="text-sm">Đang chuyển hướng...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <Card className="border-2 border-red-500/30 shadow-lg bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-6 h-6" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning Card */}
            <Card className="border-2 border-[#B71C1C]/30 shadow-lg bg-[#B71C1C]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#B71C1C]/20">
                    <AlertTriangle className="w-6 h-6 text-[#B71C1C]" />
                  </div>
                  <CardTitle className="text-[#B71C1C]">
                    Cảnh báo: Hành động Quan trọng
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  Bạn đang thực hiện hành động khóa tài khoản. Hãy đảm bảo bạn hiểu rõ các tác động sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-xl">•</span>
                    <span>Người dùng sẽ <strong>KHÔNG thể đăng nhập</strong> vào hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-xl">•</span>
                    <span>Tất cả phiên đăng nhập hiện tại sẽ bị <strong>hủy ngay lập tức</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-xl">•</span>
                    <span>Dữ liệu và thông tin của người dùng vẫn được <strong>lưu trữ</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-xl">•</span>
                    <span>Tài khoản có thể được <strong>mở khóa</strong> lại sau này</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-xl">•</span>
                    <span>Hành động này sẽ được <strong>ghi vào nhật ký</strong> hệ thống</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Reason Form */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <UserX className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Lý do Khóa Tài khoản
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-[#212121]">
                    Vui lòng nêu rõ lý do khóa tài khoản <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ví dụ: Vi phạm quy định sử dụng hệ thống, yêu cầu từ người dùng, hoạt động đáng ngờ..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
                    disabled={success}
                  />
                  <p className="text-sm text-[#212121]">
                    Thông tin này sẽ được lưu vào nhật ký hệ thống và có thể được xem lại sau này.
                  </p>
                </div>

                {/* Notification Options */}
                <div className="space-y-3">
                  <Label className="text-[#212121]">
                    Thông báo cho Người dùng
                  </Label>
                  
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="send-email-notification"
                        className="w-5 h-5 mt-1"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        disabled={success}
                      />
                      <div>
                        <label htmlFor="send-email-notification" className="text-[#212121] cursor-pointer">
                          <strong>Gửi email thông báo</strong>
                        </label>
                        <p className="text-sm text-[#212121] mt-1">
                          Gửi email thông báo về việc khóa tài khoản đến người dùng
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="include-reason"
                        className="w-5 h-5 mt-1"
                        checked={includeReason}
                        onChange={(e) => setIncludeReason(e.target.checked)}
                        disabled={success}
                      />
                      <div>
                        <label htmlFor="include-reason" className="text-[#212121] cursor-pointer">
                          <strong>Bao gồm lý do trong email</strong>
                        </label>
                        <p className="text-sm text-[#212121] mt-1">
                          Gửi kèm lý do khóa tài khoản trong email thông báo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirmation */}
            <Card className="border-2 border-[#B71C1C]/20 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-action"
                    className="w-5 h-5 mt-1"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    disabled={success}
                  />
                  <label htmlFor="confirm-action" className="text-[#212121] cursor-pointer">
                    <strong>Tôi xác nhận muốn khóa tài khoản này</strong>
                    <p className="text-sm mt-1">
                      Tôi hiểu rằng người dùng sẽ không thể truy cập vào hệ thống sau khi tài khoản bị khóa.
                    </p>
                  </label>
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
                  onClick={handleLock}
                  disabled={locking || success || !confirmed}
                  className="w-full h-14 bg-[#B71C1C] hover:bg-[#B71C1C]/90 disabled:opacity-50"
                >
                  {locking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang khóa...
                    </>
                  ) : (
                    <>
                      <UserX className="w-5 h-5 mr-2" />
                      Khóa Tài khoản
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={locking}
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Tên đăng nhập:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {user?.username || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Vai trò:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {user?.role ? getRoleLabel(user.role) : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Trạng thái hiện tại:</strong>
                  </p>
                  {user?.is_active ? (
                    <span className="inline-block px-3 py-1 rounded bg-[#1B5E20] text-white">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded bg-[#B71C1C] text-white">
                      Đã khóa
                    </span>
                  )}
                </div>
                {user?.scope_id && (
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-1">
                      <strong>Scope ID:</strong>
                    </p>
                    <p className="text-[#212121]">
                      {user.scope_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alternative Actions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động Khác
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[#212121]">
                <p className="mb-3">
                  Thay vì khóa tài khoản, bạn có thể:
                </p>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/admin/accounts/${id}/edit`)}
                >
                  Chỉnh sửa Thông tin
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/admin/accounts/${id}/reset-password`)}
                >
                  Đặt lại Mật khẩu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
