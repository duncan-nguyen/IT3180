import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { ArrowLeft, Save, UserCog, Trash2, Key } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminAccountEditProps {
  onLogout: () => void;
}

export default function AdminAccountEdit({ onLogout }: AdminAccountEditProps) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3">
                Chỉnh sửa Tài khoản #{id}
              </h1>
              <p className="text-[#212121]">
                Cập nhật thông tin người dùng
              </p>
            </div>
            <Badge className="bg-[#1B5E20] h-10 px-4">
              Đang hoạt động
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <UserCog className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Cơ bản
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullname" className="text-[#212121]">
                      Họ và Tên <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      defaultValue="Nguyễn Văn An"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[#212121]">
                      Email <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="nguyenvanan@example.com"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[#212121]">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      defaultValue="0912345678"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cccd" className="text-[#212121]">
                      Số CCCD
                    </Label>
                    <Input
                      id="cccd"
                      defaultValue="001234567890"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                {/* Role and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[#212121]">
                      Vai trò <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="citizen">
                      <SelectTrigger id="role" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Người dân</SelectItem>
                        <SelectItem value="leader">Tổ trưởng</SelectItem>
                        <SelectItem value="official">Cán bộ Phường/Xã</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="area" className="text-[#212121]">
                      Tổ dân phố
                    </Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="area" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tổ 1</SelectItem>
                        <SelectItem value="2">Tổ 2</SelectItem>
                        <SelectItem value="3">Tổ 3</SelectItem>
                        <SelectItem value="4">Tổ 4</SelectItem>
                        <SelectItem value="5">Tổ 5</SelectItem>
                        <SelectItem value="6">Tổ 6</SelectItem>
                        <SelectItem value="7">Tổ 7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[#212121]">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    defaultValue="15 Nguyễn Lương Bằng, Phường Đống Đa"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Trạng thái Tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                  <div>
                    <p className="text-[#212121] mb-1">
                      Kích hoạt Tài khoản
                    </p>
                    <p className="text-sm text-[#212121]">
                      Cho phép người dùng đăng nhập
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                  <div>
                    <p className="text-[#212121] mb-1">
                      Nhận Thông báo Email
                    </p>
                    <p className="text-sm text-[#212121]">
                      Gửi thông báo qua email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Tạo lúc:</strong> 15/10/2025 10:30
                  </p>
                  <p className="text-[#212121]">
                    <strong>Đăng nhập lần cuối:</strong> 03/11/2025 09:15
                  </p>
                  <p className="text-[#212121]">
                    <strong>Số lần đăng nhập:</strong> 127 lần
                  </p>
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
                <Button className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90">
                  <Save className="w-5 h-5 mr-2" />
                  Lưu Thay đổi
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Đặt lại Mật khẩu
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>

                <div className="pt-3 border-t border-[#212121]/10">
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Xóa Tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hoạt động Gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Đăng nhập hệ thống
                  </p>
                  <p className="text-xs text-[#212121]">
                    03/11/2025 09:15
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Xem thông tin hộ khẩu
                  </p>
                  <p className="text-xs text-[#212121]">
                    02/11/2025 14:20
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Gửi kiến nghị mới
                  </p>
                  <p className="text-xs text-[#212121]">
                    01/11/2025 16:45
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
