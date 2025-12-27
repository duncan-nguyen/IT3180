import { Database, Download, FileText, Filter, Search, Settings, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditLog, AuditLogStatsResponse, logsService } from '../../services/logs-service';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import AdminLayout from './AdminLayout';

interface AdminLogsProps {
  onLogout: () => void;
}

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

// Helper to map action to type for icon/color
const getActionType = (action: string): string => {
  const actionUpper = action.toUpperCase();
  if (actionUpper.includes('USER') || actionUpper.includes('ACCOUNT') || actionUpper.includes('LOCK')) {
    return 'account';
  }
  if (actionUpper.includes('LOGIN') || actionUpper.includes('LOGOUT') || actionUpper.includes('FAILED')) {
    return 'security';
  }
  if (actionUpper.includes('ROLE') || actionUpper.includes('PERMISSION')) {
    return 'permission';
  }
  if (actionUpper.includes('BACKUP') || actionUpper.includes('RESTORE')) {
    return 'database';
  }
  if (actionUpper.includes('SETTING') || actionUpper.includes('CONFIG')) {
    return 'settings';
  }
  return 'default';
};

// Helper to format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper to get Vietnamese role name
const getRoleDisplayName = (role: string | null): string => {
  if (!role) return 'Unknown';
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'can_bo_phuong': 'Cán bộ',
    'to_truong': 'Tổ trưởng',
    'nguoi_dan': 'Người dân',
  };
  return roleMap[role] || role;
};

export default function AdminLogs({ onLogout }: AdminLogsProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Filter states
  const [actionType, setActionType] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch logs data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await logsService.getLogs({
          page: currentPage,
          page_size: itemsPerPage,
          action_type: actionType !== 'all' ? actionType : undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery || undefined,
        });

        setLogs(response.logs);
        setTotalItems(response.total);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, actionType, roleFilter, statusFilter, searchQuery]);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await logsService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

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
                <Select value={actionType} onValueChange={setActionType}>
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
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-12 border-2 border-[#212121]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="can_bo_phuong">Cán bộ</SelectItem>
                    <SelectItem value="to_truong">Tổ trưởng</SelectItem>
                    <SelectItem value="nguoi_dan">Người dân</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#212121]">Trạng thái</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  <p className="text-3xl text-[#212121]">{stats?.today_count || 0}</p>
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
                  <p className="text-3xl text-[#212121]">{stats?.success_count || 0}</p>
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
                  <p className="text-3xl text-[#212121]">{stats?.error_count || 0}</p>
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
                  <p className="text-3xl text-[#212121]">{stats?.unique_users || 0}</p>
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-[#212121]">Đang tải dữ liệu...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-[#212121]">Không có nhật ký nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => {
                  const type = getActionType(log.action);
                  const Icon = getActionIcon(type);
                  const color = getActionColor(type);

                  return (
                    <div
                      key={log.id}
                      className="p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#E0E0E0] transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/logs/${log.id}`)}
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
                                {log.entity_name}
                              </p>
                            </div>
                            <Badge
                              className="bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                            >
                              Thành công
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-[#212121]">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {log.username || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              {getRoleDisplayName(log.user_role)}
                            </span>
                            <span className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

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