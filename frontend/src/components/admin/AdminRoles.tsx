import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Shield, Edit, Users, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminRolesProps {
  onLogout: () => void;
}

const roles = [
  {
    id: 1,
    name: 'Người dân',
    code: 'CITIZEN',
    userCount: 1245,
    color: '#0D47A1',
    permissions: [
      'Xem thông tin hộ khẩu của mình',
      'Gửi kiến nghị, phản ánh',
      'Xem trạng thái kiến nghị đã gửi',
      'Cập nhật thông tin cá nhân',
    ],
  },
  {
    id: 2,
    name: 'Tổ trưởng',
    code: 'LEADER',
    userCount: 7,
    color: '#1B5E20',
    permissions: [
      'Quản lý danh sách hộ khẩu trong tổ',
      'Quản lý danh sách nhân khẩu trong tổ',
      'Xem và chuyển tiếp kiến nghị',
      'Thêm, sửa, xóa thông tin hộ/nhân khẩu',
      'Xuất báo cáo thống kê cấp tổ',
    ],
  },
  {
    id: 3,
    name: 'Cán bộ Phường/Xã',
    code: 'OFFICIAL',
    userCount: 3,
    color: '#E65100',
    permissions: [
      'Xem toàn bộ kiến nghị của phường',
      'Chuyển tiếp kiến nghị cho cơ quan chức năng',
      'Theo dõi tiến độ xử lý',
      'Cập nhật trạng thái và phản hồi',
      'Xuất báo cáo thống kê cấp phường',
    ],
  },
  {
    id: 4,
    name: 'Quản trị viên',
    code: 'ADMIN',
    userCount: 2,
    color: '#B71C1C',
    permissions: [
      'Toàn quyền quản lý tài khoản',
      'Phân quyền và vai trò',
      'Cấu hình hệ thống',
      'Xem nhật ký hoạt động',
      'Quản lý dữ liệu toàn hệ thống',
    ],
  },
];

export default function AdminRoles({ onLogout }: AdminRolesProps) {
  const navigate = useNavigate();

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Phân quyền & Vai trò
          </h1>
          <p className="text-[#212121]">
            Quản lý vai trò và quyền hạn trong hệ thống
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader className="border-b border-[#212121]/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${role.color}20` }}>
                      <Shield className="w-8 h-8" style={{ color: role.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-[#212121] mb-2">
                        {role.name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className="border-[#212121]/20 text-[#212121]"
                      >
                        {role.code}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 px-4 border-2 border-[#212121]/20"
                    onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Sửa
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* User Count */}
                <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                  <Users className="w-6 h-6 text-[#0D47A1]" />
                  <div>
                    <p className="text-sm text-[#212121]">Số người dùng</p>
                    <p className="text-xl text-[#212121]">
                      {role.userCount} tài khoản
                    </p>
                  </div>
                </div>

                {/* Permissions List */}
                <div>
                  <h3 className="text-[#212121] mb-3">
                    Quyền hạn:
                  </h3>
                  <ul className="space-y-2">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: role.color }}
                          />
                        </div>
                        <p className="text-[#212121] flex-1">
                          {permission}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#212121]/10">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-2 border-[#212121]/20"
                    onClick={() => navigate(`/admin/roles/${role.id}/detail`)}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Chi tiết
                  </Button>
                  {role.code !== 'ADMIN' && (
                    <Button
                      variant="outline"
                      className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                      onClick={() => navigate(`/admin/roles/${role.id}/delete`)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission Matrix Summary */}
        <Card className="border-2 border-[#212121]/10 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Ma trận Phân quyền
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#212121]/10">
                    <th className="text-left p-4 text-[#212121]">
                      Chức năng
                    </th>
                    <th className="text-center p-4 text-[#212121]">
                      Người dân
                    </th>
                    <th className="text-center p-4 text-[#212121]">
                      Tổ trưởng
                    </th>
                    <th className="text-center p-4 text-[#212121]">
                      Cán bộ
                    </th>
                    <th className="text-center p-4 text-[#212121]">
                      Admin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#212121]/10">
                    <td className="p-4 text-[#212121]">Xem hộ khẩu</td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#0D47A1]">Của mình</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Cấp Tổ</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn phường</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn bộ</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-[#212121]/10">
                    <td className="p-4 text-[#212121]">Sửa hộ khẩu</td>
                    <td className="text-center p-4">
                      <Badge variant="outline" className="border-[#B71C1C]/30 text-[#B71C1C]">Không</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Cấp Tổ</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn phường</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn bộ</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-[#212121]/10">
                    <td className="p-4 text-[#212121]">Gửi kiến nghị</td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Có</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Có</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Có</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Có</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-[#212121]/10">
                    <td className="p-4 text-[#212121]">Xử lý kiến nghị</td>
                    <td className="text-center p-4">
                      <Badge variant="outline" className="border-[#B71C1C]/30 text-[#B71C1C]">Không</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#0D47A1]">Chuyển tiếp</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn quyền</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn quyền</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-[#212121]/10">
                    <td className="p-4 text-[#212121]">Quản lý tài khoản</td>
                    <td className="text-center p-4">
                      <Badge variant="outline" className="border-[#B71C1C]/30 text-[#B71C1C]">Không</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge variant="outline" className="border-[#B71C1C]/30 text-[#B71C1C]">Không</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge variant="outline" className="border-[#B71C1C]/30 text-[#B71C1C]">Không</Badge>
                    </td>
                    <td className="text-center p-4">
                      <Badge className="bg-[#1B5E20]">Toàn quyền</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}