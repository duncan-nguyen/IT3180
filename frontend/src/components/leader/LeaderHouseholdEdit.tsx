import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, Home, Users, MapPin, AlertCircle, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LeaderHouseholdEditProps {
  onLogout: () => void;
}

export default function LeaderHouseholdEdit({ onLogout }: LeaderHouseholdEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - would come from API
  const householdData = {
    id: 'HK-001',
    number: 'HK-001',
    registrationDate: '2025-01-15',
    status: 'verified',
    address: {
      street: '25 Nguyễn Trãi',
      ward: 'dongda',
      district: 'dongda-district',
      city: 'hanoi',
      group: '5',
    },
    owner: {
      name: 'Nguyễn Văn An',
      idNumber: '001088012345',
      birthDate: '1975-03-15',
      gender: 'male',
      phone: '0912345678',
      email: 'nguyenvanan@example.com',
    },
    members: 4,
  };

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
            Chỉnh sửa Hộ khẩu
          </h1>
          <p className="text-[#212121]">
            Cập nhật thông tin hộ khẩu: {householdData.id}
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
                    defaultValue={householdData.number}
                    className="h-12 border-2 border-[#212121]/20"
                    disabled
                  />
                  <p className="text-sm text-[#212121]">
                    Số hộ khẩu không thể thay đổi sau khi tạo
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="registration-date" className="text-[#212121]">
                    Ngày đăng ký <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <input
                    id="registration-date"
                    type="date"
                    defaultValue={householdData.registrationDate}
                    className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-[#212121]">
                    Trạng thái <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue={householdData.status}>
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
                    defaultValue={householdData.address.street}
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ward" className="text-[#212121]">
                      Phường/Xã <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue={householdData.address.ward}>
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
                    <Select defaultValue={householdData.address.district}>
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
                    <Select defaultValue={householdData.address.city}>
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
                    <Select defaultValue={householdData.address.group}>
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
                    defaultValue={householdData.owner.name}
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
                      defaultValue={householdData.owner.idNumber}
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
                      defaultValue={householdData.owner.birthDate}
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-[#212121]">
                      Giới tính <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue={householdData.owner.gender}>
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
                      defaultValue={householdData.owner.phone}
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
                    defaultValue={householdData.owner.email}
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
                  Lưu Thay đổi
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

            {/* Current Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Số hộ khẩu
                  </p>
                  <p className="text-[#212121]">
                    <strong>{householdData.id}</strong>
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Số thành viên
                  </p>
                  <p className="text-xl text-[#212121]">
                    {householdData.members} người
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Trạng thái
                  </p>
                  <span className="inline-block px-3 py-1 rounded bg-[#1B5E20] text-white">
                    Đã xác minh
                  </span>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Ngày tạo
                  </p>
                  <p className="text-[#212121]">
                    15/01/2025
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#212121]">
                    Thành viên ({householdData.members})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-2 border-[#0D47A1]/30"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#212121]">
                  <li className="p-2 bg-white rounded">
                    <strong>Nguyễn Văn An</strong> (Chủ hộ)
                  </li>
                  <li className="p-2 bg-white rounded">
                    Trần Thị Bình (Vợ/chồng)
                  </li>
                  <li className="p-2 bg-white rounded">
                    Nguyễn Văn Cường (Con)
                  </li>
                  <li className="p-2 bg-white rounded">
                    Nguyễn Thị Dung (Con)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Lưu ý
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Mọi thay đổi sẽ được ghi vào nhật ký</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Thay đổi chủ hộ cần phê duyệt cấp trên</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Kiểm tra kỹ trước khi lưu</span>
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
