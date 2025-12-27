import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Save, Key, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminAccountResetPasswordProps {
  onLogout: () => void;
}

export default function AdminAccountResetPassword({ onLogout }: AdminAccountResetPasswordProps) {
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
            Đặt lại Mật khẩu
          </h1>
          <p className="text-[#212121]">
            Tài khoản: Nguyễn Văn An (ID: {id})
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
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Không sử dụng mật khẩu dễ đoán</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Auto-send Option */}
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="send-email"
                      className="w-5 h-5 mt-1"
                      defaultChecked
                    />
                    <div>
                      <label htmlFor="send-email" className="text-[#212121] cursor-pointer">
                        <strong>Gửi email thông báo</strong>
                      </label>
                      <p className="text-sm text-[#212121] mt-1">
                        Gửi mật khẩu mới đến email người dùng: nguyenvanan@example.com
                      </p>
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
                <Button className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90">
                  <Save className="w-5 h-5 mr-2" />
                  Đặt lại Mật khẩu
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
                    <span>Người dùng sẽ bị đăng xuất khỏi tất cả thiết bị</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1">•</span>
                    <span>Hành động này sẽ được ghi vào nhật ký hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1">•</span>
                    <span>Người dùng cần sử dụng mật khẩu mới để đăng nhập</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Người dùng
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
