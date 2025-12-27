import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, UserX, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface AdminAccountLockProps {
  onLogout: () => void;
}

export default function AdminAccountLock({ onLogout }: AdminAccountLockProps) {
  const navigate = useNavigate();
  const { id } = useParams();

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
            Xác nhận khóa tài khoản: Nguyễn Văn An (ID: {id})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
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
                    placeholder="Ví dụ: Vi phạm quy định sử dụng hệ thống, yêu cầu từ người dùng, hoạt động đáng ngờ..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
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
                        defaultChecked
                      />
                      <div>
                        <label htmlFor="send-email-notification" className="text-[#212121] cursor-pointer">
                          <strong>Gửi email thông báo</strong>
                        </label>
                        <p className="text-sm text-[#212121] mt-1">
                          Gửi email thông báo về việc khóa tài khoản đến: nguyenvanan@example.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="include-reason"
                        className="w-5 h-5 mt-1"
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
                <Button className="w-full h-14 bg-[#B71C1C] hover:bg-[#B71C1C]/90">
                  <UserX className="w-5 h-5 mr-2" />
                  Khóa Tài khoản
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
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
                    <strong>Họ tên:</strong>
                  </p>
                  <p className="text-[#212121]">
                    Nguyễn Văn An
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Email:</strong>
                  </p>
                  <p className="text-[#212121]">
                    nguyenvanan@example.com
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Vai trò:</strong>
                  </p>
                  <p className="text-[#212121]">
                    Người dân
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Trạng thái hiện tại:</strong>
                  </p>
                  <span className="inline-block px-3 py-1 rounded bg-[#1B5E20] text-white">
                    Đang hoạt động
                  </span>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Đăng nhập lần cuối:</strong>
                  </p>
                  <p className="text-[#212121]">
                    03/11/2025 09:15
                  </p>
                </div>
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
