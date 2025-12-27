import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Download, Filter, Search, User, Shield, Database, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLogsProps {
  onLogout: () => void;
}

const activityLogs = [
  {
    id: 1,
    timestamp: '03/11/2025 14:32',
    user: 'admin@dongda.gov.vn',
    role: 'Admin',
    action: 'Tạo tài khoản mới',
    details: 'Tạo tài khoản cho Nguyễn Văn A (Tổ trưởng Tổ 5)',
    type: 'account',
    status: 'success',
  },
  {
    id: 2,
    timestamp: '03/11/2025 14:15',
    user: 'canbo.dongda@gov.vn',
    role: 'Cán bộ',
    action: 'Cập nhật kiến nghị',
    details: 'Chuyển kiến nghị #KB-2025-156 cho Công an Phường',
    type: 'feedback',
    status: 'success',
  },
  {
    id: 3,
    timestamp: '03/11/2025 13:58',
    user: 'admin@dongda.gov.vn',
    role: 'Admin',
    action: 'Thay đổi cấu hình',
    details: 'Cập nhật thời gian timeout phiên: 30 phút',
    type: 'settings',
    status: 'success',
  },
  {
    id: 4,
    timestamp: '03/11/2025 13:45',
    user: 'nguyen.vana@dongda.gov.vn',
    role: 'Tổ trưởng',
    action: 'Thêm hộ khẩu',
    details: 'Thêm hộ khẩu mới tại 15 Nguyễn Lương Bằng',
    type: 'household',
    status: 'success',
  },
  {
    id: 5,
    timestamp: '03/11/2025 13:30',
    user: 'unknown@email.com',
    role: 'Unknown',
    action: 'Đăng nhập thất bại',
    details: 'Sai mật khẩu 3 lần liên tiếp',
    type: 'security',
    status: 'error',
  },
  {
    id: 6,
    timestamp: '03/11/2025 12:22',
    user: 'admin@dongda.gov.vn',
    role: 'Admin',
    action: 'Sao lưu dữ liệu',
    details: 'Tự động sao lưu cơ sở dữ liệu - 2.4 GB',
    type: 'database',
    status: 'success',
  },
  {
    id: 7,
    timestamp: '03/11/2025 11:15',
    user: 'canbo.dongda@gov.vn',
    role: 'Cán bộ',
    action: 'Xuất báo cáo',
    details: 'Xuất báo cáo thống kê tháng 10/2025',
    type: 'report',
    status: 'success',
  },
  {
    id: 8,
    timestamp: '03/11/2025 10:48',
    user: 'admin@dongda.gov.vn',
    role: 'Admin',
    action: 'Phân quyền',
    details: 'Cập nhật quyền cho vai trò Tổ trưởng',
    type: 'permission',
    status: 'success',
  },
  {
    id: 9,
    timestamp: '03/11/2025 10:30',
    user: 'tran.thib@citizen.vn',
    role: 'Người dân',
    action: 'Gửi kiến nghị',
    details: 'Gửi kiến nghị về đèn đường hỏng',
    type: 'feedback',
    status: 'success',
  },
  {
    id: 10,
    timestamp: '03/11/2025 09:15',
    user: 'admin@dongda.gov.vn',
    role: 'Admin',
    action: 'Đăng nhập',
    details: 'Đăng nhập thành công từ IP 192.168.1.100',
    type: 'security',
    status: 'success',
  },
];

const getActionIcon = (type: string) => {
  switch (type) {
    case 'account':
      return User;
    case 'security':
    case 'permission':
      return Shield;
    case 'database':
      return Database;
    case 'settings':
      return Settings;
    default:
      return FileText;
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case 'security':
      return '#B71C1C';
    case 'account':
    case 'permission':
      return '#0D47A1';
    case 'database':
      return '#E65100';
    case 'settings':
      return '#1B5E20';
    default:
      return '#212121';
  }
};

export default function AdminLogs({ onLogout }: AdminLogsProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 247;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Nhật ký Hoạt động
          </h1>
          <p className="text-[#212121]">
            Theo dõi tất cả hoạt động và thay đổi trong hệ thống
          </p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-[#212121]/10 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-[#0D47A1]" />
              <CardTitle className="text-[#212121]">
                Bộ lọc
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-[#212121]">Loại hoạt động</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-12 border-2 border-[#212121]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="account">Tài khoản</SelectItem>
                    <SelectItem value="feedback">Kiến nghị</SelectItem>
                    <SelectItem value="security">Bảo mật</SelectItem>
                    <SelectItem value="database">Cơ sở dữ liệu</SelectItem>
                    <SelectItem value="settings">Cấu hình</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#212121]">Vai trò</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-12 border-2 border-[#212121]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="official">Cán bộ</SelectItem>
                    <SelectItem value="leader">Tổ trưởng</SelectItem>
                    <SelectItem value="citizen">Người dân</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#212121]">Trạng thái</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-12 border-2 border-[#212121]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="error">Lỗi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#212121]">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#212121]/50" />
                  <Input
                    placeholder="Tìm theo người dùng..."
                    className="h-12 pl-12 border-2 border-[#212121]/20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <FileText className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Hôm nay</p>
                  <p className="text-3xl text-[#212121]">247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#1B5E20]/10">
                  <Shield className="w-8 h-8 text-[#1B5E20]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Thành công</p>
                  <p className="text-3xl text-[#212121]">243</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#B71C1C]/10">
                  <Shield className="w-8 h-8 text-[#B71C1C]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Lỗi</p>
                  <p className="text-3xl text-[#212121]">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <User className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Người dùng</p>
                  <p className="text-3xl text-[#212121]">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#212121]">
              Nhật ký gần đây
            </CardTitle>
            <Button 
              variant="outline" 
              className="h-12 border-2 border-[#212121]/20"
              onClick={() => navigate('/admin/logs/export')}
            >
              <Download className="w-5 h-5 mr-2" />
              Xuất File
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.map((log) => {
                const Icon = getActionIcon(log.type);
                const color = getActionColor(log.type);

                return (
                  <div
                    key={log.id}
                    className="p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#E0E0E0] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-[#212121] mb-1">
                              {log.action}
                            </h3>
                            <p className="text-[#212121]">
                              {log.details}
                            </p>
                          </div>
                          <Badge
                            variant={log.status === 'success' ? 'default' : 'destructive'}
                            className={
                              log.status === 'success'
                                ? 'bg-[#1B5E20] hover:bg-[#1B5E20]/90'
                                : 'bg-[#B71C1C] hover:bg-[#B71C1C]/90'
                            }
                          >
                            {log.status === 'success' ? 'Thành công' : 'Lỗi'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[#212121]">
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {log.user}
                          </span>
                          <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {log.role}
                          </span>
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {log.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#212121]/10">
              <p className="text-[#212121]">
                Hiển thị {startItem}-{endItem} trong {totalItems} nhật ký
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-12 px-6 border-2 border-[#212121]/20"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[#212121]">
                    Trang {currentPage} / {totalPages}
                  </span>
                </div>
                <Button
                  className="h-12 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}