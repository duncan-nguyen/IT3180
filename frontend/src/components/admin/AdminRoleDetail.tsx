import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { ArrowLeft, Save, Shield, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminRoleDetailProps {
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

export default function AdminRoleDetail({ onLogout }: AdminRoleDetailProps) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3">
                Chi tiết Vai trò: {roleInfo.name}
              </h1>
              <p className="text-[#212121]">
                {roleInfo.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="h-10 px-4 border-2 text-[#212121]"
            >
              {roleInfo.code}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permissions List */}
          <div className="lg:col-span-2 space-y-6">
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
            {/* Role Info */}
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
                    Thông tin Vai trò
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Tên vai trò</p>
                  <p className="text-[#212121]">
                    {roleInfo.name}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Mã vai trò</p>
                  <p className="text-[#212121]">
                    {roleInfo.code}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                  <Users className="w-6 h-6 text-[#0D47A1]" />
                  <div>
                    <p className="text-sm text-[#212121]">Số người dùng</p>
                    <p className="text-xl text-[#212121]">
                      {roleInfo.userCount} tài khoản
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  Lưu Quyền hạn
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

            {/* Permission Summary */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Tóm tắt Quyền hạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Tổng quyền:</span>
                  <span className="text-[#212121]">20</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Đã bật:</span>
                  <span className="text-[#1B5E20]">11</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Đã tắt:</span>
                  <span className="text-[#B71C1C]">9</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
