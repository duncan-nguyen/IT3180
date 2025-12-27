import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminAccountCreateProps {
  onLogout: () => void;
}

export default function AdminAccountCreate({ onLogout }: AdminAccountCreateProps) {
  const navigate = useNavigate();

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
            Tạo Tài khoản Mới
          </h1>
          <p className="text-[#212121]">
            Thêm người dùng mới vào hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <UserPlus className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Tài khoản
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
                      placeholder="Nguyễn Văn A"
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
                      placeholder="nguyenvana@example.com"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[#212121]">
                      Số điện thoại <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0912345678"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cccd" className="text-[#212121]">
                      Số CCCD
                    </Label>
                    <Input
                      id="cccd"
                      placeholder="001234567890"
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
                    <Select>
                      <SelectTrigger id="role" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn vai trò" />
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
                      Tổ dân phố (nếu là Tổ trưởng)
                    </Label>
                    <Select>
                      <SelectTrigger id="area" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn tổ" />
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

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-[#212121]">
                      Mật khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tối thiểu 8 ký tự"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirm-password" className="text-[#212121]">
                      Xác nhận Mật khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[#212121]">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    placeholder="15 Nguyễn Lương Bằng, Phường Đống Đa"
                    className="h-12 border-2 border-[#212121]/20"
                  />
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
                  Tạo Tài khoản
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

            {/* Instructions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hướng dẫn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Các trường đánh dấu (*) là bắt buộc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Mật khẩu phải có tối thiểu 8 ký tự</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Email sẽ được sử dụng để đăng nhập</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Người dùng sẽ nhận email thông báo sau khi tạo tài khoản</span>
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
