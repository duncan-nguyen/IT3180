import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, User, Shield, Clock, MapPin, Monitor, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminLogDetailProps {
  onLogout: () => void;
}

export default function AdminLogDetail({ onLogout }: AdminLogDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const logDetail = {
    id: id,
    timestamp: '03/11/2025 14:32:15',
    user: 'admin@dongda.gov.vn',
    userName: 'Nguyễn Văn Admin',
    role: 'Admin',
    action: 'Tạo tài khoản mới',
    details: 'Tạo tài khoản cho Nguyễn Văn A (Tổ trưởng Tổ 5)',
    type: 'account',
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'Hà Nội, Việt Nam',
    changes: [
      { field: 'Email', oldValue: '-', newValue: 'nguyenvana@example.com' },
      { field: 'Họ tên', oldValue: '-', newValue: 'Nguyễn Văn A' },
      { field: 'Vai trò', oldValue: '-', newValue: 'Tổ trưởng' },
      { field: 'Tổ dân phố', oldValue: '-', newValue: 'Tổ 5' },
      { field: 'Trạng thái', oldValue: '-', newValue: 'Đang hoạt động' },
    ],
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/logs')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3">
                Chi tiết Nhật ký #{logDetail.id}
              </h1>
              <p className="text-[#212121]">
                {logDetail.action}
              </p>
            </div>
            <Badge
              className={
                logDetail.status === 'success'
                  ? 'bg-[#1B5E20] hover:bg-[#1B5E20]/90 h-10 px-4'
                  : 'bg-[#B71C1C] hover:bg-[#B71C1C]/90 h-10 px-4'
              }
            >
              {logDetail.status === 'success' ? 'Thành công' : 'Lỗi'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Details */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-2">Loại hành động</p>
                    <p className="text-[#212121]">
                      {logDetail.type === 'account' ? 'Quản lý Tài khoản' : logDetail.type}
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-2">Trạng thái</p>
                    <Badge className={logDetail.status === 'success' ? 'bg-[#1B5E20]' : 'bg-[#B71C1C]'}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {logDetail.status === 'success' ? 'Thành công' : 'Lỗi'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-2">Mô tả chi tiết</p>
                  <p className="text-[#212121]">
                    {logDetail.details}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes Made */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Các Thay đổi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-[#212121]/10">
                      <tr>
                        <th className="text-left p-4 text-[#212121]">Trường</th>
                        <th className="text-left p-4 text-[#212121]">Giá trị cũ</th>
                        <th className="text-left p-4 text-[#212121]">Giá trị mới</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logDetail.changes.map((change, index) => (
                        <tr key={index} className="border-b border-[#212121]/10">
                          <td className="p-4 text-[#212121]">
                            {change.field}
                          </td>
                          <td className="p-4 text-[#212121]">
                            <span className="text-[#B71C1C]">{change.oldValue}</span>
                          </td>
                          <td className="p-4 text-[#212121]">
                            <span className="text-[#1B5E20]">{change.newValue}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Kỹ thuật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-[#0D47A1]" />
                    <p className="text-sm text-[#212121]">Địa chỉ IP</p>
                  </div>
                  <p className="text-[#212121]">
                    {logDetail.ipAddress}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-[#0D47A1]" />
                    <p className="text-sm text-[#212121]">Vị trí</p>
                  </div>
                  <p className="text-[#212121]">
                    {logDetail.location}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-5 h-5 text-[#0D47A1]" />
                    <p className="text-sm text-[#212121]">User Agent</p>
                  </div>
                  <p className="text-sm text-[#212121] break-all">
                    {logDetail.userAgent}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Người thực hiện
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Họ tên</p>
                  <p className="text-[#212121]">
                    {logDetail.userName}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Email</p>
                  <p className="text-[#212121]">
                    {logDetail.user}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-[#0D47A1]" />
                    <p className="text-sm text-[#212121]">Vai trò</p>
                  </div>
                  <p className="text-[#212121]">
                    {logDetail.role}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Time Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Clock className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thời gian
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Ngày giờ</p>
                  <p className="text-[#212121]">
                    {logDetail.timestamp}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Múi giờ</p>
                  <p className="text-[#212121]">
                    UTC+7 (Giờ Việt Nam)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/logs')}
                  className="w-full h-12 border-2 border-[#212121]/20"
                >
                  Quay lại Danh sách
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
