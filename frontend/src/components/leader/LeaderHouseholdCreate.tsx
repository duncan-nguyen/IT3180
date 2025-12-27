import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, Home, Users, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderHouseholdCreateProps {
  onLogout: () => void;
}

export default function LeaderHouseholdCreate({ onLogout }: LeaderHouseholdCreateProps) {
  const navigate = useNavigate();

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/households')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Thêm Hộ khẩu Mới
          </h1>
          <p className="text-[#212121]">
            Tạo mới hộ khẩu trong khu vực quản lý của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Household Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Home className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="household-number" className="text-[#212121]">
                    Số hộ khẩu <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="household-number"
                    placeholder="VD: HK-001"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                  <p className="text-sm text-[#212121]">
                    Số hộ khẩu theo định dạng HK-XXX
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="registration-date" className="text-[#212121]">
                    Ngày đăng ký <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <input
                    id="registration-date"
                    type="date"
                    defaultValue="2025-11-03"
                    className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-[#212121]">
                    Trạng thái <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue="pending">
                    <SelectTrigger id="status" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xác minh</SelectItem>
                      <SelectItem value="verified">Đã xác minh</SelectItem>
                      <SelectItem value="inactive">Tạm ngừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <MapPin className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Địa chỉ Thường trú
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="street-address" className="text-[#212121]">
                    Số nhà, tên đường <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="street-address"
                    placeholder="VD: 25 Nguyễn Trãi"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ward" className="text-[#212121]">
                      Phường/Xã <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="dongda">
                      <SelectTrigger id="ward" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dongda">Phường Đống Đa</SelectItem>
                        <SelectItem value="vanmieu">Phường Văn Miếu</SelectItem>
                        <SelectItem value="quoctu">Phường Quốc Tử Giám</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="district" className="text-[#212121]">
                      Quận/Huyện <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="dongda-district">
                      <SelectTrigger id="district" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dongda-district">Quận Đống Đa</SelectItem>
                        <SelectItem value="badinh">Quận Ba Đình</SelectItem>
                        <SelectItem value="hoankiem">Quận Hoàn Kiếm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-[#212121]">
                      Tỉnh/Thành phố <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="hanoi">
                      <SelectTrigger id="city" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="group" className="text-[#212121]">
                      Tổ dân phố <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="group" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tổ 1</SelectItem>
                        <SelectItem value="2">Tổ 2</SelectItem>
                        <SelectItem value="3">Tổ 3</SelectItem>
                        <SelectItem value="4">Tổ 4</SelectItem>
                        <SelectItem value="5">Tổ 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Head of Household */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Users className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Chủ hộ
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="owner-name" className="text-[#212121]">
                    Họ và tên <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="owner-name"
                    placeholder="VD: Nguyễn Văn An"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="id-number" className="text-[#212121]">
                      Số CCCD/CMND <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="id-number"
                      placeholder="VD: 001088012345"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="birth-date" className="text-[#212121]">
                      Ngày sinh <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <input
                      id="birth-date"
                      type="date"
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-[#212121]">
                      Giới tính <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="male">
                      <SelectTrigger id="gender" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[#212121]">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      placeholder="VD: 0912345678"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#212121]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="VD: nguyenvanan@example.com"
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
                  Lưu Hộ khẩu
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/households')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Sau khi Tạo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">1.</span>
                    <span>Thêm các thành viên khác vào hộ khẩu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">2.</span>
                    <span>Xác minh thông tin hộ khẩu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">3.</span>
                    <span>Báo cáo lên cấp trên nếu cần</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Hướng dẫn
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Kiểm tra kỹ thông tin trước khi lưu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Số hộ khẩu phải duy nhất trong hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Chủ hộ phải là người đầu tiên trong hộ khẩu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Địa chỉ phải nằm trong khu vực quản lý của bạn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Trường có dấu <span className="text-[#B71C1C]">*</span> là bắt buộc</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
