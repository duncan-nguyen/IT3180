import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, User, Home, Briefcase, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderResidentCreateProps {
  onLogout: () => void;
}

export default function LeaderResidentCreate({ onLogout }: LeaderResidentCreateProps) {
  const navigate = useNavigate();

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/residents')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Thêm Nhân khẩu Mới
          </h1>
          <p className="text-[#212121]">
            Thêm thành viên mới vào hộ khẩu trong khu vực quản lý
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Cá nhân
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="full-name" className="text-[#212121]">
                    Họ và tên <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="full-name"
                    placeholder="VD: Nguyễn Văn An"
                    className="h-12 border-2 border-[#212121]/20"
                  />
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

                <div className="space-y-3">
                  <Label htmlFor="birth-place" className="text-[#212121]">
                    Nơi sinh
                  </Label>
                  <Input
                    id="birth-place"
                    placeholder="VD: Hà Nội"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="id-number" className="text-[#212121]">
                      Số CCCD/CMND
                    </Label>
                    <Input
                      id="id-number"
                      placeholder="VD: 001088012345"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                    <p className="text-sm text-[#212121]">
                      Để trống nếu chưa có (trẻ em dưới 14 tuổi)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="id-issue-date" className="text-[#212121]">
                      Ngày cấp CCCD/CMND
                    </Label>
                    <input
                      id="id-issue-date"
                      type="date"
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="id-issue-place" className="text-[#212121]">
                    Nơi cấp CCCD/CMND
                  </Label>
                  <Input
                    id="id-issue-place"
                    placeholder="VD: Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="nationality" className="text-[#212121]">
                      Quốc tịch <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="vn">
                      <SelectTrigger id="nationality" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vn">Việt Nam</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="ethnicity" className="text-[#212121]">
                      Dân tộc
                    </Label>
                    <Select defaultValue="kinh">
                      <SelectTrigger id="ethnicity" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kinh">Kinh</SelectItem>
                        <SelectItem value="tay">Tày</SelectItem>
                        <SelectItem value="thai">Thái</SelectItem>
                        <SelectItem value="muong">Mường</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Household Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Home className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="household" className="text-[#212121]">
                    Số hộ khẩu <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger id="household" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue placeholder="Chọn hộ khẩu..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HK-001">HK-001 - Nguyễn Văn An (25 Nguyễn Trãi)</SelectItem>
                      <SelectItem value="HK-002">HK-002 - Trần Thị Bình (30 Lê Lợi)</SelectItem>
                      <SelectItem value="HK-003">HK-003 - Lê Văn Cường (15 Hai Bà Trưng)</SelectItem>
                      <SelectItem value="HK-004">HK-004 - Phạm Thị Dung (42 Trần Hưng Đạo)</SelectItem>
                      <SelectItem value="HK-005">HK-005 - Hoàng Văn Em (8 Lý Thường Kiệt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="relation" className="text-[#212121]">
                    Quan hệ với chủ hộ <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger id="relation" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue placeholder="Chọn quan hệ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Chủ hộ</SelectItem>
                      <SelectItem value="spouse">Vợ/Chồng</SelectItem>
                      <SelectItem value="son">Con trai</SelectItem>
                      <SelectItem value="daughter">Con gái</SelectItem>
                      <SelectItem value="father">Bố</SelectItem>
                      <SelectItem value="mother">Mẹ</SelectItem>
                      <SelectItem value="sibling">Anh/Chị/Em</SelectItem>
                      <SelectItem value="grandparent">Ông/Bà</SelectItem>
                      <SelectItem value="grandchild">Cháu</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="residence-status" className="text-[#212121]">
                    Tình trạng cư trú <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue="permanent">
                    <SelectTrigger id="residence-status" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Thường trú</SelectItem>
                      <SelectItem value="temporary">Tạm trú</SelectItem>
                      <SelectItem value="absent">Tạm vắng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="registration-date" className="text-[#212121]">
                    Ngày đăng ký
                  </Label>
                  <input
                    id="registration-date"
                    type="date"
                    defaultValue="2025-11-03"
                    className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Work Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Briefcase className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Liên hệ & Nghề nghiệp
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-3">
                  <Label htmlFor="education" className="text-[#212121]">
                    Trình độ học vấn
                  </Label>
                  <Select>
                    <SelectTrigger id="education" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue placeholder="Chọn trình độ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Chưa học</SelectItem>
                      <SelectItem value="primary">Tiểu học</SelectItem>
                      <SelectItem value="secondary">THCS</SelectItem>
                      <SelectItem value="high-school">THPT</SelectItem>
                      <SelectItem value="vocational">Trung cấp/Cao đẳng</SelectItem>
                      <SelectItem value="university">Đại học</SelectItem>
                      <SelectItem value="postgraduate">Sau đại học</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="occupation" className="text-[#212121]">
                    Nghề nghiệp
                  </Label>
                  <Input
                    id="occupation"
                    placeholder="VD: Kỹ sư, Giáo viên, Học sinh..."
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="workplace" className="text-[#212121]">
                    Nơi làm việc/Học tập
                  </Label>
                  <Input
                    id="workplace"
                    placeholder="VD: Công ty ABC, Trường THPT XYZ..."
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
                  Lưu Nhân khẩu
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/residents')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
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
                    <span>Trường có dấu <span className="text-[#B71C1C]">*</span> là bắt buộc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Trẻ em dưới 14 tuổi có thể chưa có CCCD/CMND</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Chủ hộ phải được thêm trước khi thêm các thành viên khác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Kiểm tra kỹ thông tin CCCD/CMND để tránh trùng lặp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Quan hệ với chủ hộ phải chính xác theo giấy tờ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Required Fields */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Bắt buộc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#212121]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Họ và tên</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Giới tính</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Ngày sinh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Quốc tịch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Số hộ khẩu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Quan hệ với chủ hộ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#B71C1C]">✓</span>
                    <span>Tình trạng cư trú</span>
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
