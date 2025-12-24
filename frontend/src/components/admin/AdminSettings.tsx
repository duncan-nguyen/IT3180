import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Settings, Mail, Bell, Database, Shield, Clock, Save } from 'lucide-react';

interface AdminSettingsProps {
  onLogout: () => void;
}

export default function AdminSettings({ onLogout }: AdminSettingsProps) {
  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Cấu hình Hệ thống
          </h1>
          <p className="text-[#212121]">
            Quản lý các thiết lập và cấu hình chung của hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                  <Settings className="w-6 h-6 text-[#0D47A1]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Cài đặt Chung
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="system-name" className="text-[#212121]">
                  Tên Hệ thống
                </Label>
                <Input
                  id="system-name"
                  defaultValue="Hệ thống Quản lý Hộ khẩu Phường Đống Đa"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="admin-email" className="text-[#212121]">
                  Email Quản trị viên
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@dongda.gov.vn"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="session-timeout" className="text-[#212121]">
                  Thời gian Timeout Phiên (phút)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="30"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Chế độ Bảo trì
                  </p>
                  <p className="text-sm text-[#212121]">
                    Tạm khóa hệ thống để bảo trì
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                  <Mail className="w-6 h-6 text-[#0D47A1]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Cấu hình Email
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="smtp-host" className="text-[#212121]">
                  SMTP Host
                </Label>
                <Input
                  id="smtp-host"
                  defaultValue="smtp.gmail.com"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="smtp-port" className="text-[#212121]">
                  SMTP Port
                </Label>
                <Input
                  id="smtp-port"
                  defaultValue="587"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="smtp-user" className="text-[#212121]">
                  SMTP Username
                </Label>
                <Input
                  id="smtp-user"
                  defaultValue="noreply@dongda.gov.vn"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Email Thông báo
                  </p>
                  <p className="text-sm text-[#212121]">
                    Gửi email tự động
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                  <Bell className="w-6 h-6 text-[#1B5E20]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Cài đặt Thông báo
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Thông báo Kiến nghị mới
                  </p>
                  <p className="text-sm text-[#212121]">
                    Gửi cho Cán bộ Phường
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Thông báo Phản hồi
                  </p>
                  <p className="text-sm text-[#212121]">
                    Gửi cho Người dân
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Nhắc nhở Kiến nghị quá hạn
                  </p>
                  <p className="text-sm text-[#212121]">
                    Tự động sau 7 ngày
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Báo cáo Định kỳ
                  </p>
                  <p className="text-sm text-[#212121]">
                    Gửi hàng tuần
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#B71C1C]/10">
                  <Shield className="w-6 h-6 text-[#B71C1C]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Bảo mật
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="password-min" className="text-[#212121]">
                  Độ dài Mật khẩu tối thiểu
                </Label>
                <Input
                  id="password-min"
                  type="number"
                  defaultValue="8"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Yêu cầu Ký tự Đặc biệt
                  </p>
                  <p className="text-sm text-[#212121]">
                    Trong mật khẩu
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Xác thực 2 lớp (2FA)
                  </p>
                  <p className="text-sm text-[#212121]">
                    Cho tài khoản Admin
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-3">
                <Label htmlFor="login-attempts" className="text-[#212121]">
                  Số lần Đăng nhập sai tối đa
                </Label>
                <Input
                  id="login-attempts"
                  type="number"
                  defaultValue="5"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Database Settings */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                  <Database className="w-6 h-6 text-[#0D47A1]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Cơ sở Dữ liệu
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#F5F5F5] rounded-lg space-y-2">
                <p className="text-[#212121]">
                  <strong>Kích thước:</strong> 2.4 GB / 10 GB
                </p>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D47A1] w-[24%]" />
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F5] rounded-lg">
                <p className="text-[#212121]">
                  <strong>Sao lưu gần nhất:</strong> 03/11/2025 02:00
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Tự động Sao lưu
                  </p>
                  <p className="text-sm text-[#212121]">
                    Hàng ngày lúc 2:00 AM
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full h-12 bg-[#0D47A1] hover:bg-[#0D47A1]/90">
                <Database className="w-5 h-5 mr-2" />
                Sao lưu Ngay
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Settings */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                  <Clock className="w-6 h-6 text-[#1B5E20]" />
                </div>
                <CardTitle className="text-[#212121]">
                  Quy trình Xử lý
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="feedback-deadline" className="text-[#212121]">
                  Hạn xử lý Kiến nghị (ngày)
                </Label>
                <Input
                  id="feedback-deadline"
                  type="number"
                  defaultValue="7"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Tự động Chuyển tiếp
                  </p>
                  <p className="text-sm text-[#212121]">
                    Kiến nghị cho Cán bộ
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                  <p className="text-[#212121] mb-1">
                    Yêu cầu Duyệt
                  </p>
                  <p className="text-sm text-[#212121]">
                    Trước khi đóng kiến nghị
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-3">
                <Label htmlFor="reminder-days" className="text-[#212121]">
                  Nhắc nhở sau (ngày)
                </Label>
                <Input
                  id="reminder-days"
                  type="number"
                  defaultValue="5"
                  className="h-12 border-2 border-[#212121]/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button className="h-14 px-8 bg-[#1B5E20] hover:bg-[#1B5E20]/90">
            <Save className="w-5 h-5 mr-2" />
            Lưu Cấu hình
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
