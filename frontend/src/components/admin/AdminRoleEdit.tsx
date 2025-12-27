import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { ArrowLeft, Save, Shield, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminRoleEditProps {
  onLogout: () => void;
}

const permissions = [
  {
    category: 'Quản lý Hộ khẩu',
    items: [
      { id: 'view_households', name: 'Xem danh sách hộ khẩu', enabled: true },
      { id: 'create_household', name: 'Thêm hộ khẩu mới', enabled: true },
      { id: 'edit_household', name: 'Sửa thông tin hộ khẩu', enabled: true },
      { id: 'delete_household', name: 'Xóa hộ khẩu', enabled: false },
    ],
  },
  {
    category: 'Quản lý Nhân khẩu',
    items: [
      { id: 'view_residents', name: 'Xem danh sách nhân khẩu', enabled: true },
      { id: 'create_resident', name: 'Thêm nhân khẩu mới', enabled: true },
      { id: 'edit_resident', name: 'Sửa thông tin nhân khẩu', enabled: true },
      { id: 'delete_resident', name: 'Xóa nhân khẩu', enabled: false },
    ],
  },
  {
    category: 'Quản lý Kiến nghị',
    items: [
      { id: 'view_feedback', name: 'Xem kiến nghị', enabled: true },
      { id: 'create_feedback', name: 'Gửi kiến nghị', enabled: true },
      { id: 'forward_feedback', name: 'Chuyển tiếp kiến nghị', enabled: true },
      { id: 'respond_feedback', name: 'Phản hồi kiến nghị', enabled: false },
      { id: 'close_feedback', name: 'Đóng kiến nghị', enabled: false },
    ],
  },
  {
    category: 'Báo cáo & Thống kê',
    items: [
      { id: 'view_reports', name: 'Xem báo cáo', enabled: true },
      { id: 'export_reports', name: 'Xuất báo cáo', enabled: true },
      { id: 'view_analytics', name: 'Xem phân tích dữ liệu', enabled: false },
    ],
  },
  {
    category: 'Quản trị Hệ thống',
    items: [
      { id: 'manage_users', name: 'Quản lý tài khoản', enabled: false },
      { id: 'manage_roles', name: 'Quản lý vai trò', enabled: false },
      { id: 'system_settings', name: 'Cấu hình hệ thống', enabled: false },
      { id: 'view_logs', name: 'Xem nhật ký', enabled: false },
    ],
  },
];

export default function AdminRoleEdit({ onLogout }: AdminRoleEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const roleInfo = {
    name: 'Tổ trưởng',
    code: 'LEADER',
    userCount: 7,
    color: '#1B5E20',
    description: 'Quản lý hộ khẩu, nhân khẩu và kiến nghị trong phạm vi tổ dân phố',
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Chỉnh sửa Vai trò
          </h1>
          <p className="text-[#212121]">
            Cập nhật thông tin và quyền hạn cho vai trò: {roleInfo.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${roleInfo.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: roleInfo.color }} />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Cơ bản
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="role-name" className="text-[#212121]">
                    Tên vai trò <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    defaultValue={roleInfo.name}
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="role-code" className="text-[#212121]">
                    Mã vai trò <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="role-code"
                    defaultValue={roleInfo.code}
                    className="h-12 border-2 border-[#212121]/20"
                  />
                  <p className="text-sm text-[#212121]">
                    Mã vai trò phải là chữ in hoa, không dấu, không khoảng trắng
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[#212121]">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    defaultValue={roleInfo.description}
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="color" className="text-[#212121]">
                    Màu sắc đại diện
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="color"
                      type="color"
                      defaultValue={roleInfo.color}
                      className="h-12 w-24 border-2 border-[#212121]/20"
                    />
                    <Input
                      type="text"
                      defaultValue={roleInfo.color}
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            {permissions.map((category, index) => (
              <Card key={index} className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                    >
                      <div>
                        <p className="text-[#212121]">
                          {permission.name}
                        </p>
                      </div>
                      <Switch defaultChecked={permission.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
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
                  onClick={() => navigate('/admin/roles')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Current Stats */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thống kê Hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Số người dùng
                  </p>
                  <p className="text-xl text-[#212121]">
                    {roleInfo.userCount} tài khoản
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Quyền đã bật
                  </p>
                  <p className="text-xl text-[#1B5E20]">
                    11/20
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Trạng thái
                  </p>
                  <span className="inline-block px-3 py-1 rounded bg-[#1B5E20] text-white">
                    Đang hoạt động
                  </span>
                </div>
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
                    <span>Thay đổi quyền hạn sẽ áp dụng cho tất cả {roleInfo.userCount} người dùng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Người dùng có thể cần đăng xuất và đăng nhập lại để cập nhật quyền</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Mọi thay đổi sẽ được ghi vào nhật ký hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Không nên thay đổi mã vai trò sau khi đã tạo</span>
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
